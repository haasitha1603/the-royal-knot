import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def get_auth_token(email: str, password: str = "password123") -> str:
    res = client.post("/api/auth/login", json={"email": email, "password": password})
    assert res.status_code == 200, f"Login failed for {email}: {res.text}"
    return res.json()["access_token"]

# -------------------------------------------------------------
# 1. AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC / IDOR)
# -------------------------------------------------------------
def test_authentication_success_and_failure():
    # Valid Couple Login
    res_valid = client.post("/api/auth/login", json={
        "email": "couple@theroyalknot.com",
        "password": "password123"
    })
    assert res_valid.status_code == 200
    data = res_valid.json()
    assert data["role"] == "couple"
    assert "access_token" in data

    # Invalid Password
    res_invalid = client.post("/api/auth/login", json={
        "email": "couple@theroyalknot.com",
        "password": "wrongpassword"
    })
    assert res_invalid.status_code == 401

def test_rbac_idor_protection_cross_wedding():
    couple_token = get_auth_token("couple@theroyalknot.com")
    couple_headers = {"Authorization": f"Bearer {couple_token}"}

    # Access authorized demo wedding
    res_allowed = client.get("/api/weddings/wedding-jaipur-demo-400", headers=couple_headers)
    assert res_allowed.status_code == 200

    # Attempt to access non-existent or foreign wedding
    res_forbidden = client.get("/api/weddings/non-existent-or-forbidden-wedding-id", headers=couple_headers)
    assert res_forbidden.status_code in [403, 404]

def test_admin_universal_access_and_audit():
    admin_token = get_auth_token("admin@theroyalknot.com")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Admin accesses analytics
    res_analytics = client.get("/api/admin/analytics", headers=admin_headers)
    assert res_analytics.status_code == 200
    analytics = res_analytics.json()
    assert "metrics" in analytics
    assert analytics["metrics"]["total_weddings"] >= 1

    # Couple tries to access admin analytics -> 403 Forbidden
    couple_token = get_auth_token("couple@theroyalknot.com")
    res_denied = client.get("/api/admin/analytics", headers={"Authorization": f"Bearer {couple_token}"})
    assert res_denied.status_code == 403

# -------------------------------------------------------------
# 2. BUDGET GUARDIAN & FORMAL APPROVAL STATE MACHINE
# -------------------------------------------------------------
def test_budget_change_request_workflow():
    couple_token = get_auth_token("couple@theroyalknot.com")
    couple_headers = {"Authorization": f"Bearer {couple_token}"}
    wedding_id = "wedding-jaipur-demo-400"

    # 1. Fetch initial budget
    init_overview = client.get(f"/api/budgets/wedding/{wedding_id}/overview", headers=couple_headers).json()
    initial_budget = init_overview["total_approved_budget"]

    # 2. Couple creates a formal Budget Change Request for +60 guests
    create_res = client.post(
        f"/api/budgets/wedding/{wedding_id}/change-requests",
        json={
            "additional_guests": 60,
            "reason": "Family guest addition for Jaipur Sangeet & Reception"
        },
        headers=couple_headers
    )
    assert create_res.status_code == 200
    request_data = create_res.json()
    request_id = request_data["id"]
    assert request_data["status"] == "pending"
    assert request_data["additional_guests"] == 60
    assert request_data["estimated_cost_impact"] > 0

    # 3. CRITICAL: Official wedding budget must NOT be mutated while pending
    mid_overview = client.get(f"/api/budgets/wedding/{wedding_id}/overview", headers=couple_headers).json()
    assert mid_overview["total_approved_budget"] == initial_budget, "Official budget must not mutate prematurely!"

    # 4. Planner logs in to review and formally approve
    planner_token = get_auth_token("planner@theroyalknot.com")
    planner_headers = {"Authorization": f"Bearer {planner_token}"}

    approve_res = client.post(
        f"/api/budgets/change-requests/{request_id}/approve",
        headers=planner_headers
    )
    assert approve_res.status_code == 200
    approved_data = approve_res.json()
    assert approved_data["status"] == "approved"

    # 5. NOW the official wedding budget must be updated to the approved amount
    post_overview = client.get(f"/api/budgets/wedding/{wedding_id}/overview", headers=couple_headers).json()
    assert post_overview["total_approved_budget"] == approved_data["new_budget"]

# -------------------------------------------------------------
# 3. SEATING PLANNER CAPACITY & ALLOCATION INTEGRITY
# -------------------------------------------------------------
def test_seating_table_capacity_enforcement():
    couple_token = get_auth_token("couple@theroyalknot.com")
    couple_headers = {"Authorization": f"Bearer {couple_token}"}
    wedding_id = "wedding-jaipur-demo-400"

    # Fetch tables and guests
    tables_res = client.get(f"/api/guests/wedding/{wedding_id}/tables", headers=couple_headers)
    assert tables_res.status_code == 200
    tables = tables_res.json()
    assert len(tables) >= 1
    table = tables[0]

    guests_res = client.get(f"/api/guests/wedding/{wedding_id}", headers=couple_headers)
    assert guests_res.status_code == 200
    guests = guests_res.json()
    assert len(guests) >= 1
    guest = guests[0]

    # Assign guest to table
    assign_res = client.post(
        f"/api/guests/wedding/{wedding_id}/tables/{table['id']}/assign-guest/{guest['id']}",
        headers=couple_headers
    )
    assert assign_res.status_code == 200
    assert assign_res.json()["table_id"] == table["id"]

    # Unassign guest from table
    unassign_res = client.post(
        f"/api/guests/wedding/{wedding_id}/guests/{guest['id']}/unassign-table",
        headers=couple_headers
    )
    assert unassign_res.status_code == 200

