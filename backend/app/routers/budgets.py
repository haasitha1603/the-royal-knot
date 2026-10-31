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
from backend.app.dependencies import (
    verify_wedding_access, verify_wedding_planner_or_admin
)
from backend.app.services.financial import FinancialService
from backend.app.services.audit import AuditService

router = APIRouter(prefix="/budgets", tags=["Budget Guardian"])

@router.get("/wedding/{wedding_id}/overview")
def get_budget_overview(
    wedding_id: str,
    wedding: Wedding = Depends(verify_wedding_access),
    db: Session = Depends(get_db)
):
    """
    Returns exact, decimal-safe financial summary calculated by FinancialService.
    Guarantees consistency across couple, planner, and admin dashboards.
    """
    return FinancialService.calculate_budget_summary(wedding, db)

@router.post("/wedding/{wedding_id}/simulate-extra-guests")
def simulate_extra_guests(
    wedding_id: str,
    payload: BudgetSimulateRequest,
    wedding: Wedding = Depends(verify_wedding_access),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Evaluates the financial impact of adding N guests (e.g., 60 additional guests)
    using the active catering quotation and banquet capacity parameters.
    """
    # Check for accepted catering quote to get custom plate price if available
    active_quote = db.query(Quotation).filter(
        Quotation.wedding_id == wedding.id,
        Quotation.status == "accepted"
    ).first()

    plate_price = active_quote.price_per_unit if active_quote else payload.catering_price_per_plate

    impact_result = FinancialService.calculate_guest_impact(
        wedding=wedding,
        extra_guests=payload.additional_guests,
        catering_price_per_plate=plate_price,
        seating_cost_per_guest=payload.seating_cost_per_guest,
        gift_favor_per_guest=payload.gift_favor_per_guest
    )

    impact_result["wedding_id"] = wedding.id
    impact_result["requires_authorization"] = True
    impact_result["notice"] = (
        "Per platform financial governance, budget changes cannot be applied silently. "
        "An explicit Budget Change Request must be formally approved by an authorized wedding planner or administrator."
    )
    return impact_result

@router.post("/wedding/{wedding_id}/change-requests", response_model=BudgetChangeRequestResponse)
def create_budget_change_request(
    wedding_id: str,
    payload: BudgetChangeRequestCreate,
    wedding: Wedding = Depends(verify_wedding_access),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Creates a formal Budget Change Request in 'pending' status.
    CRITICAL: Does NOT mutate official wedding budget immediately.
    Awaiting planner or admin review and approval.
    """
    extra_guests = payload.additional_guests
    impact_data = FinancialService.calculate_guest_impact(
        wedding=wedding,
        extra_guests=extra_guests
    )
    cost_impact = impact_data["cost_breakdown"]["total_estimated_impact"]
    new_budget = impact_data["projected_total_budget"]

    bcr = BudgetChangeRequest(
        wedding_id=wedding.id,
        requested_by_id=current_user.id,
        previous_budget=wedding.total_budget,
        new_budget=new_budget,
        additional_guests=extra_guests,
        estimated_cost_impact=cost_impact,
        reason=payload.reason,
        status="pending"
    )
    db.add(bcr)
    db.flush()

    AuditService.log_event(
        db=db,
        action="BUDGET_CHANGE_REQUESTED",
        entity_name="BudgetChangeRequest",
        entity_id=bcr.id,
        user_id=current_user.id,
        details={
            "wedding_id": wedding.id,
            "additional_guests": extra_guests,
            "estimated_cost_impact": cost_impact,
            "previous_budget": wedding.total_budget,
            "new_projected_budget": new_budget,
            "reason": payload.reason
        }
    )

    db.commit()
    db.refresh(bcr)
    return bcr

@router.get("/wedding/{wedding_id}/change-requests", response_model=List[BudgetChangeRequestResponse])
def get_change_requests(
    wedding_id: str,
    wedding: Wedding = Depends(verify_wedding_access),
    db: Session = Depends(get_db)
):
    return db.query(BudgetChangeRequest).filter(
        BudgetChangeRequest.wedding_id == wedding.id
    ).order_by(BudgetChangeRequest.created_at.desc()).all()

@router.post("/change-requests/{request_id}/approve", response_model=BudgetChangeRequestResponse)
def approve_budget_change_request(
    request_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Approves a pending budget change request.
    Restricted to wedding planner or platform administrator.
    Only upon approval does the official wedding budget update.
    """
    bcr = db.query(BudgetChangeRequest).filter(BudgetChangeRequest.id == request_id).first()
    if not bcr:
        raise HTTPException(status_code=404, detail="Change request not found")

    if bcr.status != "pending":
        raise HTTPException(
            status_code=400,
            detail=f"Change request cannot be approved because it is already '{bcr.status}'."
        )

    # Verify authorization
    wedding = db.query(Wedding).filter(Wedding.id == bcr.wedding_id).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Associated wedding celebration not found")

    if current_user.role not in ["admin", "planner"] and (wedding.owner_id != current_user.id if wedding.is_demo else True):
        # Strict planner/admin requirement for non-demo, or owner if demo
        if current_user.role != "admin" and not (current_user.role == "planner" and wedding.planner_id == current_user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Unauthorized: Formal budget change approvals require an authorized Wedding Planner or Administrator."
            )

    bcr.status = "approved"
    bcr.approved_by_id = current_user.id
    bcr.approval_notes = f"Approved by {current_user.full_name} ({current_user.role.capitalize()})."

    # Formally mutate official wedding budget and guest count
    wedding.total_budget = bcr.new_budget
    if bcr.additional_guests > 0:
        wedding.estimated_guests = (wedding.estimated_guests or 0) + bcr.additional_guests

    # Also adjust catering category allocation to absorb incremental cost
    catering_cat = db.query(BudgetCategory).filter(
        BudgetCategory.wedding_id == wedding.id,
        BudgetCategory.name.ilike("%Catering%")
    ).first()
    if catering_cat:
        catering_cat.allocated_amount += bcr.estimated_cost_impact
        catering_cat.committed_amount += bcr.estimated_cost_impact

    AuditService.log_event(
        db=db,
        action="BUDGET_CHANGE_APPROVED",
        entity_name="BudgetChangeRequest",
        entity_id=bcr.id,
        user_id=current_user.id,
        details={
            "wedding_id": wedding.id,
            "new_official_budget": wedding.total_budget,
            "added_guests": bcr.additional_guests,
            "cost_impact": bcr.estimated_cost_impact
        }
    )

    db.commit()
    db.refresh(bcr)
    return bcr

@router.post("/change-requests/{request_id}/reject", response_model=BudgetChangeRequestResponse)
def reject_budget_change_request(
    request_id: str,
    reason: str = "Capacity or financial constraints exceed target threshold.",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Rejects a pending budget change request.
    Restricted to wedding planner or platform administrator.
    """
    bcr = db.query(BudgetChangeRequest).filter(BudgetChangeRequest.id == request_id).first()
    if not bcr:
        raise HTTPException(status_code=404, detail="Change request not found")

    if bcr.status != "pending":
        raise HTTPException(
            status_code=400,
            detail=f"Change request cannot be rejected because it is already '{bcr.status}'."
        )

    wedding = db.query(Wedding).filter(Wedding.id == bcr.wedding_id).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Associated wedding celebration not found")

    if current_user.role != "admin" and not (current_user.role == "planner" and wedding.planner_id == current_user.id) and not (wedding.is_demo and current_user.role == "planner"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: Formal budget change rejections require an authorized Wedding Planner or Administrator."
        )

    bcr.status = "rejected"
    bcr.approved_by_id = current_user.id
    bcr.approval_notes = f"Rejected by {current_user.full_name} ({current_user.role.capitalize()}): {reason}"

    AuditService.log_event(
        db=db,
        action="BUDGET_CHANGE_REJECTED",
        entity_name="BudgetChangeRequest",
        entity_id=bcr.id,
        user_id=current_user.id,
        details={
            "wedding_id": wedding.id,
            "rejection_reason": reason
        }
    )

    db.commit()
    db.refresh(bcr)
    return bcr
