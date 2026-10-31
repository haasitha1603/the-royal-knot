# Security & Compliance Model — The Royal Knot

Security, access control, and regulatory compliance are built directly into the FastAPI backend dependencies, data layers, and database transaction lifecycles.

---

## 1. Authentication & Session Security

- **JWT Tokens:** Uses HMAC-SHA256 (`HS256`) tokens with configurable expiration (`ACCESS_TOKEN_EXPIRE_MINUTES`).
- **Bcrypt Password Hashing:** Passwords are salted and hashed via Passlib/Bcrypt prior to persistence.
- **Header Enforcement:** All secured routes require standard `Authorization: Bearer <token>` headers. Missing or expired tokens immediately trigger `401 Unauthorized`.

---

## 2. Insecure Direct Object Reference (IDOR) Protection

In legacy implementations, client-supplied IDs (such as `wedding_id` or `vendor_id`) were trusted without verifying ownership. The Royal Knot enforces strict authorization dependencies:

```python
# backend/app/dependencies.py
def verify_wedding_access(wedding_id: str, current_user: User, db: Session) -> Wedding:
    # 1. Platform Admin has universal administrative visibility
    # 2. Demo weddings are accessible for evaluators
    # 3. Couples may ONLY access weddings where wedding.owner_id == current_user.id
    # 4. Planners may ONLY access weddings where wedding.planner_id == current_user.id
    # All unauthorized access attempts trigger 403 Forbidden
```

### Route-Level Enforcement:
- `/api/weddings/{wedding_id}`: Requires `verify_wedding_access` (read) or `verify_wedding_owner` (mutation).
- `/api/budgets/wedding/{wedding_id}/*`: Requires `verify_wedding_access` on overview/simulations, and `verify_wedding_planner_or_admin` on approvals and rejections.
- `/api/quotations/{quotation_id}/accept`: Restricts acceptance to authorized celebration parties and enforces double-booking checks.
- `/api/payments/{payment_id}/simulate-settlement`: Enforces wedding ownership and prevents duplicate milestone settlements.

---

## 3. Commercial Double-Booking Prevention

To eliminate catastrophic booking overlaps where an exclusive vendor is contracted twice on the same day:
1. When `POST /api/quotations/{id}/accept` is invoked, the database joins `Quotation` and `Wedding` to search for existing accepted contracts for the vendor on the target `wedding_date`.
2. If an active contract exists on that date for a different wedding celebration, the request is aborted with `409 Conflict: Vendor is already exclusively contracted on this date`.

---

## 4. Staged Milestone Escrow & Duplicate Settlement Guard

Simulated payment settlements enforce state protection:
1. If `PaymentRecord.status == "completed"`, subsequent attempts to settle return `400 Bad Request` with the existing transaction reference.
2. The transaction reference is recorded, actual expenditures in `BudgetCategory` are updated, and an immutable entry is saved in `AuditLog`.

---

## 5. Immutable Audit Trail

Critical platform mutations are written to the `AuditLog` table using `AuditService.log_event`:
- `WEDDING_CREATED` / `WEDDING_UPDATED`
- `BUDGET_CHANGE_REQUESTED` / `BUDGET_CHANGE_APPROVED` / `BUDGET_CHANGE_REJECTED`
- `QUOTATION_ACCEPTED`
- `SIMULATED_PAYMENT_SETTLED`
- `SCHEDULE_DELAY_SIMULATED` / `SCHEDULE_REVISION_PUBLISHED`
- `GUEST_SEATED` / `GUEST_UNSEATED`
- `VENDOR_VERIFICATION_STATUS_CHANGED`
- `PRIVACY_REQUEST_PROCESSED`

Audit logs can be reviewed by platform administrators at `GET /api/admin/audit-logs`.
