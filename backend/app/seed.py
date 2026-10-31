import json
from datetime import datetime, timedelta
from passlib.context import CryptContext
from backend.app.database import engine, SessionLocal, Base
from backend.app.models.models import (
    User, Wedding, WeddingFunction, Venue, Vendor, VendorPackage,
    Quotation, BudgetCategory, PaymentRecord, Guest, SeatingTable,
    PlanningTeamMember, Task, ScheduleItem, Incident, Notification, Review, Complaint
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_pw(pw: str) -> str:
    return pwd_context.hash(pw)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(User).filter(User.email == "couple@theroyalknot.com").first():
            print("Database already contains demo seed data.")
            return

        print("Seeding The Royal Knot database with Jaipur 400-guest demo scenario...")

        # 1. USERS
        admin_user = User(
            id="user-admin-01",
            email="admin@theroyalknot.com",
            hashed_password=hash_pw("password123"),
            full_name="Maharaj Digvijay (Admin Concierge)",
            phone="+91 141 289 9001",
            role="admin",
            is_active=True
        )

        planner_user = User(
            id="user-planner-01",
            email="planner@theroyalknot.com",
            hashed_password=hash_pw("password123"),
            full_name="Ananya Sharma (Senior Royal Planner)",
            phone="+91 982 901 2345",
            role="planner",
            is_active=True
        )

        couple_user = User(
            id="user-couple-01",
            email="couple@theroyalknot.com",
            hashed_password=hash_pw("password123"),
            full_name="Aarav Singhania & Meera Kapoor",
            phone="+91 981 102 3456",
            role="couple",
            is_active=True
        )

        vendor_user = User(
            id="user-vendor-01",
            email="vendor@theroyalknot.com",
            hashed_password=hash_pw("password123"),
            full_name="Vikramaditya Rathore",
            phone="+91 941 405 6789",
            role="vendor",
            is_active=True
        )

        db.add_all([admin_user, planner_user, couple_user, vendor_user])
        db.commit()

        # 2. VENUES (Rajasthan & India Luxury Venues)
        venues_data = [
            Venue(
                id="venue-rambagh-jaipur",
                name="Rambagh Palace Jaipur",
                category="Palaces",
                city="Jaipur",
                state="Rajasthan",
                address="Bhawani Singh Road, Rambagh, Jaipur, Rajasthan 302005",
                capacity_min=200,
                capacity_max=1200,
                price_range_start=2500000.0,
                price_range_end=7500000.0,
                description="The Jewel of Jaipur, former residence of the Maharaja of Jaipur. World-renowned 47 acres of Mughal gardens and regal marble colonnades.",
                facilities_json=["Mughal Gardens", "Royal Amphitheatre", "Heritage Ballroom", "Helipad Access", "Valet Parking for 500 cars", "Private Bridal Pavilions"],
                images_json=["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"],
                contact_phone="+91 141 238 5700",
                contact_email="concierge.rambagh@tajhotels.sample",
                lat=26.8967,
                lng=75.8062,
                is_verified=True,
                is_sample=True
            ),
            Venue(
                id="venue-jai-mahal-jaipur",
                name="Jai Mahal Palace",
                category="Heritage properties",
                city="Jaipur",
                state="Rajasthan",
                address="Jacob Road, Civil Lines, Jaipur, Rajasthan 302006",
                capacity_min=150,
                capacity_max=800,
                price_range_start=1800000.0,
                price_range_end=4500000.0,
                description="Set amidst 18 acres of landscaped Mughal gardens dating back to 1745. An exquisite masterpiece of Indo-Saracenic architecture.",
                facilities_json=["Lotus Garden", "Darbar Lawn", "Swimming Pool Courtyard", "Banquet Suites", "Heritage Suites"],
                images_json=["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"],
                contact_phone="+91 141 660 1111",
                contact_email="jaimahal@tajhotels.sample",
                lat=26.9085,
                lng=75.7891,
                is_verified=True,
                is_sample=True
            ),
            Venue(
                id="venue-udaivilas-udaipur",
                name="The Oberoi Udaivilas",
                category="Resorts",
                city="Udaipur",
                state="Rajasthan",
                address="Haridas Ji Ki Magri, Udaipur, Rajasthan 313001",
                capacity_min=100,
                capacity_max=600,
                price_range_start=3500000.0,
                price_range_end=9000000.0,
                description="Perched upon the banks of Lake Pichola. Breathtaking domes, sunlit courtyards, and grand pavilions tailored for majestic nuptials.",
                facilities_json=["Lakefront Promenade", "Chandra Mahal Lawns", "Private Boat Arrivals", "Luxury Spa Pavilion"],
                images_json=["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"],
                contact_phone="+91 294 243 3300",
                contact_email="reservations@oberoihotels.sample",
                lat=24.5772,
                lng=73.6738,
                is_verified=True,
                is_sample=True
            ),
            Venue(
                id="venue-umaid-bhawan-jodhpur",
                name="Umaid Bhawan Palace",
                category="Palaces",
                city="Jodhpur",
                state="Rajasthan",
                address="Circuit House Rd, Cantt Area, Jodhpur, Rajasthan 342006",
                capacity_min=250,
                capacity_max=1500,
                price_range_start=4000000.0,
                price_range_end=12000000.0,
                description="One of the world's largest private residences with 26 acres of lush gardens. Magnificent golden-yellow sandstone architecture.",
                facilities_json=["Baradari Lawns", "Marwar Hall", "Private Royal Museum Entrance", "Palace Colonnades"],
                images_json=["https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"],
                contact_phone="+91 291 251 0101",
                contact_email="umaidbhawan@tajhotels.sample",
                lat=26.2808,
                lng=73.0474,
                is_verified=True,
                is_sample=True
            )
        ]
        db.add_all(venues_data)
        db.commit()

        # 3. VENDORS (3 Catering Vendors for Comparison + Decor + Photo)
        vendor1 = Vendor(
            id="vendor-royal-mewar",
            user_id="user-vendor-01",
            business_name="Royal Mewar Caterers & Banquets",
            representative_name="Vikramaditya Rathore",
            category="Caterers",
            city="Jaipur",
            state="Rajasthan",
            address="Kanti Nagar, Bani Park, Jaipur",
            experience_years=18,
            description="Specializing in imperial Marwari, Rajputana, Awadhi, and contemporary global banquets with 18 authentic live counters.",
            portfolio_urls_json=["https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80"],
            price_range="₹₹₹",
            verified_status="approved",
            pan_gst="08AABCR1234F1Z1",
            rating=4.95,
            review_count=42,
            is_sample=True
        )

        vendor2 = Vendor(
            id="vendor-rajputana-banquets",
            business_name="Rajputana Heritage Feast Co.",
            representative_name="Gajendra Singh",
            category="Caterers",
            city="Jaipur",
            state="Rajasthan",
            address="Tonk Road, Jaipur",
            experience_years=22,
            description="Royal silver-thali banquets, artisanal sweets, charcoal sigdi kebabs, and luxury confectionery.",
            portfolio_urls_json=["https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"],
            price_range="₹₹₹₹",
            verified_status="approved",
            pan_gst="08AABCG5678F1Z8",
            rating=4.85,
            review_count=35,
            is_sample=True
        )

        vendor3 = Vendor(
            id="vendor-shekhawati-kitchens",
            business_name="Shekhawati Gourmet Kitchens",
            representative_name="Sunil Sharma",
            category="Caterers",
            city="Jaipur",
            state="Rajasthan",
            address="MI Road, Jaipur",
            experience_years=9,
            description="Contemporary fusion catering with live chaat bazaar, tandoor stations, and North Indian feasts.",
            portfolio_urls_json=["https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"],
            price_range="₹₹",
            verified_status="under_review",  # Demonstrates verification queue!
            pan_gst="08AACCS9012F1Z4",
            rating=4.6,
            review_count=19,
            is_sample=True
        )

        vendor4 = Vendor(
            id="vendor-shahi-mandap-decor",
            business_name="Shahi Mandap Royal Decorators",
            representative_name="Kavita Saxena",
            category="Decorators",
            city="Jaipur",
            state="Rajasthan",
            address="Civil Lines, Jaipur",
            experience_years=14,
            description="Bespoke floral architecture, crystal chandeliers, royal velvet draping, and authentic palace mandaps.",
            portfolio_urls_json=["https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"],
            price_range="₹₹₹",
            verified_status="approved",
            pan_gst="08AABCS3456F1Z2",
            rating=4.9,
            review_count=54,
            is_sample=True
        )

        vendor5 = Vendor(
            id="vendor-regal-lenses",
            business_name="Regal Lenses Wedding Cinema",
            representative_name="Devendra Joshi",
            category="Photographers",
            city="Jaipur",
            state="Rajasthan",
            address="C-Scheme, Jaipur",
            experience_years=11,
            description="Candid royal wedding photography, 4K cinematic film trailers, drone cinematography, and heirloom velvet albums.",
            portfolio_urls_json=["https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80"],
            price_range="₹₹₹",
            verified_status="submitted",  # Demonstrates verification queue!
            pan_gst="08AABCJ7890F1Z9",
            rating=4.8,
            review_count=31,
            is_sample=True
        )

        db.add_all([vendor1, vendor2, vendor3, vendor4, vendor5])
        db.commit()

        # 4. SAMPLE JAIPUR WEDDING (400 GUESTS, RAMBAGH PALACE)
        jaipur_wedding = Wedding(
            id="wedding-jaipur-demo-400",
            owner_id=couple_user.id,
            planner_id=planner_user.id,
            couple_names="Aarav Singhania & Meera Kapoor",
            partner1_name="Aarav Singhania",
            partner2_name="Meera Kapoor",
            wedding_date="2026-11-21",
            destination_city="Jaipur",
            destination_state="Rajasthan",
            estimated_guests=400,
            total_budget=5000000.0,  # 50 Lakhs
            allocated_budget=4850000.0,
            currency="INR",
            style="Royal Palace",
            ceremony_tradition="Hindu Traditional (Rajput & Punjabi)",
            status="planning",
            is_demo=True
        )
        db.add(jaipur_wedding)
        db.commit()

        # Functions for Jaipur Wedding
        functions = [
            WeddingFunction(
                id="func-haldi",
                wedding_id=jaipur_wedding.id,
                name="Haldi & Phoolon Ki Holi",
                date="2026-11-20",
                start_time="10:30 AM",
                end_time="01:30 PM",
                venue_name="Rambagh Palace Sunken Courtyard",
                guest_count=250,
                budget_allocation=400000.0,
                order_index=1
            ),
            WeddingFunction(
                id="func-sangeet",
                wedding_id=jaipur_wedding.id,
                name="Imperial Sangeet & Musical Night",
                date="2026-11-20",
                start_time="07:00 PM",
                end_time="11:59 PM",
                venue_name="Rambagh Grand Ballroom & Lawns",
                guest_count=400,
                budget_allocation=1200000.0,
                order_index=2
            ),
            WeddingFunction(
                id="func-wedding",
                wedding_id=jaipur_wedding.id,
                name="Baraat & Royal Wedding Pheras",
                date="2026-11-21",
                start_time="04:30 PM",
                end_time="08:30 PM",
                venue_name="Rambagh Sunset Terrace & Mandap",
                guest_count=400,
                budget_allocation=1800000.0,
                order_index=3
            ),
            WeddingFunction(
                id="func-reception",
                wedding_id=jaipur_wedding.id,
                name="Grand Royal Reception & Banquet",
                date="2026-11-21",
                start_time="08:30 PM",
                end_time="11:59 PM",
                venue_name="Mughal Amphitheatre Gardens",
                guest_count=400,
                budget_allocation=1450000.0,
                order_index=4
            )
        ]
        db.add_all(functions)

        # Budget Categories
        categories = [
            BudgetCategory(wedding_id=jaipur_wedding.id, name="Venue & Heritage Lawns", allocated_amount=1750000.0, committed_amount=1750000.0, actual_spent=1000000.0),
            BudgetCategory(wedding_id=jaipur_wedding.id, name="Gourmet Catering & Live Counters", allocated_amount=1400000.0, committed_amount=1321600.0, actual_spent=500000.0),
            BudgetCategory(wedding_id=jaipur_wedding.id, name="Royal Mandap & Floral Decor", allocated_amount=750000.0, committed_amount=750000.0, actual_spent=350000.0),
            BudgetCategory(wedding_id=jaipur_wedding.id, name="Photography & Heritage Cinema", allocated_amount=400000.0, committed_amount=380000.0, actual_spent=150000.0),
            BudgetCategory(wedding_id=jaipur_wedding.id, name="Live Symphony & Entertainment", allocated_amount=300000.0, committed_amount=300000.0, actual_spent=0.0),
            BudgetCategory(wedding_id=jaipur_wedding.id, name="Hospitality, Stays & Transit", allocated_amount=250000.0, committed_amount=200000.0, actual_spent=0.0),
        ]
        db.add_all(categories)

        # 5. THREE CATERING QUOTATIONS FOR INTELLIGENT COMPARISON (SECTION 5.7)
        quotes = [
            Quotation(
                id="quote-cater-01-mewar",
                wedding_id=jaipur_wedding.id,
                vendor_id=vendor1.id,
                package_description="Imperial Rajvilas Banquet — 18 Live Counters, Dal Baati Churma, Awadhi Biryani, Rajasthani Sweets, Fine Bone China",
                price_per_unit=2800.0,
                unit_type="plate",
                guest_count=400,
                subtotal=1120000.0,
                tax_amount=201600.0,  # 18% GST
                additional_charges=0.0,
                total_amount=1321600.0,
                inclusions_json=[
                    "18 Gourmet Live Counters (Chaat, Tandoor, Italian Pasta, Rajasthani Kadhai)",
                    "Fine Bone China Crockery & Gold Cutlery",
                    "1:8 Waitstaff to Guest Service Ratio",
                    "Dedicated Senior Banquet Captain & Kitchen Supervisors",
                    "Complimentary Midnight Snack Station & Kulhad Chai",
                    "All Food Safety & Heating Equipment Included"
                ],
                exclusions_json=[
                    "Imported Exotic Seafood (available as add-on)",
                    "Hard Liquor Service Bar Setup (quoted separately)"
                ],
                validity_date="2026-11-30",
                payment_terms="25% Booking, 50% Pre-Event, 25% Post-Banquet",
                status="accepted",
                is_recommended=True,
                comparison_notes="BEST OVERALL VALUE: Exceptional inclusions, highest verified rating (4.95), bone china included without surcharge."
            ),
            Quotation(
                id="quote-cater-02-rajputana",
                wedding_id=jaipur_wedding.id,
                vendor_id=vendor2.id,
                package_description="Maharani Silver Thali Feast — 22 Live Counters, Silver Tableware, Signature Royal Marwar Delicacies",
                price_per_unit=3200.0,
                unit_type="plate",
                guest_count=400,
                subtotal=1280000.0,
                tax_amount=230400.0,
                additional_charges=25000.0,  # Silverware security deposit & polish
                total_amount=1535400.0,
                inclusions_json=[
                    "22 Heritage Live Counters",
                    "Authentic Silver-plated Thali Table Service",
                    "1:6 Dedicated Service Ratio",
                    "Customized Floral Centerpieces for Dining Tables",
                    "Live Jalebi & Rabri Station"
                ],
                exclusions_json=[
                    "Transportation outside Jaipur Municipal limits",
                    "Catering waste management surcharge (₹15,000)"
                ],
                validity_date="2026-11-25",
                payment_terms="40% Booking, 40% Pre-Event, 20% Delivery",
                status="submitted",
                is_recommended=False,
                comparison_notes="Premium option: Magnificent presentation with silver thalis, but 16% higher total expenditure."
            ),
            Quotation(
                id="quote-cater-03-shekhawati",
                wedding_id=jaipur_wedding.id,
                vendor_id=vendor3.id,
                package_description="Royal Express Banquet — 12 Live Counters, Traditional North Indian Menu, Standard Tableware",
                price_per_unit=2400.0,
                unit_type="plate",
                guest_count=400,
                subtotal=960000.0,
                tax_amount=172800.0,
                additional_charges=35000.0,  # Transport and refrigeration extra
                total_amount=1167800.0,
                inclusions_json=[
                    "12 Basic Live Counters",
                    "Standard Melamine Tableware & Cutlery",
                    "1:12 Staff Ratio",
                    "Standard Buffet Heating"
                ],
                exclusions_json=[
                    "Bone china / Ceramic crockery (+₹250/plate)",
                    "Live dessert stations",
                    "Waitstaff uniform coordination"
                ],
                validity_date="2026-11-15",
                payment_terms="50% Advance, 50% on Event Day Morning",
                status="submitted",
                is_recommended=False,
                comparison_notes="Budget option: Lowest base plate price, but excludes premium tableware and has higher staff ratio (1:12)."
            )
        ]
        db.add_all(quotes)

        # 6. STAGED PAYMENTS (SECTION 5.10)
        payments = [
            PaymentRecord(
                id="pay-01",
                wedding_id=jaipur_wedding.id,
                vendor_id=vendor1.id,
                title="Palace Venue Booking Deposit (Rambagh)",
                stage="booking",
                amount=500000.0,
                due_date="2026-08-15",
                status="completed",
                payment_method="NEFT Bank Transfer",
                transaction_reference="TXN-TRK-8829104",
                invoice_number="INV-TRK-2026-001",
                is_simulated=True,
                paid_at=datetime.utcnow() - timedelta(days=60)
            ),
            PaymentRecord(
                id="pay-02",
                wedding_id=jaipur_wedding.id,
                vendor_id=vendor1.id,
                title="Catering 25% Advance Escrow (Royal Mewar)",
                stage="advance",
                amount=330400.0,
                due_date="2026-09-01",
                status="completed",
                payment_method="Corporate Net Banking",
                transaction_reference="TXN-TRK-9948210",
                invoice_number="INV-TRK-2026-024",
                is_simulated=True,
                paid_at=datetime.utcnow() - timedelta(days=40)
            ),
            PaymentRecord(
                id="pay-03",
                wedding_id=jaipur_wedding.id,
                vendor_id=vendor4.id,
                title="Mandap & Floral Artistry Pre-Event Clearance",
                stage="pre_event",
                amount=450000.0,
                due_date="2026-11-12",
                status="pending",
                payment_method="NEFT / RTGS Escrow",
                transaction_reference=None,
                invoice_number="INV-TRK-2026-088",
                is_simulated=True
            ),
            PaymentRecord(
                id="pay-04",
                wedding_id=jaipur_wedding.id,
                vendor_id=vendor1.id,
                title="Catering 50% Pre-Event Escrow Staging",
                stage="pre_event",
                amount=660800.0,
                due_date="2026-11-15",
                status="pending",
                payment_method="Bank Transfer",
                transaction_reference=None,
                invoice_number="INV-TRK-2026-092",
                is_simulated=True
            ),
            PaymentRecord(
                id="pay-05",
                wedding_id=jaipur_wedding.id,
                vendor_id=vendor1.id,
                title="Final Settlement Post-Reception",
                stage="final",
                amount=330400.0,
                due_date="2026-11-22",
                status="pending",
                payment_method="NEFT / Bank Transfer",
                transaction_reference=None,
                invoice_number="INV-TRK-2026-105",
                is_simulated=True
            )
        ]
        db.add_all(payments)

        # 7. PLANNING TEAM MEMBERS
        team = [
            PlanningTeamMember(wedding_id=jaipur_wedding.id, user_id=planner_user.id, full_name="Ananya Sharma", role_title="Lead Royal Planner", phone="+91 982 901 2345", is_on_site=True),
            PlanningTeamMember(wedding_id=jaipur_wedding.id, full_name="Rohan Verma", role_title="Hospitality & VIP Lounge Lead", phone="+91 982 902 3456", is_on_site=True),
            PlanningTeamMember(wedding_id=jaipur_wedding.id, full_name="Pooja Chawla", role_title="Rituals & Phera Coordinator", phone="+91 982 903 4567", is_on_site=True),
            PlanningTeamMember(wedding_id=jaipur_wedding.id, full_name="Arjun Mehta", role_title="Technical & Audio-Visual Director", phone="+91 982 904 5678", is_on_site=True),
        ]
        db.add_all(team)

        # 8. TASKS (KANBAN)
        tasks = [
            Task(wedding_id=jaipur_wedding.id, title="Finalize Grand Phera Mandap Marigold Specification", description="Approve 500kg fresh African marigold garlands and brass kalash setup.", assigned_to_name="Ananya Sharma", priority="critical", status="in_progress", due_date="2026-11-10"),
            Task(wedding_id=jaipur_wedding.id, title="Verify Royal Mewar FSSAI & Kitchen Transit Clearance", description="Ensure refrigerated food vans have highway entry permit.", assigned_to_name="Rohan Verma", priority="high", status="completed", due_date="2026-11-05"),
            Task(wedding_id=jaipur_wedding.id, title="Disclose Dietary Preferences to Executive Chef", description="42 Jain pure-satvik requests, 18 gluten-free guests tagged in Guest Guardian.", assigned_to_name="Pooja Chawla", priority="high", status="in_progress", due_date="2026-11-12"),
            Task(wedding_id=jaipur_wedding.id, title="Rehearsal with Wedding Pandit Ji & Shehnai Troupe", description="Coordinate auspicious timings for sunset muhurat with Pandit Sharma.", assigned_to_name="Pooja Chawla", priority="medium", status="to_plan", due_date="2026-11-18"),
            Task(wedding_id=jaipur_wedding.id, title="Distribute QR Check-in Tablets to Welcome Desk", description="6 tablets loaded with offline guest check-in database.", assigned_to_name="Arjun Mehta", priority="medium", status="to_plan", due_date="2026-11-19"),
        ]
        db.add_all(tasks)

        # 9. SCHEDULE (MINUTE-BY-MINUTE COMMAND CENTRE RUN OF SHOW)
        schedule = [
            ScheduleItem(
                wedding_id=jaipur_wedding.id,
                title="Baraat Arrival & Royal Elephant Welcome",
                start_time="04:30 PM",
                end_time="05:30 PM",
                venue_area="Rambagh Palace Grand Gate & North Porch",
                vendor_name="Royal Heritage Brass Band & Bagpipers",
                responsible_coordinator="Rohan Verma",
                status="scheduled",
                delay_minutes=0,
                dependent_items_json=["Milni Ceremony at Royal Arch"],
                notes="Rose petal showers from palace balconies"
            ),
            ScheduleItem(
                wedding_id=jaipur_wedding.id,
                title="Milni Ceremony & Jaimala Garland Exchange",
                start_time="05:30 PM",
                end_time="06:15 PM",
                venue_area="Mughal Amphitheatre Central Stage",
                vendor_name="Shahi Mandap Royal Decorators",
                responsible_coordinator="Ananya Sharma",
                status="scheduled",
                delay_minutes=0,
                dependent_items_json=["Sacred Vedic Pheras"],
                notes="Hydraulic floral rotating stage active"
            ),
            ScheduleItem(
                wedding_id=jaipur_wedding.id,
                title="Catering Live Counters & Sunset High Tea Setup",
                start_time="06:00 PM",
                end_time="07:30 PM",
                venue_area="Palace Courtyard & Dining Pavilion",
                vendor_name="Royal Mewar Caterers",
                responsible_coordinator="Vikramaditya Rathore",
                status="scheduled",
                delay_minutes=0,
                dependent_items_json=["Royal Buffet Dinner Service"],
                notes="18 live stations pre-heating"
            ),
            ScheduleItem(
                wedding_id=jaipur_wedding.id,
                title="Sacred Vedic Pheras & Kanyadaan",
                start_time="06:30 PM",
                end_time="08:15 PM",
                venue_area="Sunset Mandap Pavilion",
                vendor_name="Pandit Ramkishan Vedacharya",
                responsible_coordinator="Pooja Chawla",
                status="scheduled",
                delay_minutes=0,
                dependent_items_json=["Royal Buffet Dinner Service"],
                notes="Sacred havan kund prepared with pure sandalwood"
            ),
            ScheduleItem(
                wedding_id=jaipur_wedding.id,
                title="Royal Buffet Dinner Service & Live Symphony",
                start_time="08:30 PM",
                end_time="11:30 PM",
                venue_area="Maharaja Banquet Garden Lawn",
                vendor_name="Royal Mewar Caterers",
                responsible_coordinator="Ananya Sharma",
                status="scheduled",
                delay_minutes=0,
                dependent_items_json=[],
                notes="400 guests seated across 50 round tables"
            )
        ]
        db.add_all(schedule)

        # 10. GUESTS & SEATING TABLES (Visual Seating Arrangement)
        tables = [
            SeatingTable(id="table-01", wedding_id=jaipur_wedding.id, table_name="The Maharaja VIP Table", table_number=1, capacity=8, shape="royal_banquet"),
            SeatingTable(id="table-02", wedding_id=jaipur_wedding.id, table_name="Bride Immediate Family", table_number=2, capacity=8, shape="round"),
            SeatingTable(id="table-03", wedding_id=jaipur_wedding.id, table_name="Groom Immediate Family", table_number=3, capacity=8, shape="round"),
            SeatingTable(id="table-04", wedding_id=jaipur_wedding.id, table_name="College & School Friends", table_number=4, capacity=10, shape="round"),
            SeatingTable(id="table-05", wedding_id=jaipur_wedding.id, table_name="Corporate & International Guests", table_number=5, capacity=8, shape="round"),
        ]
        db.add_all(tables)

        sample_guests = [
            Guest(wedding_id=jaipur_wedding.id, name="Vijay Singhania (Father of Groom)", email="vijay.s@singhania.sample", phone="+91 982 100 1111", group_name="Groom Family", rsvp_status="attending", dietary_preference="Vegetarian", is_vip=True, table_id="table-01"),
            Guest(wedding_id=jaipur_wedding.id, name="Sunita Singhania (Mother of Groom)", email="sunita.s@singhania.sample", phone="+91 982 100 2222", group_name="Groom Family", rsvp_status="attending", dietary_preference="Vegetarian", is_vip=True, table_id="table-01"),
            Guest(wedding_id=jaipur_wedding.id, name="Rajesh Kapoor (Father of Bride)", email="rajesh.k@kapoor.sample", phone="+91 982 100 3333", group_name="Bride Family", rsvp_status="attending", dietary_preference="Vegetarian", is_vip=True, table_id="table-02"),
            Guest(wedding_id=jaipur_wedding.id, name="Poonam Kapoor (Mother of Bride)", email="poonam.k@kapoor.sample", phone="+91 982 100 4444", group_name="Bride Family", rsvp_status="attending", dietary_preference="Vegetarian", is_vip=True, table_id="table-02"),
            Guest(wedding_id=jaipur_wedding.id, name="Kabir Malhotra", email="kabir.m@sample.com", phone="+91 982 100 5555", group_name="Friends", rsvp_status="attending", dietary_preference="Jain", is_vip=False, table_id="table-04"),
            Guest(wedding_id=jaipur_wedding.id, name="Natasha Oberoi", email="natasha.o@sample.com", phone="+91 982 100 6666", group_name="Friends", rsvp_status="attending", dietary_preference="Vegan", is_vip=False, table_id="table-04"),
        ]
        db.add_all(sample_guests)

        # Commit all
        db.commit()
        print("Successfully seeded all demo data for The Royal Knot!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
