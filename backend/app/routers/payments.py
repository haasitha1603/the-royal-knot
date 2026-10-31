from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.models import PaymentRecord, Wedding, User, BudgetCategory, AuditLog
from backend.app.schemas.schemas import (
    PaymentRecordResponse, PaymentRecordCreate, PaymentSimulateRequest
)
from backend.app.routers.auth import get_current_user

router = APIRouter(prefix="/payments", tags=["Payment Tracking"])

@router.get("/wedding/{wedding_id}", response_model=List[PaymentRecordResponse])
def get_wedding_payments(wedding_id: str, db: Session = Depends(get_db)):
    return db.query(PaymentRecord).filter(
        PaymentRecord.wedding_id == wedding_id
    ).order_by(PaymentRecord.due_date.asc()).all()

@router.post("/wedding/{wedding_id}", response_model=PaymentRecordResponse)
def create_payment_milestone(
    wedding_id: str,
    payment_in: PaymentRecordCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    payment = PaymentRecord(
        wedding_id=wedding_id,
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
    Clearly labelled simulated escrow settlement workflow.
    Validates staged milestone, stamps audit timestamp and transaction reference.
    """
    payment = db.query(PaymentRecord).filter(PaymentRecord.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")

    payment.status = "completed"
    payment.payment_method = payload.payment_method
    payment.transaction_reference = f"TXN-TRK-SIM-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    payment.paid_at = datetime.utcnow()
    payment.is_simulated = True

    # Update wedding actual spent in budget category if applicable
    wedding = db.query(Wedding).filter(Wedding.id == payment.wedding_id).first()
    if wedding:
        cat = db.query(BudgetCategory).filter(
            BudgetCategory.wedding_id == wedding.id
        ).first()
        if cat:
            cat.actual_spent += payment.amount

    # Record Audit Log
    audit = AuditLog(
        user_id=current_user.id,
        action="SIMULATED_PAYMENT_SETTLED",
        entity_name="PaymentRecord",
        entity_id=payment.id,
        details_json={
            "amount": payment.amount,
            "stage": payment.stage,
            "method": payload.payment_method,
            "notice": "Simulated escrow settlement"
        }
    )
    db.add(audit)
    db.commit()
    db.refresh(payment)
    return payment
