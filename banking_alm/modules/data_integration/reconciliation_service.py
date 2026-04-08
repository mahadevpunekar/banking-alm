"""CBS vs GL style reconciliation from normalized staging aggregates."""

from __future__ import annotations

from datetime import date
from decimal import Decimal
from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from banking_alm.modules.data_integration.models import (
    IngestionBatch,
    IngestionStatus,
    ReconciliationRun,
    ReconciliationStatus,
    StagingRecord,
)


async def _totals_by_currency(
    session: AsyncSession, *, source: str, business_date: date
) -> dict[str, Decimal]:
    q = (
        select(StagingRecord)
        .join(IngestionBatch, StagingRecord.batch_id == IngestionBatch.id)
        .options(joinedload(StagingRecord.batch))
        .where(
            StagingRecord.source_system == source,
            IngestionBatch.business_date == business_date,
            IngestionBatch.status == IngestionStatus.VALIDATED.value,
            StagingRecord.normalized_payload.isnot(None),
        )
    )
    records = (await session.execute(q)).scalars().unique().all()
    totals: dict[str, Decimal] = {}
    for rec in records:
        p = rec.payload
        ccy = p.get("currency")
        if not ccy:
            continue
        raw_amt = p.get("amount")
        try:
            amt = Decimal(str(raw_amt)) if raw_amt is not None else Decimal("0")
        except (ValueError, TypeError, ArithmeticError):
            continue
        totals[str(ccy)] = totals.get(str(ccy), Decimal("0")) + amt
    return totals


async def run_cbs_gl_balance_reconciliation(
    session: AsyncSession,
    *,
    business_date: date,
    name: str = "CBS vs GL balances",
) -> ReconciliationRun:
    """Compare sum of `amount` by `currency` between CBS and GL validated staging rows."""

    cbs = await _totals_by_currency(session, source="CBS", business_date=business_date)
    gl = await _totals_by_currency(session, source="GL", business_date=business_date)

    all_ccy = set(cbs) | set(gl)
    variances: dict[str, Any] = {}
    for ccy in sorted(all_ccy):
        a = cbs.get(ccy, Decimal("0"))
        b = gl.get(ccy, Decimal("0"))
        diff = a - b
        if diff != 0:
            variances[ccy] = {"cbs": str(a), "gl": str(b), "diff": str(diff)}

    run = ReconciliationRun(
        name=name,
        primary_source="CBS",
        compare_source="GL",
        business_date=business_date,
        status=ReconciliationStatus.MATCHED.value if not variances else ReconciliationStatus.VARIANCE.value,
        summary={
            "cbs_totals": {k: str(v) for k, v in cbs.items()},
            "gl_totals": {k: str(v) for k, v in gl.items()},
            "variances": variances,
        },
    )
    session.add(run)
    await session.commit()
    await session.refresh(run)
    return run


async def get_reconciliation(session: AsyncSession, run_id: UUID) -> ReconciliationRun | None:
    return await session.get(ReconciliationRun, run_id)
