from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.models import (
    Wedding, BudgetCategory, BudgetChangeRequest, User, Quotation
)
from backend.app.schemas.schemas import (
    BudgetCategoryResponse, BudgetChangeRequestResponse,
    BudgetChangeRequestCreate, BudgetSimulateRequest
)
from backend.app.routers.auth import get_current_user

router = APIRouter(prefix="/budgets", tags=["Budget Guardian"])

@router.get("/wedding/{wedding_id}/overview")
def get_budget_overview(wedding_id: str, db: Session = Depends(get_db)):
    wedding = db.query(Wedding).filter(Wedding.id == wedding_id).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")

    categories = db.query(BudgetCategory).filter(
        BudgetCategory.wedding_id == wedding_id
    ).all()

    total_allocated = sum(c.allocated_amount for c in categories) or wedding.total_budget
    total_committed = sum(c.committed_amount for c in categories)
    total_spent = sum(c.actual_spent for c in categories)
    remaining_balance = wedding.total_budget - total_spent

    pending_change_requests = db.query(BudgetChangeRequest).filter(
        BudgetChangeRequest.wedding_id == wedding_id,
        BudgetChangeRequest.status == "pending"
    ).all()

    return {
        "wedding_id": wedding.id,
        "couple_names": wedding.couple_names,
        "total_approved_budget": wedding.total_budget,
        "total_allocated": total_allocated,
        "total_committed": total_committed,
        "total_actual_spent": total_spent,
        "remaining_balance": remaining_balance,
        "spending_percentage": round((total_spent / wedding.total_budget) * 100, 1) if wedding.total_budget > 0 else 0,
        "is_overspending_risk": (total_committed > wedding.total_budget),
        "categories": [
            {
                "id": c.id,
                "name": c.name,
                "allocated": c.allocated_amount,
                "committed": c.committed_amount,
                "actual_spent": c.actual_spent,
                "variance": round(c.allocated_amount - c.committed_amount, 2)
            }
            for c in categories
        ],
        "pending_requests_count": len(pending_change_requests)
    }

@router.post("/wedding/{wedding_id}/simulate-extra-guests")
def simulate_extra_guests(
    wedding_id: str,
    payload: BudgetSimulateRequest,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Evaluates the financial impact of adding N guests (e.g., 60 additional guests)
    using the active catering quotation and banquet capacity parameters.
    """
    wedding = db.query(Wedding).filter(Wedding.id == wedding_id).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")

    # Find accepted catering quote or default
    active_quote = db.query(Quotation).filter(
        Quotation.wedding_id == wedding_id,
        Quotation.status == "accepted"
    ).first()

    plate_price = active_quote.price_per_unit if active_quote else payload.catering_price_per_plate
    extra_guests = payload.additional_guests

    catering_cost = extra_guests * plate_price
    catering_tax = catering_cost * 0.18 # 18% GST on luxury banquet catering
    seating_cost = extra_guests * payload.seating_cost_per_guest
    gifts_favors_cost = extra_guests * payload.gift_favor_per_guest
    total_impact = catering_cost + catering_tax + seating_cost + gifts_favors_cost

    projected_budget = wedding.total_budget + total_impact
    projected_guests = wedding.estimated_guests + extra_guests

    return {
        "wedding_id": wedding_id,
        "current_guest_count": wedding.estimated_guests,
        "additional_guests": extra_guests,
        "projected_guest_count": projected_guests,
        "cost_breakdown": {
            "catering_subtotal": catering_cost,
            "catering_gst_18pct": catering_tax,
            "seating_and_tableware": seating_cost,
            "guest_favors_and_amenities": gifts_favors_cost,
            "total_estimated_impact": total_impact
        },
        "current_total_budget": wedding.total_budget,
        "projected_total_budget": projected_budget,
        "requires_authorization": True,
        "notice": "Per Section 5.9 of platform governance, budget changes cannot be applied silently. An explicit Budget Change Request must be formally approved."
    }

@router.post("/wedding/{wedding_id}/change-requests", response_model=BudgetChangeRequestResponse)
def create_budget_change_request(
    wedding_id: str,
    payload: BudgetChangeRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    wedding = db.query(Wedding).filter(Wedding.id == wedding_id).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")

    # Estimate cost impact (+60 guests = ~₹2,47,800)
    extra_guests = payload.additional_guests
    plate_price = 2800.0
    impact = (extra_guests * plate_price * 1.18) + (extra_guests * 450) + (extra_guests * 350)
    new_budget = wedding.total_budget + impact

    bcr = BudgetChangeRequest(
        wedding_id=wedding.id,
        requested_by_id=current_user.id,
        previous_budget=wedding.total_budget,
        new_budget=new_budget,
        additional_guests=extra_guests,
        estimated_cost_impact=impact,
        reason=payload.reason,
        status="pending"
    )
    db.add(bcr)
    db.commit()
    db.refresh(bcr)
    return bcr

@router.get("/wedding/{wedding_id}/change-requests", response_model=List[BudgetChangeRequestResponse])
def get_change_requests(wedding_id: str, db: Session = Depends(get_db)):
    return db.query(BudgetChangeRequest).filter(
        BudgetChangeRequest.wedding_id == wedding_id
    ).order_by(BudgetChangeRequest.created_at.desc()).all()

@router.post("/change-requests/{request_id}/approve", response_model=BudgetChangeRequestResponse)
def approve_budget_change_request(
    request_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    bcr = db.query(BudgetChangeRequest).filter(BudgetChangeRequest.id == request_id).first()
    if not bcr:
        raise HTTPException(status_code=404, detail="Change request not found")

    # Authorize: Planner, Owner, or Admin
    wedding = db.query(Wedding).filter(Wedding.id == bcr.wedding_id).first()
    if current_user.role not in ["admin", "planner"] and current_user.id != wedding.owner_id:
        raise HTTPException(status_code=403, detail="Unauthorized to approve budget changes.")

    bcr.status = "approved"
    bcr.approved_by_id = current_user.id
    bcr.approval_notes = f"Approved by {current_user.full_name} ({current_user.role})."

    # Now formally update the wedding budget and guest count
    wedding.total_budget = bcr.new_budget
    if bcr.additional_guests > 0:
        wedding.estimated_guests += bcr.additional_guests

    # Also update catering category allocation
    catering_cat = db.query(BudgetCategory).filter(
        BudgetCategory.wedding_id == wedding.id,
        BudgetCategory.name.like("%Catering%")
    ).first()
    if catering_cat:
        catering_cat.allocated_amount += bcr.estimated_cost_impact
        catering_cat.committed_amount += bcr.estimated_cost_impact

    db.commit()
    db.refresh(bcr)
    return bcr
