from decimal import Decimal

def net_pmpm(plan_paid, rebates, other_credits, member_months):
    if member_months <= 0:
        raise ValueError("member_months must be positive")
    return (Decimal(str(plan_paid)) - Decimal(str(rebates)) - Decimal(str(other_credits))) / Decimal(member_months)

def rebate_yield(rebates, eligible_gross_cost):
    if eligible_gross_cost <= 0:
        return Decimal("0")
    return Decimal(str(rebates)) / Decimal(str(eligible_gross_cost))

def pmpm_delta(current, baseline):
    return Decimal(str(current)) - Decimal(str(baseline))
