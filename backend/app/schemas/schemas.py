from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: str
    full_name: str
    email: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    role: str = "couple"  # couple, vendor, planner, coordinator, admin
    # Optional vendor fields if registering as vendor
    business_name: Optional[str] = None
    category: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Wedding Schemas
class WeddingFunctionCreate(BaseModel):
    name: str
    date: str
    start_time: str
    end_time: str
    venue_name: Optional[str] = None
    venue_location: Optional[str] = None
    guest_count: int = 400
    budget_allocation: float = 0.0
    notes: Optional[str] = None
    order_index: int = 0

class WeddingFunctionResponse(WeddingFunctionCreate):
    id: str
    wedding_id: str

    class Config:
        from_attributes = True

class WeddingCreate(BaseModel):
    couple_names: str
    partner1_name: str
    partner2_name: str
    wedding_date: str
    destination_city: str = "Jaipur"
    destination_state: str = "Rajasthan"
    estimated_guests: int = 400
    total_budget: float = 5000000.0
    style: str = "Royal Palace"
    ceremony_tradition: str = "Hindu Traditional"
    functions: Optional[List[WeddingFunctionCreate]] = None

class WeddingUpdate(BaseModel):
    couple_names: Optional[str] = None
    partner1_name: Optional[str] = None
    partner2_name: Optional[str] = None
    wedding_date: Optional[str] = None
    destination_city: Optional[str] = None
    destination_state: Optional[str] = None
    estimated_guests: Optional[int] = None
    total_budget: Optional[float] = None
    allocated_budget: Optional[float] = None
    style: Optional[str] = None
    ceremony_tradition: Optional[str] = None
    status: Optional[str] = None

class WeddingResponse(BaseModel):
    id: str
    owner_id: str
    planner_id: Optional[str] = None
    couple_names: str
    partner1_name: str
    partner2_name: str
    wedding_date: str
    destination_city: str
    destination_state: str
    estimated_guests: int
    total_budget: float
    allocated_budget: float
    currency: str
    style: str
    ceremony_tradition: str
    status: str
    is_demo: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Venue Schemas
class VenueResponse(BaseModel):
    id: str
    name: str
    category: str
    city: str
    state: str
    address: str
    capacity_min: int
    capacity_max: int
    price_range_start: float
    price_range_end: float
    description: str
    facilities_json: List[str]
    images_json: List[str]
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None
    lat: float
    lng: float
    is_verified: bool
    is_sample: bool

    class Config:
        from_attributes = True

# Vendor Schemas
class VendorPackageResponse(BaseModel):
    id: str
    vendor_id: str
    title: str
    description: str
    price: float
    unit: str
    inclusions_json: List[str]
    exclusions_json: List[str]

    class Config:
        from_attributes = True

class VendorResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    business_name: str
    representative_name: str
    category: str
    city: str
    state: str
    address: Optional[str] = None
    experience_years: int
    description: str
    portfolio_urls_json: List[str]
    price_range: str
    verified_status: str
    pan_gst: Optional[str] = None
    rating: float
    review_count: int
    is_sample: bool
    packages: Optional[List[VendorPackageResponse]] = []

    class Config:
        from_attributes = True

class VendorVerificationUpdate(BaseModel):
    verified_status: str  # approved, rejected, under_review, documents_pending, suspended
    admin_notes: Optional[str] = None

# Enquiry & Quotation
class EnquiryCreate(BaseModel):
    wedding_id: str
    vendor_id: str
    category: str
    message: str
    guest_count: int = 400
    event_date: Optional[str] = None

class EnquiryResponse(BaseModel):
    id: str
    wedding_id: str
    vendor_id: str
    user_id: str
    category: str
    message: str
    guest_count: int
    event_date: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class QuotationResponse(BaseModel):
    id: str
    enquiry_id: Optional[str] = None
    wedding_id: str
    vendor_id: str
    package_description: str
    price_per_unit: float
    unit_type: str
    guest_count: int
    subtotal: float
    tax_amount: float
    additional_charges: float
    total_amount: float
    inclusions_json: List[str]
    exclusions_json: List[str]
    validity_date: Optional[str] = None
    payment_terms: str
    status: str
    is_recommended: bool
    comparison_notes: Optional[str] = None
    vendor: Optional[VendorResponse] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Budget Guardian Schemas
