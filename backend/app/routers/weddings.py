from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.models import User, Wedding, WeddingFunction, BudgetCategory
from backend.app.schemas.schemas import (
    WeddingCreate, WeddingUpdate, WeddingResponse,
    WeddingFunctionCreate, WeddingFunctionResponse
)
from backend.app.routers.auth import get_current_user
from backend.app.dependencies import verify_wedding_access, verify_wedding_owner
from backend.app.services.audit import AuditService

router = APIRouter(prefix="/weddings", tags=["Weddings & Functions"])

@router.post("", response_model=WeddingResponse)
def create_wedding(
    wedding_in: WeddingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    wedding = Wedding(
        owner_id=current_user.id,
        couple_names=wedding_in.couple_names,
        partner1_name=wedding_in.partner1_name,
        partner2_name=wedding_in.partner2_name,
        wedding_date=wedding_in.wedding_date,
        destination_city=wedding_in.destination_city,
        destination_state=wedding_in.destination_state,
        estimated_guests=wedding_in.estimated_guests,
        total_budget=wedding_in.total_budget,
        allocated_budget=wedding_in.total_budget * 0.95,
        style=wedding_in.style,
        ceremony_tradition=wedding_in.ceremony_tradition,
        status="planning"
    )
    db.add(wedding)
    db.flush()

    AuditService.log_event(
        db=db,
        action="WEDDING_CREATED",
        entity_name="Wedding",
        entity_id=wedding.id,
        user_id=current_user.id,
        details={
            "couple_names": wedding.couple_names,
            "wedding_date": wedding.wedding_date,
            "total_budget": wedding.total_budget,
            "destination_city": wedding.destination_city
        }
    )

    # Automatically generate default ceremonies/functions if none provided
    functions_to_add = wedding_in.functions or [
        WeddingFunctionCreate(name="Haldi & Mangal Snan", date=wedding_in.wedding_date, start_time="10:00 AM", end_time="01:00 PM", guest_count=wedding_in.estimated_guests, order_index=1),
        WeddingFunctionCreate(name="Mehendi & Sangeet Gala", date=wedding_in.wedding_date, start_time="06:30 PM", end_time="11:30 PM", guest_count=wedding_in.estimated_guests, order_index=2),
        WeddingFunctionCreate(name="Sacred Pheras & Wedding", date=wedding_in.wedding_date, start_time="04:00 PM", end_time="08:00 PM", guest_count=wedding_in.estimated_guests, order_index=3),
        WeddingFunctionCreate(name="Grand Royal Reception", date=wedding_in.wedding_date, start_time="08:30 PM", end_time="11:59 PM", guest_count=wedding_in.estimated_guests, order_index=4),
    ]

    for f in functions_to_add:
        wf = WeddingFunction(
            wedding_id=wedding.id,
            name=f.name,
            date=f.date,
            start_time=f.start_time,
            end_time=f.end_time,
            venue_name=f.venue_name or "Rambagh Palace Courtyard",
            guest_count=f.guest_count,
            budget_allocation=f.budget_allocation,
            notes=f.notes,
            order_index=f.order_index
        )
        db.add(wf)

    # Initialize Budget Categories
    default_allocations = [
        ("Venue & Royal Heritage Halls", wedding.total_budget * 0.35),
        ("Gourmet Catering & Banqueting", wedding.total_budget * 0.28),
        ("Floral & Stage Decoration", wedding.total_budget * 0.15),
        ("Photography & Cinema", wedding.total_budget * 0.08),
        ("Entertainment & Live Artists", wedding.total_budget * 0.06),
        ("Bridal Makeup & Styling", wedding.total_budget * 0.03),
        ("Logistics, Stays & Hospitality", wedding.total_budget * 0.05),
    ]
    for cat_name, alloc in default_allocations:
        bc = BudgetCategory(
            wedding_id=wedding.id,
            name=cat_name,
            allocated_amount=alloc,
            committed_amount=alloc * 0.9,
            actual_spent=alloc * 0.4
        )
        db.add(bc)

    db.commit()
    db.refresh(wedding)
    return wedding

@router.get("", response_model=List[WeddingResponse])
def get_user_weddings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "admin":
        return db.query(Wedding).all()
    elif current_user.role == "planner":
        return db.query(Wedding).filter(
            (Wedding.planner_id == current_user.id) | (Wedding.is_demo == True)
        ).all()
    else:
        return db.query(Wedding).filter(
            (Wedding.owner_id == current_user.id) | (Wedding.is_demo == True)
        ).all()

@router.get("/{wedding_id}", response_model=WeddingResponse)
def get_wedding_by_id(
    wedding_id: str,
    wedding: Wedding = Depends(verify_wedding_access),
    db: Session = Depends(get_db)
):
    return wedding

@router.put("/{wedding_id}", response_model=WeddingResponse)
def update_wedding(
    wedding_id: str,
    update_data: WeddingUpdate,
    wedding: Wedding = Depends(verify_wedding_owner),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    changed_fields = {}
    for key, val in update_data.model_dump(exclude_unset=True).items():
        old_val = getattr(wedding, key, None)
        if old_val != val:
            changed_fields[key] = {"from": old_val, "to": val}
        setattr(wedding, key, val)

    AuditService.log_event(
        db=db,
        action="WEDDING_UPDATED",
        entity_name="Wedding",
        entity_id=wedding.id,
        user_id=current_user.id,
        details={"changes": changed_fields}
    )

    db.commit()
    db.refresh(wedding)
    return wedding

@router.get("/{wedding_id}/functions", response_model=List[WeddingFunctionResponse])
def get_wedding_functions(
    wedding_id: str,
    wedding: Wedding = Depends(verify_wedding_access),
    db: Session = Depends(get_db)
):
    return db.query(WeddingFunction).filter(
        WeddingFunction.wedding_id == wedding_id
    ).order_by(WeddingFunction.order_index).all()
