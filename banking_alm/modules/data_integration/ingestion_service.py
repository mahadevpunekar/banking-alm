from __future__ import annotations

from datetime import date
from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from banking_alm.modules.data_integration.models import (
    IngestionBatch,
    IngestionStatus,
    StagingRecord,
    ValidationResult,
    ValidationRule,
)
from banking_alm.modules.data_integration.validation_engine import evaluate_rule


async def create_batch_and_records(
    session: AsyncSession,
    *,
    source_system: str,
    mode: str,
    business_date: date | None,
    external_batch_id: str | None,
    rows: list[dict[str, Any]],
) -> IngestionBatch:
    batch = IngestionBatch(
        source_system=source_system,
        mode=mode,
        business_date=business_date,
        external_batch_id=external_batch_id,
        row_count=len(rows),
        status=IngestionStatus.RECEIVED.value,
    )
    session.add(batch)
    await session.flush()

    for row in rows:
        entity_type = str(row.get("entity_type") or "GENERIC")
        payload = row.get("payload")
        if not isinstance(payload, dict):
            payload = {}
        rec = StagingRecord(
            batch_id=batch.id,
            source_system=source_system,
            entity_type=entity_type,
            business_date=business_date or _parse_optional_date(payload.get("business_date")),
            source_record_id=row.get("source_record_id"),
            payload=payload,
        )
        session.add(rec)

    await session.commit()
    await session.refresh(batch)
    return batch


def _parse_optional_date(raw: Any) -> date | None:
    if raw is None:
        return None
    if isinstance(raw, date):
        return raw
    try:
        return date.fromisoformat(str(raw)[:10])
    except ValueError:
        return None


async def run_validation_for_batch(session: AsyncSession, batch_id: UUID) -> IngestionBatch:
    result = await session.execute(
        select(IngestionBatch)
        .options(selectinload(IngestionBatch.records))
        .where(IngestionBatch.id == batch_id)
    )
    batch = result.scalar_one_or_none()
    if batch is None:
        raise ValueError("batch not found")

    batch.status = IngestionStatus.VALIDATING.value
    await session.flush()

    rules_result = await session.execute(
        select(ValidationRule).where(
            ValidationRule.is_active.is_(True),
            (ValidationRule.source_system.is_(None)) | (ValidationRule.source_system == batch.source_system),
        )
    )
    rules = list(rules_result.scalars().all())

    all_errors: list[dict[str, Any]] = []
    for record in batch.records:
        record_errors: list[dict[str, Any]] = []
        applicable = [
            r
            for r in rules
            if (r.entity_type is None or r.entity_type == record.entity_type)
            and (r.source_system is None or r.source_system == record.source_system)
        ]
        for rule in applicable:
            outcome = evaluate_rule(rule.rule_type, rule.definition or {}, record.payload)
            vr = ValidationResult(
                batch_id=batch.id,
                rule_id=rule.id,
                passed=outcome.passed,
                detail={
                    "record_id": str(record.id),
                    "message": outcome.message,
                    **(outcome.context or {}),
                },
            )
            session.add(vr)
            if not outcome.passed:
                record_errors.append(
                    {"rule": rule.name, "rule_type": rule.rule_type, "message": outcome.message}
                )
        if record_errors:
            record.validation_errors = record_errors
            record.normalized_payload = None
            all_errors.extend(record_errors)
        else:
            record.validation_errors = None
            record.normalized_payload = _normalize_payload(record.payload)

    if all_errors:
        batch.status = IngestionStatus.FAILED.value
        batch.error_summary = f"{len(all_errors)} validation issue(s)"
    else:
        batch.status = IngestionStatus.VALIDATED.value
        batch.error_summary = None

    await session.commit()
    await session.refresh(batch)
    return batch


def _normalize_payload(payload: dict[str, Any]) -> dict[str, Any]:
    """Light normalization for ALM-ready staging; Module 2 will map to full ALM schema."""
    out = dict(payload)
    if "amount" in out and out["amount"] is not None:
        out["amount"] = str(out["amount"])
    return out


async def seed_default_validation_rules(session: AsyncSession) -> None:
    existing = await session.execute(select(ValidationRule).limit(1))
    if existing.scalar_one_or_none() is not None:
        return
    defaults = [
        ValidationRule(
            name="core_required_contract",
            source_system=None,
            entity_type="CONTRACT",
            rule_type="required_fields",
            definition={"fields": ["account_id", "currency", "amount", "maturity_date"]},
        ),
        ValidationRule(
            name="non_negative_amount",
            source_system=None,
            entity_type=None,
            rule_type="amount_non_negative",
            definition={"field": "amount"},
        ),
        ValidationRule(
            name="business_date_sanity",
            source_system=None,
            entity_type=None,
            rule_type="business_date_not_future",
            definition={"field": "business_date"},
        ),
    ]
    session.add_all(defaults)
    await session.commit()
