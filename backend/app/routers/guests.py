from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.models import Guest, SeatingTable, Wedding
from backend.app.schemas.schemas import (
    GuestResponse, GuestCreate, SeatingTableResponse
)

router = APIRouter(prefix="/guests", tags=["Guests & Seating"])

@router.get("/wedding/{wedding_id}", response_model=List[GuestResponse])
def get_wedding_guests(wedding_id: str, db: Session = Depends(get_db)):
    return db.query(Guest).filter(Guest.wedding_id == wedding_id).all()

@router.post("/wedding/{wedding_id}", response_model=GuestResponse)
def add_guest(
    wedding_id: str,
    guest_in: GuestCreate,
    db: Session = Depends(get_db)
):
    wedding = db.query(Wedding).filter(Wedding.id == wedding_id).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")

    guest = Guest(
        wedding_id=wedding_id,
        name=guest_in.name,
        email=guest_in.email,
        phone=guest_in.phone,
        group_name=guest_in.group_name,
        rsvp_status=guest_in.rsvp_status,
        dietary_preference=guest_in.dietary_preference,
        is_vip=guest_in.is_vip,
        plus_ones=guest_in.plus_ones,
        table_id=guest_in.table_id
    )
    db.add(guest)
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
    guest.rsvp_status = rsvp_status
    db.commit()
    return {"message": "RSVP updated", "guest_id": guest.id, "rsvp_status": guest.rsvp_status}

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
def get_seating_tables(wedding_id: str, db: Session = Depends(get_db)):
    return db.query(SeatingTable).filter(SeatingTable.wedding_id == wedding_id).order_by(SeatingTable.table_number).all()

@router.post("/wedding/{wedding_id}/tables/{table_id}/assign-guest/{guest_id}")
def assign_guest_to_table(
    wedding_id: str,
    table_id: str,
    guest_id: str,
    db: Session = Depends(get_db)
):
    table = db.query(SeatingTable).filter(
        SeatingTable.id == table_id,
        SeatingTable.wedding_id == wedding_id
    ).first()
    if not table:
        raise HTTPException(status_code=404, detail="Table not found")

    guest = db.query(Guest).filter(
        Guest.id == guest_id,
        Guest.wedding_id == wedding_id
    ).first()
    if not guest:
        raise HTTPException(status_code=404, detail="Guest not found")

    # Check table capacity
    current_occupancy = db.query(Guest).filter(Guest.table_id == table_id).count()
    if current_occupancy >= table.capacity:
        raise HTTPException(
            status_code=400,
            detail=f"Table {table.table_name} has reached its maximum capacity of {table.capacity} guests."
        )

    guest.table_id = table_id
    db.commit()
    return {"message": f"{guest.name} assigned to {table.table_name}", "table_id": table_id}