class BudgetCategoryResponse(BaseModel):
    id: str
    wedding_id: str
    name: str
    allocated_amount: float
    committed_amount: float
    actual_spent: float

    class Config:
        from_attributes = True

class BudgetSimulateRequest(BaseModel):
    additional_guests: int
    catering_price_per_plate: float = 2800.0
    seating_cost_per_guest: float = 450.0
    gift_favor_per_guest: float = 350.0

class BudgetChangeRequestCreate(BaseModel):
    wedding_id: Optional[str] = None
    additional_guests: int
    reason: str

class BudgetChangeRequestResponse(BaseModel):
    id: str
    wedding_id: str
    requested_by_id: str
    previous_budget: float
    new_budget: float
    additional_guests: int
    estimated_cost_impact: float
    reason: str
    status: str
    approved_by_id: Optional[str] = None
    approval_notes: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Payment Schemas
class PaymentRecordCreate(BaseModel):
    wedding_id: Optional[str] = None
    vendor_id: Optional[str] = None
    title: str
    stage: str
    amount: float
    due_date: str
    payment_method: str = "NEFT / Bank Transfer"

class PaymentRecordResponse(BaseModel):
    id: str
    wedding_id: str
    vendor_id: Optional[str] = None
    title: str
    stage: str
    amount: float
    due_date: str
    status: str
    payment_method: str
    transaction_reference: Optional[str] = None
    invoice_number: Optional[str] = None
    is_simulated: bool
    paid_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PaymentSimulateRequest(BaseModel):
    payment_method: str = "Simulated UPI / Net Banking"
    notes: Optional[str] = None

# Guest & Seating
class GuestCreate(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    group_name: str = "Friends & Family"
    rsvp_status: str = "attending"
    dietary_preference: str = "Vegetarian"
    is_vip: bool = False
    plus_ones: int = 0
    table_id: Optional[str] = None

class GuestResponse(BaseModel):
    id: str
    wedding_id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    group_name: str
    rsvp_status: str
    dietary_preference: str
    is_vip: bool
    plus_ones: int
    table_id: Optional[str] = None
    check_in_status: bool
    check_in_time: Optional[datetime] = None

    class Config:
        from_attributes = True

class SeatingTableResponse(BaseModel):
    id: str
    wedding_id: str
    table_name: str
    table_number: int
    capacity: int
    shape: str

    class Config:
        from_attributes = True

# Operations & Tasks
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to_name: str = "Lead Planner"
    priority: str = "medium"
    status: str = "to_plan"
    due_date: str
    function_id: Optional[str] = None

class TaskResponse(BaseModel):
    id: str
    wedding_id: str
    function_id: Optional[str] = None
    title: str
    description: Optional[str] = None
    assigned_to_name: str
    priority: str
    status: str
    due_date: str

    class Config:
        from_attributes = True

class ScheduleItemResponse(BaseModel):
    id: str
    wedding_id: str
    function_id: Optional[str] = None
    title: str
    start_time: str
    end_time: str
    venue_area: str
    vendor_name: Optional[str] = None
    responsible_coordinator: str
    status: str
    delay_minutes: int
    dependent_items_json: List[str]
    notes: Optional[str] = None

    class Config:
        from_attributes = True

class VendorDelaySimulate(BaseModel):
    delay_minutes: int = 30
    vendor_name: str = "Royal Mewar Caterers"
    reason: str = "Traffic congestion on Delhi-Jaipur highway"

class IncidentResponse(BaseModel):
    id: str
    wedding_id: str
    title: str
    description: str
    severity: str
    reported_by: str
    reported_at: Optional[datetime] = None
    status: str
    resolution_notes: Optional[str] = None

    class Config:
        from_attributes = True

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    wedding_id: Optional[str] = None
    title: str
    message: str
    type: str
    is_read: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AIQueryRequest(BaseModel):
    wedding_id: str
    query: str

class AIQueryResponse(BaseModel):
    query: str
    answer: str
    data_points: Dict[str, Any]
    confidence: float
    action: Optional[Dict[str, Any]] = None
