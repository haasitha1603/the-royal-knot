import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, JSON
)
from sqlalchemy.orm import relationship
from backend.app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(String, default="couple")  # couple, vendor, planner, coordinator, admin
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    weddings_owned = relationship("Wedding", back_populates="owner", foreign_keys="Wedding.owner_id")
    weddings_planned = relationship("Wedding", back_populates="planner", foreign_keys="Wedding.planner_id")
    vendor_profile = relationship("Vendor", back_populates="user", uselist=False)

class Wedding(Base):
    __tablename__ = "weddings"

    id = Column(String, primary_key=True, default=generate_uuid)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    planner_id = Column(String, ForeignKey("users.id"), nullable=True)
    couple_names = Column(String, nullable=False)
    partner1_name = Column(String, nullable=False)
    partner2_name = Column(String, nullable=False)
    wedding_date = Column(String, nullable=False)
    destination_city = Column(String, default="Jaipur")
    destination_state = Column(String, default="Rajasthan")
    estimated_guests = Column(Integer, default=400)
    total_budget = Column(Float, default=5000000.0)  # in INR
    allocated_budget = Column(Float, default=4850000.0)
    currency = Column(String, default="INR")
    style = Column(String, default="Royal Palace")
    ceremony_tradition = Column(String, default="Hindu Traditional")
    status = Column(String, default="planning")  # planning, confirmed, ongoing, completed
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    owner = relationship("User", foreign_keys=[owner_id], back_populates="weddings_owned")
    planner = relationship("User", foreign_keys=[planner_id], back_populates="weddings_planned")
    functions = relationship("WeddingFunction", back_populates="wedding", cascade="all, delete-orphan")
    budget_categories = relationship("BudgetCategory", back_populates="wedding", cascade="all, delete-orphan")
    budget_change_requests = relationship("BudgetChangeRequest", back_populates="wedding", cascade="all, delete-orphan")
    payments = relationship("PaymentRecord", back_populates="wedding", cascade="all, delete-orphan")
    guests = relationship("Guest", back_populates="wedding", cascade="all, delete-orphan")
    seating_tables = relationship("SeatingTable", back_populates="wedding", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="wedding", cascade="all, delete-orphan")
    schedule_items = relationship("ScheduleItem", back_populates="wedding", cascade="all, delete-orphan")
    incidents = relationship("Incident", back_populates="wedding", cascade="all, delete-orphan")
    team_members = relationship("PlanningTeamMember", back_populates="wedding", cascade="all, delete-orphan")

class WeddingFunction(Base):
    __tablename__ = "wedding_functions"

    id = Column(String, primary_key=True, default=generate_uuid)
    wedding_id = Column(String, ForeignKey("weddings.id"), nullable=False)
    name = Column(String, nullable=False)
    date = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    venue_name = Column(String, nullable=True)
    venue_location = Column(String, nullable=True)
    guest_count = Column(Integer, default=400)
    budget_allocation = Column(Float, default=0.0)
    notes = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)

    wedding = relationship("Wedding", back_populates="functions")

class Venue(Base):
    __tablename__ = "venues"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    category = Column(String, default="Palaces")
    city = Column(String, default="Jaipur")
    state = Column(String, default="Rajasthan")
    address = Column(String, nullable=False)
    capacity_min = Column(Integer, default=100)
    capacity_max = Column(Integer, default=1000)
    price_range_start = Column(Float, default=1500000.0)
    price_range_end = Column(Float, default=5000000.0)
    description = Column(Text, nullable=False)
    facilities_json = Column(JSON, default=list)
    images_json = Column(JSON, default=list)
    contact_phone = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    lat = Column(Float, default=26.9124)
    lng = Column(Float, default=75.7873)
    is_verified = Column(Boolean, default=True)
    is_sample = Column(Boolean, default=True)

class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    business_name = Column(String, nullable=False)
    representative_name = Column(String, nullable=False)
    category = Column(String, nullable=False)  # Caterers, Decorators, Photographers, Planners, Makeup, Mehendi, Entertainment
    city = Column(String, default="Jaipur")
    state = Column(String, default="Rajasthan")
    address = Column(String, nullable=True)
    experience_years = Column(Integer, default=5)
    description = Column(Text, nullable=False)
    portfolio_urls_json = Column(JSON, default=list)
    price_range = Column(String, default="₹₹₹")
    verified_status = Column(String, default="approved")  # submitted, documents_pending, under_review, approved, rejected, suspended
    pan_gst = Column(String, nullable=True)
    verification_documents_json = Column(JSON, default=list)
    rating = Column(Float, default=4.9)
    review_count = Column(Integer, default=28)
    is_sample = Column(Boolean, default=True)

    user = relationship("User", back_populates="vendor_profile")
    packages = relationship("VendorPackage", back_populates="vendor", cascade="all, delete-orphan")

