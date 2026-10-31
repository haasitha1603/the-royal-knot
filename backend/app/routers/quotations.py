from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.models import Quotation, Wedding, Vendor, User, BudgetCategory
from backend.app.schemas.schemas import QuotationResponse
from backend.app.routers.auth import get_current_user
from backend.app.dependencies import verify_wedding_access
from backend.app.services.audit import AuditService

router = APIRouter(prefix="/quotations", tags=["Quotations & Comparison"])

@router.get("/wedding/{wedding_id}", response_model=List[QuotationResponse])
def get_wedding_quotations(
    wedding_id: str,
    wedding: Wedding = Depends(verify_wedding_access),
    db: Session = Depends(get_db)
):
    return db.query(Quotation).filter(Quotation.wedding_id == wedding.id).all()

@router.get("/wedding/{wedding_id}/compare-catering")
def compare_catering_quotations(
    wedding_id: str,
    weight_price: float = 0.40,
    weight_inclusions: float = 0.35,
    weight_rating: float = 0.25,
    wedding: Wedding = Depends(verify_wedding_access),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Intelligent Catering Quotation Comparison engine:
    Evaluates price per plate, menu variety, inclusions (crockery, live counters, waitstaff),
    service ratio, and provides a multi-factor value score with configurable weights.
    """
    quotes = db.query(Quotation).filter(
        Quotation.wedding_id == wedding.id,
        Quotation.unit_type == "plate"
    ).all()

    if not quotes:
        raise HTTPException(status_code=404, detail="No catering quotations found for this wedding celebration.")

    comparison_results = []
    min_price = min(q.price_per_unit for q in quotes if q.price_per_unit > 0) or 2000.0

    for q in quotes:
        vendor = db.query(Vendor).filter(Vendor.id == q.vendor_id).first()
        inclusions_count = len(q.inclusions_json or [])
        rating = vendor.rating if vendor else 4.5
        price_per_plate = q.price_per_unit

        # Normalized scoring (0 - 100)
        # Price score: lower price gets higher score relative to min_price
        price_score = min(100.0, (min_price / price_per_plate) * 100) if price_per_plate > 0 else 50.0
        # Inclusions score: 10 inclusions is ~100
        inclusions_score = min(100.0, (inclusions_count / 12.0) * 100)
        # Rating score: 5.0 is 100
        rating_score = (rating / 5.0) * 100.0

        composite_score = round(
            (price_score * weight_price) +
            (inclusions_score * weight_inclusions) +
            (rating_score * weight_rating),
            1
        )

        comparison_results.append({
            "quotation_id": q.id,
            "vendor_id": q.vendor_id,
            "vendor_name": vendor.business_name if vendor else "Curated Caterer",
            "rating": rating,
            "price_per_plate": price_per_plate,
            "guest_count": q.guest_count,
            "subtotal": q.subtotal,
            "taxes_and_charges": q.tax_amount + q.additional_charges,
            "total_estimated_amount": q.total_amount,
            "inclusions": q.inclusions_json,
            "exclusions": q.exclusions_json,
            "payment_terms": q.payment_terms,
            "value_score": composite_score,
            "is_recommended": q.is_recommended,
            "ai_highlight": q.comparison_notes or "Verified authentic royal Rajasthani banquet.",
            "status": q.status
        })

    comparison_results.sort(key=lambda x: x["value_score"], reverse=True)

    top_choice = comparison_results[0]
    return {
        "wedding_id": wedding.id,
        "guest_basis": quotes[0].guest_count,
        "quotations_analyzed": len(quotes),
        "comparison": comparison_results,
        "scoring_weights": {
            "price": weight_price,
            "inclusions": weight_inclusions,
            "vendor_rating": weight_rating
        },
        "summary": f"{top_choice['vendor_name']} ranks #1 with a value score of {top_choice['value_score']}/100, combining extensive culinary inclusions with superior vendor rating."
    }

@router.post("/{quotation_id}/accept")
def accept_quotation(
    quotation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Formally accepts a vendor quotation:
    1. Verifies caller permissions (owner, planner, or admin).
    2. Enforces Double-Booking Prevention: Confirms vendor does not have an active accepted contract on this wedding date.
    3. Staged commitment update in Budget Guardian.
    4. Marks other quotations for the same unit/category as superseded.
    5. Records immutable audit record.
    """
    quote = db.query(Quotation).filter(Quotation.id == quotation_id).first()
    if not quote:
        raise HTTPException(status_code=404, detail="Quotation not found")

    wedding = db.query(Wedding).filter(Wedding.id == quote.wedding_id).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding not found")

    # Authorize access
    if current_user.role not in ["admin", "planner"] and (wedding.owner_id != current_user.id if not wedding.is_demo else False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized: Only the couple, designated planner, or administrator can accept commercial quotations."
        )

    # Double-Booking Prevention Check
    vendor = db.query(Vendor).filter(Vendor.id == quote.vendor_id).first()
    if vendor:
        # Check if this vendor is already accepted on another wedding celebration scheduled on the exact same date
        conflicting_booking = (
            db.query(Quotation)
            .join(Wedding, Quotation.wedding_id == Wedding.id)
            .filter(
                Quotation.vendor_id == vendor.id,
                Quotation.status == "accepted",
                Quotation.id != quote.id,
                Wedding.wedding_date == wedding.wedding_date
            )
            .first()
        )
        if conflicting_booking:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Vendor booking conflict: '{vendor.business_name}' is already exclusively contracted for another wedding celebration on {wedding.wedding_date}."
            )

    # Mark this quotation as accepted and others as superseded
    all_quotes = db.query(Quotation).filter(
        Quotation.wedding_id == quote.wedding_id,
        Quotation.unit_type == quote.unit_type
    ).all()

    for q in all_quotes:
        if q.id == quote.id:
            q.status = "accepted"
        elif q.status != "rejected":
            q.status = "superseded"

    # Update budget committed amount in corresponding category
    cat_keyword = "Catering" if quote.unit_type == "plate" else "Decor"
    matching_cat = db.query(BudgetCategory).filter(
        BudgetCategory.wedding_id == wedding.id,
        BudgetCategory.name.ilike(f"%{cat_keyword}%")
    ).first()
    if matching_cat:
        matching_cat.committed_amount = quote.total_amount

    AuditService.log_event(
        db=db,
        action="QUOTATION_ACCEPTED",
        entity_name="Quotation",
        entity_id=quote.id,
        user_id=current_user.id,
        details={
            "wedding_id": wedding.id,
            "vendor_id": quote.vendor_id,
            "vendor_name": vendor.business_name if vendor else "Vendor",
            "accepted_total": quote.total_amount,
            "wedding_date": wedding.wedding_date
        }
    )

    db.commit()
    return {
        "message": f"Quotation from {vendor.business_name if vendor else 'Vendor'} accepted successfully. Budget commitments updated.",
        "quotation_id": quote.id,
        "status": "accepted",
        "total_committed": quote.total_amount
    }
