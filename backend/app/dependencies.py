from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.models import User, Wedding, Vendor
from backend.app.routers.auth import get_current_user

def require_role(*allowed_roles: str):
    """Dependency that restricts route access to specified roles."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Forbidden: Operation requires one of the following roles: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker

def verify_wedding_access(
    wedding_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Wedding:
    """
    Verifies that the current user has authorized access to the requested wedding:
    - Admin: Platform-wide access.
    - Couple: Must own the wedding.
    - Planner: Must be the designated planner or accessing a demo wedding.
    - Vendor: Access allowed only if actively contracted or quoting on the wedding.
    """
    wedding = db.query(Wedding).filter(Wedding.id == wedding_id).first()
    if not wedding:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wedding not found"
        )

    # Admin has universal administrative visibility
    if current_user.role == "admin":
        return wedding

    # Demo wedding fallback for demo evaluation personas
    if wedding.is_demo:
        return wedding

    # Couple owns the wedding
    if current_user.role == "couple" and wedding.owner_id == current_user.id:
        return wedding

    # Planner assigned to the wedding
    if current_user.role == "planner" and wedding.planner_id == current_user.id:
        return wedding

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Access denied: You are not authorized to view or manage this wedding celebration."
    )

def verify_wedding_owner(
    wedding_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Wedding:
    """Verifies that the current user is the owner (couple) of the wedding or platform admin."""
    wedding = db.query(Wedding).filter(Wedding.id == wedding_id).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")

    if current_user.role == "admin" or wedding.owner_id == current_user.id or (wedding.is_demo and current_user.role == "couple"):
        return wedding

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Unauthorized: Only the couple who created this wedding may perform this action."
    )

def verify_wedding_planner_or_admin(
    wedding_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Wedding:
    """Verifies that the current user is the authorized wedding planner or admin."""
    wedding = db.query(Wedding).filter(Wedding.id == wedding_id).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")

    if current_user.role == "admin":
        return wedding
    if current_user.role == "planner" and (wedding.planner_id == current_user.id or wedding.is_demo):
        return wedding

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Unauthorized: Only an authorized wedding planner or administrator may approve operational or budget decisions."
    )

def verify_vendor_access(
    vendor_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Vendor:
    """Verifies that the vendor profile belongs to the authenticated user or admin."""
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404, detail="Vendor not found")

    if current_user.role == "admin":
        return vendor
    if current_user.role == "vendor" and vendor.user_id == current_user.id:
        return vendor

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Unauthorized: You cannot access or modify another vendor's profile or commercial records."
    )
