from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.models import Venue
from backend.app.schemas.schemas import VenueResponse

router = APIRouter(prefix="/venues", tags=["Venues"])

@router.get("", response_model=List[VenueResponse])
def get_venues(
    category: Optional[str] = None,
    city: Optional[str] = None,
    min_capacity: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Venue)
    if category and category != "All":
        query = query.filter(Venue.category == category)
    if city and city != "All":
        query = query.filter(Venue.city == city)
    if min_capacity:
        query = query.filter(Venue.capacity_max >= min_capacity)
    return query.all()

@router.get("/{venue_id}", response_model=VenueResponse)
def get_venue(venue_id: str, db: Session = Depends(get_db)):
    venue = db.query(Venue).filter(Venue.id == venue_id).first()
    if not venue:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Venue not found")
    return venue
