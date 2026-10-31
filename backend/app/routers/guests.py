from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.models import Guest, SeatingTable, Wedding, User
from backend.app.schemas.schemas import (
    GuestResponse, GuestCreate, SeatingTableResponse
)
from backend.app.routers.auth import get_current_user
from backend.app.dependencies import verify_wedding_access
from backend.app.services.audit import AuditService

router = APIRouter(prefix="/guests", tags=["Guests & Seating"])

@router.get("/wedding/{wedding_id}", response_model=List[GuestResponse])
def get_wedding_guests(
    wedding_id: str,
    wedding: Wedding = Depends(verify_wedding_access),
    db: Session = Depends(get_db)
):
    return db.query(Guest).filter(Guest.wedding_id == wedding.id).all()

@router.post("/wedding/{wedding_id}", response_model=GuestResponse)
def add_guest(
    wedding_id: str,
    guest_in: GuestCreate,
    wedding: Wedding = Depends(verify_wedding_access),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    guest = Guest(
        wedding_id=wedding.id,
        name=guest_in.name,
        email=guest_in.email,
        phone=guest_in.phone,
        group_name=guest_in.group_name or "Friends & Family",
        rsvp_status=guest_in.rsvp_status or "invited",
        dietary_preference=guest_in.dietary_preference or "Vegetarian",
        is_vip=guest_in.is_vip,
        plus_ones=guest_in.plus_ones,
        table_id=guest_in.table_id
    )
    db.add(guest)
    db.flush()

    AuditService.log_event(
        db=db,
        action="GUEST_ADDED",
        entity_name="Guest",
        entity_id=guest.id,
        user_id=current_user.id,
        details={
            "wedding_id": wedding.id,
            "guest_name": guest.name,
            "is_vip": guest.is_vip,
            "group": guest.group_name
        }
    )

    db.commit()
    db.refresh(guest)
    return guest

@router.put("/{guest_id}/rsvp")
def update_guest_rsvp(
    guest_id: str,
    rsvp_status: str,
    db: Session = Depends(get_db)
):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    
    valid_statuses = ["attending", "declined", "tentative", "invited"]
    if rsvp_status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid RSVP status. Must be one of: {', '.join(valid_statuses)}"
        )

    guest.rsvp_status = rsvp_status
    db.commit()
    return {"message": "RSVP updated successfully", "guest_id": guest.id, "rsvp_status": guest.rsvp_status}

@router.post("/{guest_id}/simulate-checkin")
def simulate_guest_checkin(guest_id: str, db: Session = Depends(get_db)):
    guest = db.query(Guest).filter(Guest.id == guest_id).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")
    guest.check_in_status = True
    guest.check_in_time = datetime.utcnow()
    db.commit()
    return {
        "message": "QR check-in validated successfully",
        "guest_name": guest.name,
        "table_id": guest.table_id,
        "is_vip": guest.is_vip,
        "checked_in_at": guest.check_in_time
    }

@router.get("/wedding/{wedding_id}/tables", response_model=List[SeatingTableResponse])
def get_seating_tables(
    wedding_id: str,
    wedding: Wedding = Depends(verify_wedding_access),
    db: Session = Depends(get_db)
):
    return db.query(SeatingTable).filter(
        SeatingTable.wedding_id == wedding.id
    ).order_by(SeatingTable.table_number).all()

@router.post("/wedding/{wedding_id}/tables/{table_id}/assign-guest/{guest_id}")
def assign_guest_to_table(
    wedding_id: str,
    table_id: str,
    guest_id: str,
    wedding: Wedding = Depends(verify_wedding_access),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    table = db.query(SeatingTable).filter(
        SeatingTable.id == table_id,
        SeatingTable.wedding_id == wedding.id
    ).first()
    if not table:
        raise HTTPException(status_code=404, detail="Table not found in this wedding celebration")

    guest = db.query(Guest).filter(
        Guest.id == guest_id,
        Guest.wedding_id == wedding.id
    ).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found in this wedding celebration")

    # If already at this table, no-op
    if guest.table_id == table_id:
        return {"message": f"{guest.name} is already seated at {table.table_name}", "table_id": table_id}

    # Verify table capacity
    current_occupancy = db.query(Guest).filter(Guest.table_id == table_id).count()
    if current_occupancy >= table.capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Table '{table.table_name}' has reached its maximum banquet capacity of {table.capacity} guests."
        )

    old_table_id = guest.table_id
    guest.table_id = table_id

    AuditService.log_event(
        db=db,
        action="GUEST_SEATED",
        entity_name="Guest",
        entity_id=guest.id,
        user_id=current_user.id,
        details={
            "wedding_id": wedding.id,
            "guest_name": guest.name,
            "assigned_table": table.table_name,
            "previous_table_id": old_table_id
        }
    )

    db.commit()
    return {
        "message": f"{guest.name} successfully seated at {table.table_name}",
        "table_id": table_id,
        "table_name": table.table_name,
        "current_occupancy": current_occupancy + 1,
        "capacity": table.capacity
    }

@router.post("/wedding/{wedding_id}/guests/{guest_id}/unassign-table")
def unassign_guest_table(
    wedding_id: str,
    guest_id: str,
    wedding: Wedding = Depends(verify_wedding_access),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    guest = db.query(Guest).filter(
        Guest.id == guest_id,
        Guest.wedding_id == wedding.id
    ).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")

    old_table = guest.table_id
    guest.table_id = None

    AuditService.log_event(
        db=db,
        action="GUEST_UNSEATED",
        entity_name="Guest",
        entity_id=guest.id,
        user_id=current_user.id,
        details={
            "wedding_id": wedding.id,
            "guest_name": guest.name,
            "previous_table_id": old_table
        }
    )

    db.commit()
    return {"message": f"{guest.name} unassigned from table.", "guest_id": guest.id}
