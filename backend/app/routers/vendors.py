from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.models import Vendor, VendorPackage, User
from backend.app.schemas.schemas import VendorResponse, VendorVerificationUpdate
from backend.app.routers.auth import get_current_user

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

@router.put("/{vendor_id}/verification", response_model=VendorResponse)
def update_vendor_verification(
    vendor_id: str,
    update_data: VendorVerificationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Only platform administrators can modify verification statuses.")

    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    vendor.verified_status = update_data.verified_status
    db.commit()
    db.refresh(vendor)
    return vendor
