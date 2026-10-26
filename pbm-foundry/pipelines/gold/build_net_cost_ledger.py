"""Immutable settlement events; corrections append events rather than overwrite history."""
from dataclasses import dataclass
from decimal import Decimal

@dataclass(frozen=True)
class SettlementEvent:
    claim_id: str
    event_type: str
    amount: Decimal
    source_record_id: str

def net_cost(events: list[SettlementEvent]) -> Decimal:
    return sum((event.amount for event in events), Decimal("0"))

def claim_events(claim: dict, rebate: Decimal = Decimal("0"), credits: Decimal = Decimal("0")):
    yield SettlementEvent(claim["claim_id"], "plan_paid", Decimal(str(claim["plan_paid"])), claim["source_record_id"])
    if rebate:
        yield SettlementEvent(claim["claim_id"], "rebate", -rebate, f"rebate:{claim['claim_id']}")
    if credits:
        yield SettlementEvent(claim["claim_id"], "other_credit", -credits, f"credit:{claim['claim_id']}")
