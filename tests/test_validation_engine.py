from datetime import date, timedelta

from banking_alm.modules.data_integration.validation_engine import evaluate_rule


def test_required_fields_pass():
    o = evaluate_rule(
        "required_fields",
        {"fields": ["a", "b"]},
        {"a": 1, "b": 2},
    )
    assert o.passed


def test_required_fields_fail():
    o = evaluate_rule("required_fields", {"fields": ["a"]}, {"b": 1})
    assert not o.passed


def test_amount_non_negative():
    assert evaluate_rule("amount_non_negative", {"field": "amount"}, {"amount": "0"}).passed
    assert not evaluate_rule("amount_non_negative", {"field": "amount"}, {"amount": "-1"}).passed


def test_business_date_not_future():
    past = (date.today() - timedelta(days=1)).isoformat()
    assert evaluate_rule(
        "business_date_not_future",
        {"field": "business_date"},
        {"business_date": past},
    ).passed
    future = (date.today() + timedelta(days=1)).isoformat()
    assert not evaluate_rule(
        "business_date_not_future",
        {"field": "business_date"},
        {"business_date": future},
    ).passed