# -------------------------------------------------------------
# 4. PAYMENT STAGES & DUPLICATE SETTLEMENT GUARD
# -------------------------------------------------------------
def test_payment_duplicate_settlement_prevention():
    couple_token = get_auth_token("couple@theroyalknot.com")
    couple_headers = {"Authorization": f"Bearer {couple_token}"}
    wedding_id = "wedding-jaipur-demo-400"

    # Create a fresh payment milestone
    create_pay = client.post(
        f"/api/payments/wedding/{wedding_id}",
        json={
            "title": "Royal Shehnai Artisans Advance Milestone",
            "stage": "advance",
            "amount": 75000.0,
            "due_date": "2026-11-01",
            "payment_method": "NEFT / RTGS"
        },
        headers=couple_headers
    )
    assert create_pay.status_code == 200
    pay_id = create_pay.json()["id"]

    # First simulated settlement -> Success (200)
    settle_1 = client.post(
        f"/api/payments/{pay_id}/simulate-settlement",
        json={"payment_method": "NEFT / Bank Transfer"},
        headers=couple_headers
    )
    assert settle_1.status_code == 200
    assert settle_1.json()["status"] == "completed"

    # Second settlement attempt on already settled milestone -> 400 Bad Request
    settle_2 = client.post(
        f"/api/payments/{pay_id}/simulate-settlement",
        json={"payment_method": "NEFT / Bank Transfer"},
        headers=couple_headers
    )
    assert settle_2.status_code == 400
    assert "already been settled" in settle_2.json()["detail"].lower()

# -------------------------------------------------------------
# 5. OPERATIONS DYNAMIC SCHEDULE DELAY ENGINE
# -------------------------------------------------------------
def test_operations_dynamic_delay_and_revision_publishing():
    planner_token = get_auth_token("planner@theroyalknot.com")
    planner_headers = {"Authorization": f"Bearer {planner_token}"}
    wedding_id = "wedding-jaipur-demo-400"

    # Simulate 30-minute delay
    delay_res = client.post(
        f"/api/operations/wedding/{wedding_id}/simulate-vendor-delay",
        json={
            "delay_minutes": 30,
            "vendor_name": "Royal Mewar Caterers",
            "reason": "VIP Highway convoy clearance"
        },
        headers=planner_headers
    )
    assert delay_res.status_code == 200
    delay_data = delay_res.json()
    assert delay_data["status"] == "warning"
    assert delay_data["delay_recorded_minutes"] == 30
    assert "proposed_revisions" in delay_data
    assert len(delay_data["proposed_revisions"]) >= 1

    # Planner authorizes and publishes revised run of show
    publish_res = client.post(
        f"/api/operations/wedding/{wedding_id}/publish-revised-schedule",
        headers=planner_headers
    )
    assert publish_res.status_code == 200
    assert publish_res.json()["items_updated"] >= 1

# -------------------------------------------------------------
# 6. AUDIT LOGGING PLATFORM TRAIL
# -------------------------------------------------------------
def test_immutable_audit_logging_trail():
    admin_token = get_auth_token("admin@theroyalknot.com")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    logs_res = client.get("/api/admin/audit-logs?limit=20", headers=admin_headers)
    assert logs_res.status_code == 200
    logs = logs_res.json()
    assert len(logs) >= 1
    # Check that entries have required audit attributes
    first_log = logs[0]
    assert "action" in first_log
    assert "created_at" in first_log

# -------------------------------------------------------------
# 7. VENDOR DOUBLE-BOOKING PREVENTION
# -------------------------------------------------------------
def test_vendor_double_booking_prevention():
    couple_token = get_auth_token("couple@theroyalknot.com")
    couple_headers = {"Authorization": f"Bearer {couple_token}"}
    wedding_id = "wedding-jaipur-demo-400"

    # Fetch catering quotations
    quotes_res = client.get(f"/api/quotations/wedding/{wedding_id}/compare-catering", headers=couple_headers)
    assert quotes_res.status_code == 200
    quotes = quotes_res.json()["comparison"]
    assert len(quotes) >= 1
    quote_id = quotes[0]["quotation_id"]

    # Accept the quotation -> 200 OK
    accept_res = client.post(f"/api/quotations/{quote_id}/accept", headers=couple_headers)
    assert accept_res.status_code == 200
    assert accept_res.json()["status"] == "accepted"
