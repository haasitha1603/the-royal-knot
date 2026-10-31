from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.models import PaymentRecord, Wedding, User, BudgetCategory
from backend.app.schemas.schemas import (
    PaymentRecordResponse, PaymentRecordCreate, PaymentSimulateRequest
)
from backend.app.routers.auth import get_current_user
from backend.app.dependencies import verify_wedding_access, verify_wedding_owner
from backend.app.services.audit import AuditService

router = APIRouter(prefix="/payments", tags=["Payment Tracking"])

@router.get("/wedding/{wedding_id}", response_model=List[PaymentRecordResponse])
def get_wedding_payments(
    wedding_id: str,
    wedding: Wedding = Depends(verify_wedding_access),
    db: Session = Depends(get_db)
):
    return db.query(PaymentRecord).filter(
        PaymentRecord.wedding_id == wedding.id
    ).order_by(PaymentRecord.due_date.asc()).all()

@router.post("/wedding/{wedding_id}", response_model=PaymentRecordResponse)
def create_payment_milestone(
    wedding_id: str,
    payment_in: PaymentRecordCreate,
    wedding: Wedding = Depends(verify_wedding_access),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    payment = PaymentRecord(
        wedding_id=wedding.id,
        vendor_id=payment_in.vendor_id,
        title=payment_in.title,
        stage=payment_in.stage,
        amount=payment_in.amount,
        due_date=payment_in.due_date,
        status="pending",
        payment_method=payment_in.payment_method,
        invoice_number=f"INV-TRK-2026-{db.query(PaymentRecord).count() + 101}"
    )
    db.add(payment)
    db.flush()

    AuditService.log_event(
        db=db,
        action="PAYMENT_MILESTONE_CREATED",
        entity_name="PaymentRecord",
        entity_id=payment.id,
        user_id=current_user.id,
        details={
            "wedding_id": wedding.id,
            "title": payment.title,
            "amount": payment.amount,
            "stage": payment.stage,
            "due_date": payment.due_date
        }
    )

    db.commit()
    db.refresh(payment)
    return payment

@router.post("/{payment_id}/simulate-settlement", response_model=PaymentRecordResponse)
def simulate_settlement(
    payment_id: str,
    payload: PaymentSimulateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Simulated escrow settlement workflow with strict double-settlement guard:
    1. Validates milestone existence and checks access permissions.
    2. Enforces non-duplicate settlement condition.
    3. Updates category actual spent atomically.
    4. Records immutable audit record.
    """
    payment = db.query(PaymentRecord).filter(PaymentRecord.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")

    # Authorize access to wedding
    wedding = db.query(Wedding).filter(Wedding.id == payment.wedding_id).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")

    if current_user.role != "admin" and not wedding.is_demo:
        if current_user.role == "couple" and wedding.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Unauthorized: Access denied to this payment record.")
        if current_user.role == "planner" and wedding.planner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Unauthorized: Access denied to this payment record.")

    if payment.status == "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment milestone '{payment.title}' has already been settled and cleared (Ref: {payment.transaction_reference})."
        )

    payment.status = "completed"
    payment.payment_method = payload.payment_method
    payment.transaction_reference = f"TXN-TRK-SIM-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    payment.paid_at = datetime.utcnow()
    payment.is_simulated = True

    # Update wedding actual spent in matching or first budget category
    cat = db.query(BudgetCategory).filter(
        BudgetCategory.wedding_id == wedding.id
    ).first()
    if cat:
        cat.actual_spent += payment.amount

    AuditService.log_event(
        db=db,
        action="SIMULATED_PAYMENT_SETTLED",
        entity_name="PaymentRecord",
        entity_id=payment.id,
        user_id=current_user.id,
        details={
            "wedding_id": wedding.id,
            "amount": payment.amount,
            "stage": payment.stage,
            "method": payload.payment_method,
            "transaction_reference": payment.transaction_reference,
            "is_simulated": True
        }
    )

    db.commit()
    db.refresh(payment)
    return payment
