from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.models import Vendor, VendorPackage, User, Quotation, Wedding
from backend.app.schemas.schemas import VendorResponse, VendorVerificationUpdate
from backend.app.routers.auth import get_current_user
from backend.app.dependencies import verify_vendor_access, require_role
from backend.app.services.audit import AuditService

router = APIRouter(prefix="/vendors", tags=["Vendors"])

@router.get("", response_model=List[VendorResponse])
def get_vendors(
    category: Optional[str] = None,
    city: Optional[str] = None,
    verified_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(Vendor)
    if category and category != "All":
        query = query.filter(Vendor.category == category)
    if city and city != "All":
        query = query.filter(Vendor.city == city)
    if verified_only:
        query = query.filter(Vendor.verified_status == "approved")
    return query.all()

@router.get("/{vendor_id}", response_model=VendorResponse)
def get_vendor(vendor_id: str, db: Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")
    return vendor

@router.get("/{vendor_id}/availability")
def check_vendor_availability(
    vendor_id: str,
    date: str,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Checks whether a vendor has any existing confirmed/accepted bookings on a given date."""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    conflicting_booking = (
        db.query(Quotation)
        .join(Wedding, Quotation.wedding_id == Wedding.id)
        .filter(
            Quotation.vendor_id == vendor.id,
            Quotation.status == "accepted",
            Wedding.wedding_date == date
        )
        .first()
    )

    is_available = conflicting_booking is None
    return {
        "vendor_id": vendor.id,
        "business_name": vendor.business_name,
        "date": date,
        "is_available": is_available,
        "status": "Available for exclusive booking" if is_available else "Booked / Slot Reserved"
    }

@router.post("/{vendor_id}/documents")
def upload_vendor_document(
    vendor_id: str,
    doc_type: str,
    doc_name: str,
    doc_url: Optional[str] = None,
    vendor: Vendor = Depends(verify_vendor_access),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Allows vendor or administrator to attach real verification compliance documents."""
    docs = list(vendor.verification_documents_json or [])
    new_doc = {
        "type": doc_type,
        "name": doc_name,
        "url": doc_url or f"/uploads/verification/{vendor.id}/{doc_name}",
        "uploaded_at": str(db.query(Wedding).first().wedding_date if db.query(Wedding).first() else "2026-05-01"),
        "status": "pending_review"
    }
    docs.append(new_doc)
    vendor.verification_documents_json = docs
    if vendor.verified_status == "approved":
        vendor.verified_status = "under_review"

    AuditService.log_event(
        db=db,
        action="VENDOR_DOCUMENT_SUBMITTED",
        entity_name="Vendor",
        entity_id=vendor.id,
        user_id=current_user.id,
        details={"doc_type": doc_type, "doc_name": doc_name}
    )

    db.commit()
    db.refresh(vendor)
    return {"message": "Document registered successfully for compliance audit", "documents": vendor.verification_documents_json}

@router.put("/{vendor_id}/verification", response_model=VendorResponse)
def update_vendor_verification(
    vendor_id: str,
    update_data: VendorVerificationUpdate,
    admin_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    old_status = vendor.verified_status
    vendor.verified_status = update_data.verified_status

    AuditService.log_event(
        db=db,
        action="VENDOR_VERIFICATION_STATUS_CHANGED",
        entity_name="Vendor",
        entity_id=vendor.id,
        user_id=admin_user.id,
        details={
            "from_status": old_status,
            "to_status": vendor.verified_status,
            "vendor_name": vendor.business_name
        }
    )

    db.commit()
    db.refresh(vendor)
    return vendor
