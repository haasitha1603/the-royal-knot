import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "The Royal Knot"
    assert data["status"] == "operational"

def test_auth_login():
    response = client.post("/api/auth/login", json={
        "email": "couple@theroyalknot.com",
        "password": "password123"
    })
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["role"] == "couple"
    assert token_data["full_name"] == "Aarav Singhania & Meera Kapoor"

def test_venues_listing():
    response = client.get("/api/venues")
    assert response.status_code == 200
    venues = response.json()
    assert len(venues) >= 4
    # Ensure Rambagh Palace exists
    rambagh = next((v for v in venues if "Rambagh" in v["name"]), None)
    assert rambagh is not None
    assert rambagh["city"] == "Jaipur"
    assert rambagh["capacity_max"] >= 1000

def test_vendors_and_verification():
    response = client.get("/api/vendors")
    assert response.status_code == 200
    vendors = response.json()
    assert len(vendors) >= 5
    mewar = next((v for v in vendors if "Royal Mewar" in v["business_name"]), None)
    assert mewar is not None
    assert mewar["verified_status"] == "approved"

def test_catering_quotation_comparison():
    wedding_id = "wedding-jaipur-demo-400"
    response = client.get(f"/api/quotations/wedding/{wedding_id}/compare-catering")
    assert response.status_code == 200
    comp = response.json()
    assert comp["quotations_analyzed"] == 3
    assert len(comp["comparison"]) == 3
    # Check recommended quote
    top_quote = comp["comparison"][0]
    assert "Royal Mewar" in top_quote["vendor_name"]
    assert top_quote["price_per_plate"] == 2800.0

def test_budget_simulation_extra_guests():
    wedding_id = "wedding-jaipur-demo-400"
    response = client.post(f"/api/budgets/wedding/{wedding_id}/simulate-extra-guests", json={
        "additional_guests": 60,
        "catering_price_per_plate": 2800.0
    })
    assert response.status_code == 200
    sim = response.json()
    assert sim["additional_guests"] == 60
    assert sim["current_guest_count"] == 400
    assert sim["projected_guest_count"] == 460
    assert sim["requires_authorization"] is True
    assert sim["cost_breakdown"]["total_estimated_impact"] > 200000

def test_live_command_centre_delay_simulation():
    # Login as planner
    login_res = client.post("/api/auth/login", json={
        "email": "planner@theroyalknot.com",
        "password": "password123"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    wedding_id = "wedding-jaipur-demo-400"
    response = client.post(
        f"/api/operations/wedding/{wedding_id}/simulate-vendor-delay",
        json={
            "delay_minutes": 30,
            "vendor_name": "Royal Mewar Caterers",
            "reason": "Traffic congestion on Delhi-Jaipur highway"
        },
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["vendor_delayed"] == "Royal Mewar Caterers"
    assert data["delay_recorded_minutes"] == 30
    assert len(data["dependent_downstream_events"]) > 0
    assert data["requires_authorization"] is True

def test_ai_copilot_grounded_queries():
    wedding_id = "wedding-jaipur-demo-400"
    # Query 1: late vendors
    res1 = client.post("/api/ai/query", json={
        "wedding_id": wedding_id,
        "query": "Which vendors are delayed or have not arrived?"
    })
    assert res1.status_code == 200
    ans1 = res1.json()["answer"]
    assert "Royal Mewar" in ans1 or "delay" in ans1.lower()

    # Query 2: extra 60 guests
    res2 = client.post("/api/ai/query", json={
        "wedding_id": wedding_id,
        "query": "What happens if 60 more guests attend?"
    })
    assert res2.status_code == 200
    assert "60 guests" in res2.json()["answer"]
