from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.models.models import Wedding, BudgetCategory, BudgetChangeRequest, PaymentRecord

def to_decimal(val: Any) -> Decimal:
    """Helper to convert float or int safely to Decimal."""
    if val is None:
        return Decimal("0.00")
    return Decimal(str(val)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

class FinancialService:
    @staticmethod
    def calculate_budget_summary(wedding: Wedding, db: Session) -> Dict[str, Any]:
        """
        Calculates an exact, decimal-safe financial summary for a given wedding.
        Guarantees mathematical consistency across all dashboards and reports.
        """
        approved_budget = to_decimal(wedding.total_budget)
        
        categories = db.query(BudgetCategory).filter(
            BudgetCategory.wedding_id == wedding.id
        ).all()

        total_allocated = Decimal("0.00")
        total_committed = Decimal("0.00")
        total_spent = Decimal("0.00")
        category_breakdown = []

        for c in categories:
            alloc = to_decimal(c.allocated_amount)
            commit = to_decimal(c.committed_amount)
            spent = to_decimal(c.actual_spent)
            variance = alloc - commit

            total_allocated += alloc
            total_committed += commit
            total_spent += spent

            category_breakdown.append({
                "id": c.id,
                "name": c.name,
                "allocated": float(alloc),
                "committed": float(commit),
                "actual_spent": float(spent),
                "variance": float(variance),
                "utilization_pct": float(round((commit / alloc * 100), 1)) if alloc > 0 else 0.0
            })

        # Calculate actual paid expenses from completed payment records
        completed_payments = db.query(PaymentRecord).filter(
            PaymentRecord.wedding_id == wedding.id,
            PaymentRecord.status == "completed"
        ).all()
        paid_expenses = sum(to_decimal(p.amount) for p in completed_payments)

        remaining_balance = approved_budget - total_spent
        spending_pct = round((total_spent / approved_budget * 100), 1) if approved_budget > 0 else Decimal("0.0")

        # Per guest calculation
        guest_count = wedding.estimated_guests or 1
        per_guest_cost = (approved_budget / Decimal(str(guest_count))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

        pending_requests = db.query(BudgetChangeRequest).filter(
            BudgetChangeRequest.wedding_id == wedding.id,
            BudgetChangeRequest.status == "pending"
        ).count()

        return {
            "wedding_id": wedding.id,
            "couple_names": wedding.couple_names,
            "total_approved_budget": float(approved_budget),
            "total_allocated": float(total_allocated),
            "total_committed": float(total_committed),
            "total_actual_spent": float(total_spent),
            "total_paid_expenses": float(paid_expenses),
            "remaining_balance": float(remaining_balance),
            "spending_percentage": float(spending_pct),
            "per_guest_cost": float(per_guest_cost),
            "is_overspending_risk": bool(total_committed > approved_budget),
            "categories": category_breakdown,
            "pending_requests_count": pending_requests
        }

    @staticmethod
    def calculate_guest_impact(
        wedding: Wedding,
        extra_guests: int,
        catering_price_per_plate: float = 2800.0,
        seating_cost_per_guest: float = 450.0,
        gift_favor_per_guest: float = 350.0
    ) -> Dict[str, Any]:
        """Calculates itemized cost additions for incremental wedding guest counts."""
        if extra_guests < 0:
            raise ValueError("Extra guest count cannot be negative.")

        dec_extra = Decimal(str(extra_guests))
        dec_plate = Decimal(str(catering_price_per_plate))
        dec_seating = Decimal(str(seating_cost_per_guest))
        dec_favors = Decimal(str(gift_favor_per_guest))

        catering_subtotal = dec_extra * dec_plate
        catering_gst = catering_subtotal * Decimal("0.18")
        seating_cost = dec_extra * dec_seating
        favors_cost = dec_extra * dec_favors
        total_impact = catering_subtotal + catering_gst + seating_cost + favors_cost

        current_budget = to_decimal(wedding.total_budget)
        projected_budget = current_budget + total_impact
        current_guests = wedding.estimated_guests or 0
        projected_guests = current_guests + extra_guests

        return {
            "additional_guests": extra_guests,
            "current_guests": current_guests,
            "projected_guests": projected_guests,
            "cost_breakdown": {
                "catering_subtotal": float(catering_subtotal.quantize(Decimal("1.00"))),
                "catering_gst_18pct": float(catering_gst.quantize(Decimal("1.00"))),
                "seating_and_tableware": float(seating_cost.quantize(Decimal("1.00"))),
                "guest_favors_and_amenities": float(favors_cost.quantize(Decimal("1.00"))),
                "total_estimated_impact": float(total_impact.quantize(Decimal("1.00")))
            },
            "current_total_budget": float(current_budget),
            "projected_total_budget": float(projected_budget.quantize(Decimal("1.00")))
        }
