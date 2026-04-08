"""Rule-based validation for ingested payloads. Extend `rule_type` + evaluators as needed."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from decimal import Decimal, InvalidOperation
from typing import Any


@dataclass(frozen=True)
class RuleOutcome:
    passed: bool
    message: str | None = None
    context: dict[str, Any] | None = None


def evaluate_rule(rule_type: str, definition: dict[str, Any], payload: dict[str, Any]) -> RuleOutcome:
    match rule_type:
        case "required_fields":
            fields = definition.get("fields") or []
            missing = [f for f in fields if f not in payload or payload.get(f) in (None, "")]
            if missing:
                return RuleOutcome(False, f"Missing fields: {missing}", {"missing": missing})
            return RuleOutcome(True)
        case "amount_non_negative":
            key = definition.get("field", "amount")
            raw = payload.get(key)
            if raw is None:
                return RuleOutcome(False, f"Field {key!r} missing for amount check")
            try:
                val = Decimal(str(raw))
            except (InvalidOperation, ValueError, TypeError):
                return RuleOutcome(False, f"Field {key!r} is not numeric")
            if val < 0:
                return RuleOutcome(False, f"Field {key!r} must be >= 0", {"value": str(val)})
            return RuleOutcome(True)
        case "business_date_not_future":
            key = definition.get("field", "business_date")
            raw = payload.get(key)
            if raw is None:
                return RuleOutcome(True)
            if isinstance(raw, date):
                d = raw
            else:
                try:
                    d = date.fromisoformat(str(raw)[:10])
                except ValueError:
                    return RuleOutcome(False, f"Field {key!r} is not a valid date")
            if d > date.today():
                return RuleOutcome(False, "business_date cannot be in the future", {"value": str(d)})
            return RuleOutcome(True)
        case _:
            return RuleOutcome(False, f"Unknown rule_type: {rule_type}")