class VendorPackage(Base):
    __tablename__ = "vendor_packages"

    id = Column(String, primary_key=True, default=generate_uuid)
    vendor_id = Column(String, ForeignKey("vendors.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Float, nullable=False)
    unit = Column(String, default="per plate")
    inclusions_json = Column(JSON, default=list)
    exclusions_json = Column(JSON, default=list)

    vendor = relationship("Vendor", back_populates="packages")

class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(String, primary_key=True, default=generate_uuid)
    wedding_id = Column(String, nullable=False)
    vendor_id = Column(String, ForeignKey("vendors.id"), nullable=False)
    user_id = Column(String, nullable=False)
    category = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    guest_count = Column(Integer, default=400)
    event_date = Column(String, nullable=True)
    status = Column(String, default="open")  # open, replied, closed
    created_at = Column(DateTime, default=datetime.utcnow)

class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(String, primary_key=True, default=generate_uuid)
    enquiry_id = Column(String, nullable=True)
    wedding_id = Column(String, ForeignKey("weddings.id"), nullable=False)
    vendor_id = Column(String, ForeignKey("vendors.id"), nullable=False)
    package_description = Column(Text, nullable=False)
    price_per_unit = Column(Float, nullable=False)
    unit_type = Column(String, default="plate")
    guest_count = Column(Integer, default=400)
    subtotal = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0)
    additional_charges = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    inclusions_json = Column(JSON, default=list)
    exclusions_json = Column(JSON, default=list)
    validity_date = Column(String, nullable=True)
    payment_terms = Column(String, default="30% Advance, 50% Pre-Event, 20% Post-Event")
    status = Column(String, default="submitted")  # submitted, under_review, accepted, rejected, superseded
    is_recommended = Column(Boolean, default=False)
    comparison_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    vendor = relationship("Vendor")

class BudgetCategory(Base):
    __tablename__ = "budget_categories"

    id = Column(String, primary_key=True, default=generate_uuid)
    wedding_id = Column(String, ForeignKey("weddings.id"), nullable=False)
    name = Column(String, nullable=False)
    allocated_amount = Column(Float, default=0.0)
    committed_amount = Column(Float, default=0.0)
    actual_spent = Column(Float, default=0.0)

    wedding = relationship("Wedding", back_populates="budget_categories")

class BudgetChangeRequest(Base):
    __tablename__ = "budget_change_requests"

    id = Column(String, primary_key=True, default=generate_uuid)
    wedding_id = Column(String, ForeignKey("weddings.id"), nullable=False)
    requested_by_id = Column(String, nullable=False)
    previous_budget = Column(Float, nullable=False)
    new_budget = Column(Float, nullable=False)
    additional_guests = Column(Integer, default=0)
    estimated_cost_impact = Column(Float, default=0.0)
    reason = Column(Text, nullable=False)
    status = Column(String, default="pending")  # pending, approved, rejected
    approved_by_id = Column(String, nullable=True)
    approval_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    wedding = relationship("Wedding", back_populates="budget_change_requests")

class PaymentRecord(Base):
    __tablename__ = "payment_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    wedding_id = Column(String, ForeignKey("weddings.id"), nullable=False)
    vendor_id = Column(String, ForeignKey("vendors.id"), nullable=True)
    title = Column(String, nullable=False)
    stage = Column(String, default="advance")  # booking, advance, pre_event, final, additional
    amount = Column(Float, nullable=False)
    due_date = Column(String, nullable=False)
    status = Column(String, default="pending")  # pending, completed, overdue, refunded
    payment_method = Column(String, default="NEFT / Bank Transfer")
    transaction_reference = Column(String, nullable=True)
    invoice_number = Column(String, nullable=True)
    is_simulated = Column(Boolean, default=True)
    paid_at = Column(DateTime, nullable=True)

    wedding = relationship("Wedding", back_populates="payments")
    vendor = relationship("Vendor")

class Guest(Base):
    __tablename__ = "guests"

    id = Column(String, primary_key=True, default=generate_uuid)
    wedding_id = Column(String, ForeignKey("weddings.id"), nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    group_name = Column(String, default="Friends & Family")
    rsvp_status = Column(String, default="attending")  # attending, declined, tentative, invited
    function_attendance_json = Column(JSON, default=list)
    dietary_preference = Column(String, default="Vegetarian")
    is_vip = Column(Boolean, default=False)
    plus_ones = Column(Integer, default=0)
    table_id = Column(String, ForeignKey("seating_tables.id"), nullable=True)
    check_in_status = Column(Boolean, default=False)
    check_in_time = Column(DateTime, nullable=True)

    wedding = relationship("Wedding", back_populates="guests")

class SeatingTable(Base):
    __tablename__ = "seating_tables"

    id = Column(String, primary_key=True, default=generate_uuid)
    wedding_id = Column(String, ForeignKey("weddings.id"), nullable=False)
    table_name = Column(String, nullable=False)
    table_number = Column(Integer, nullable=False)
    capacity = Column(Integer, default=8)
    function_id = Column(String, nullable=True)
    shape = Column(String, default="round")  # round, rectangular, royal_banquet

    wedding = relationship("Wedding", back_populates="seating_tables")
    guests = relationship("Guest", backref="assigned_table")

class PlanningTeamMember(Base):
    __tablename__ = "planning_team_members"

    id = Column(String, primary_key=True, default=generate_uuid)
    wedding_id = Column(String, ForeignKey("weddings.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    full_name = Column(String, nullable=False)
    role_title = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    is_on_site = Column(Boolean, default=True)

    wedding = relationship("Wedding", back_populates="team_members")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, default=generate_uuid)
    wedding_id = Column(String, ForeignKey("weddings.id"), nullable=False)
    function_id = Column(String, nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    assigned_to_name = Column(String, default="Lead Planner")
    priority = Column(String, default="medium")  # low, medium, high, critical
    status = Column(String, default="in_progress")  # to_plan, in_progress, waiting_approval, completed, delayed
    due_date = Column(String, nullable=False)

    wedding = relationship("Wedding", back_populates="tasks")

class ScheduleItem(Base):
    __tablename__ = "schedule_items"

    id = Column(String, primary_key=True, default=generate_uuid)
    wedding_id = Column(String, ForeignKey("weddings.id"), nullable=False)
    function_id = Column(String, nullable=True)
    title = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    venue_area = Column(String, nullable=False)
    vendor_name = Column(String, nullable=True)
    responsible_coordinator = Column(String, default="Ananya Sharma")
    status = Column(String, default="scheduled")  # scheduled, in_progress, delayed, completed
    delay_minutes = Column(Integer, default=0)
    dependent_items_json = Column(JSON, default=list)
    notes = Column(Text, nullable=True)

    wedding = relationship("Wedding", back_populates="schedule_items")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, default=generate_uuid)
    wedding_id = Column(String, ForeignKey("weddings.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String, default="medium")  # low, medium, high, critical
    reported_by = Column(String, default="Coordinator")
    reported_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="open")  # open, investigating, resolved
    resolution_notes = Column(Text, nullable=True)

    wedding = relationship("Wedding", back_populates="incidents")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    wedding_id = Column(String, nullable=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="alert")  # alert, delay, approval, payment, general
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, default=generate_uuid)
    vendor_id = Column(String, ForeignKey("vendors.id"), nullable=False)
    wedding_id = Column(String, nullable=True)
    author_id = Column(String, nullable=False)
    author_name = Column(String, nullable=False)
    rating = Column(Float, default=5.0)
    comment = Column(Text, nullable=False)
    is_verified_booking = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    vendor_id = Column(String, ForeignKey("vendors.id"), nullable=True)
    wedding_id = Column(String, nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String, default="submitted")  # submitted, under_investigation, resolved, dismissed
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class PrivacyRequest(Base):
    __tablename__ = "privacy_requests"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    request_type = Column(String, nullable=False)  # data_export, data_deletion, consent_withdrawal
    details = Column(Text, nullable=True)
    status = Column(String, default="pending")  # pending, processing, completed, denied
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=True)
    action = Column(String, nullable=False)
    entity_name = Column(String, nullable=False)
    entity_id = Column(String, nullable=False)
    details_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
