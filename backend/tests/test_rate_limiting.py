import pytest
import time
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.rate_limiter import limiter
from backend.app.config import settings

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_rate_limiter():
    """Reset the rate limiter state before and after each test."""
    limiter.clear_all()
    yield
    limiter.clear_all()


def test_sliding_window_unit_limits():
    """Unit test for rate limiter sliding window calculation and retry_after."""
    test_key = "unit_test_sliding_window"
    limit = 3
    window = 5

    # First 3 attempts should be allowed
    assert limiter.is_allowed(test_key, limit=limit, window_seconds=window)[0] is True
    assert limiter.is_allowed(test_key, limit=limit, window_seconds=window)[0] is True
    assert limiter.is_allowed(test_key, limit=limit, window_seconds=window)[0] is True

    # 4th attempt exceeds limit
    allowed, retry_after = limiter.is_allowed(test_key, limit=limit, window_seconds=window)
    assert allowed is False
    assert 1 <= retry_after <= 5


def test_ip_login_rate_limiting():
    """
    Verify IP-level rate limiting on login endpoint:
    Excessive requests from the same IP trigger HTTP 429 with Retry-After header.
    """
    test_ip = "198.51.100.42"
    headers = {"X-Forwarded-For": test_ip}
    
    # Send up to IP limit (settings.RATE_LIMIT_LOGIN_IP_MAX = 30)
    for i in range(settings.RATE_LIMIT_LOGIN_IP_MAX):
        res = client.post(
            "/api/auth/login",
            json={"email": f"nonexistent_{i}@theroyalknot.com", "password": "wrongpassword"},
            headers=headers
        )
        assert res.status_code == 401

    # Next request must be rejected with 429 Too Many Requests
    blocked_res = client.post(
        "/api/auth/login",
        json={"email": "couple@theroyalknot.com", "password": "password123"},
        headers=headers
    )
    assert blocked_res.status_code == 429
    assert "Retry-After" in blocked_res.headers
    data = blocked_res.json()
    assert data["detail"]["policy"] == "ip_login_limit"
    assert data["detail"]["error"] == "Too Many Requests"


def test_account_failed_login_rate_limiting():
    """
    Verify account-level failed login rate limiting:
    5 failed login attempts lock out the targeted account with HTTP 429.
    Legitimate requests from distinct IPs targeting that account are blocked,
    preventing distributed credential brute-force.
    """
    target_email = "target_account@theroyalknot.com"

    # Make 5 failed attempts from varying IPs
    for i in range(settings.RATE_LIMIT_LOGIN_ACCOUNT_MAX):
        ip = f"10.0.1.{i + 1}"
        res = client.post(
            "/api/auth/login",
            json={"email": target_email, "password": "wrongpassword"},
            headers={"X-Forwarded-For": ip}
        )
        assert res.status_code == 401

    # 6th attempt from yet another IP targeting the same account should trigger 429
    blocked_res = client.post(
        "/api/auth/login",
        json={"email": target_email, "password": "any_password"},
        headers={"X-Forwarded-For": "10.0.1.99"}
    )
    assert blocked_res.status_code == 429
    assert "Retry-After" in blocked_res.headers
    data = blocked_res.json()
    assert data["detail"]["policy"] == "account_failed_attempts"
    assert data["detail"]["error"] == "Too Many Requests"


def test_pre_auth_execution_prevents_db_and_hash_computation():
    """
    Verify pre-auth efficiency:
    Once an account or IP is rate-limited, requests are rejected BEFORE
    database querying or CPU-heavy password hash verification.
    """
    target_email = "preauth_test@theroyalknot.com"
    ip = "192.0.2.77"

    # Burn 5 attempts
    for _ in range(settings.RATE_LIMIT_LOGIN_ACCOUNT_MAX):
        client.post(
            "/api/auth/login",
            json={"email": target_email, "password": "bad"},
            headers={"X-Forwarded-For": ip}
        )

    # Fast rejection test: even if provided with correct password format
    t0 = time.time()
    res = client.post(
        "/api/auth/login",
        json={"email": target_email, "password": "password123"},
        headers={"X-Forwarded-For": ip}
    )
    latency_ms = (time.time() - t0) * 1000
    assert res.status_code == 429
    # Pre-auth rejection happens instantly in memory without running bcrypt (~80-150ms)
    assert latency_ms < 60


def test_successful_login_clears_account_failed_counter():
    """
    Verify that a successful login resets the account failure counter.
    """
    target_email = "couple@theroyalknot.com"
    ip = "192.0.2.88"

    # 3 failed attempts (less than max 5)
    for _ in range(3):
        res = client.post(
            "/api/auth/login",
            json={"email": target_email, "password": "badpassword"},
            headers={"X-Forwarded-For": ip}
        )
        assert res.status_code == 401

    # 4th attempt is successful
    success_res = client.post(
        "/api/auth/login",
        json={"email": target_email, "password": "password123"},
        headers={"X-Forwarded-For": ip}
    )
    assert success_res.status_code == 200

    # Counter should be cleared: another failed attempt should be 401, not 429
    next_fail = client.post(
        "/api/auth/login",
        json={"email": target_email, "password": "badpassword2"},
        headers={"X-Forwarded-For": ip}
    )
    assert next_fail.status_code == 401


def test_registration_rate_limiting():
    """
    Verify that user registration is rate-limited per IP (5 requests per 10 minutes).
    """
    ip = "203.0.113.88"
    headers = {"X-Forwarded-For": ip}

    # Attempt registrations up to limit
    for i in range(settings.RATE_LIMIT_REGISTER_IP_MAX):
        res = client.post(
            "/api/auth/register",
            json={
                "email": f"test_reg_{i}_{time.time()}@test.com",
                "password": "ValidPassword123!",
                "full_name": f"User {i}",
                "role": "couple"
            },
            headers=headers
        )
        assert res.status_code in [200, 400]

    # Exceeded registration
    blocked = client.post(
        "/api/auth/register",
        json={
            "email": "blocked_reg@test.com",
            "password": "ValidPassword123!",
            "full_name": "Blocked User",
            "role": "couple"
        },
        headers=headers
    )
    assert blocked.status_code == 429
    assert blocked.json()["detail"]["policy"] == "register_ip_limit"


def test_ai_copilot_rate_limiting():
    """
    Verify that AI Concierge endpoint (/api/ai/query) enforces user-level rate limiting
    (10 requests per user per minute).
    """
    # 1. Login to get token
    login_res = client.post(
        "/api/auth/login",
        json={"email": "couple@theroyalknot.com", "password": "password123"}
    )
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    # 2. Make 10 AI queries
    for i in range(settings.RATE_LIMIT_AI_USER_MAX):
        res = client.post(
            "/api/ai/query",
            json={"wedding_id": "wedding-jaipur-demo-400", "query": f"Suggest catering options {i}"},
            headers=auth_headers
        )
        assert res.status_code == 200

    # 3. 11th AI query should be rate-limited with 429
    blocked = client.post(
        "/api/ai/query",
        json={"wedding_id": "wedding-jaipur-demo-400", "query": "One more query"},
        headers=auth_headers
    )
    assert blocked.status_code == 429
    assert blocked.json()["detail"]["policy"] == "ai_requests_limit"
    assert "Retry-After" in blocked.headers
