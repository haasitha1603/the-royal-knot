# The Royal Knot
### Premium Indian Wedding Planning, Marketplace & Operations Management Platform

> **“Every detail connected. Every moment managed. Every wedding unforgettable.”**

---

## 1. Overview & Vision

**The Royal Knot** is a cohesive, production-minded digital wedding agency, curated marketplace, and real-time operations command platform built specifically for Indian and international destination weddings.

It bridges the gap between romantic grandeur and operational execution:
1. **Premium Digital Wedding Agency:** Auspicious muhurat timing, multi-function ceremony planning (Haldi, Mehendi, Sangeet, Vedic Pheras, Grand Reception), and tradition-informed workflows.
2. **Curated Indian Wedding Marketplace:** Verified heritage palaces in Rajasthan and coastal retreats, plus accredited catering, decor, cinema, and planning professionals.
3. **Intelligent Quotation Comparison:** Rigorous multi-vendor evaluation comparing per-plate cost, live counter counts, tableware tiers (fine bone china vs. melamine), waitstaff ratios, and hidden surcharges.
4. **Dynamic Budget Guardian:** Real-time expense modeling with automated calculation of +60 extra guest impacts requiring authorized sign-off.
5. **Live Wedding Operations Command Centre:** Minute-by-minute run of show, delay simulation, cascade alerts, coordinator notifications, and published revisions.

---

## 2. Branding & Design System

The application strictly implements the required luxury Indian wedding design tokens:
- **Primary Backgrounds:** White (`#FFFFFF`) and Ivory (`#FAF7F2`, `#FDFBF7`, `#F5EFEB`).
- **Highlights & Accents:** Champagne and Metallic Gold (`#D4AF37`, `#C5A059`, `#E5C378`, `#B38F30`).
- **Important Actions & CTAs:** Deep Burgundy and Traditional Wedding Red (`#800020`, `#9B111E`, `#67001A`).
- **Readable Typography:** Charcoal and warm dark grey (`#2C2A29`, `#3D3A38`).
- **Display Typography:** Cormorant Garamond & Playfair Display serif fonts; clean Outfit sans-serif for dashboard forms and tables.
- **Zero Dark Dashboards:** Consistent ivory-and-gold luxury across all public and authenticated portals.

### Signature Wedding Loading Experience
Instead of generic spinners, The Royal Knot features a custom-crafted loader with **four solid, filled wedding silhouettes**:
1. Indian Choker Haar (Wedding Necklace) — Metallic Gold
2. Ceremonial Wedding Bells — Champagne
3. Solitaire Diamond Band (Wedding Ring) — Deep Burgundy
4. Traditional Bridal Kalire (Umbrella Silhouette with Dangling Droplets) — Wedding Red
*Animated with a gentle, staggered sequential bounce respecting `prefers-reduced-motion`.*

### Ceremonial Curtain Entrance
On first visit, visitors encounter a full-screen white fabric-curtain experience with delicate gold borders that smoothly opens from the center, revealing the platform. State is saved in `localStorage`, and visitors can reopen the curtain anytime from the homepage.

---

## 3. Technology Stack

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + PostCSS + Autoprefixer
- **Icons:** Lucide React
- **Maps:** Leaflet & React Leaflet (OpenStreetMap tile provider)
- **Animation & Confetti:** Canvas Confetti, custom CSS keyframe staggered motion
- **State & Context:** React Router DOM v6, AuthContext with fast demo role switching

### Backend
- **Framework:** Python FastAPI
- **Database ORM:** SQLAlchemy 2.0 (Dual-mode: SQLite zero-config local development, PostgreSQL ready)
- **Validation:** Pydantic v2 schemas
- **Authentication:** JWT (HMAC-SHA256) + Passlib / Bcrypt password hashing
- **Testing:** Pytest + FastAPI TestClient

---

## 4. Setup & Running Instructions

### Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Node.js 18+ (Tested on Node.js v24.19 / npm 11.17)

### 1. Backend Setup
```bash
# From repository root:
cd backend

# Install Python requirements
pip install -r requirements.txt

# Run the FastAPI server (seeds database automatically on startup)
python -m uvicorn backend.app.main:app --reload --port 8000
```
- API Base URL: `http://localhost:8000`
- Interactive Swagger Documentation: `http://localhost:8000/docs`
- Health Endpoint: `http://localhost:8000/api/health`

### 2. Frontend Setup
```bash
# In a separate terminal, navigate to frontend:
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev
```
- Web Application URL: `http://localhost:5173`

### 3. Running Backend Tests
```bash
# From repository root:
python -m pytest backend/tests/test_api.py -v
```

---

## 5. Demonstration Credentials & Persona Switcher

The top header bar includes a **"Role: Demo Selector"** button allowing immediate switching between all 4 personas without manually typing passwords:

| Role | Name | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Couple** | Aarav Singhania & Meera Kapoor | `couple@theroyalknot.com` | `password123` | Budget Guardian, Catering Comparison, Payments, Digital Contract Signing |
| **Planner** | Ananya Sharma | `planner@theroyalknot.com` | `password123` | Task Matrix, Incident Logs, Budget Change Request Authorizations |
| **Vendor** | Vikramaditya Rathore (Royal Mewar) | `vendor@theroyalknot.com` | `password123` | Verification Status, Service Packages, Line-Item Quotation Dispatches |
| **Admin** | Maharaj Digvijay | `admin@theroyalknot.com` | `password123` | Platform Analytics, Vendor Verification Queue (Approve/Reject), DPDP Compliance |

---

## 6. Demonstration Scenario Walkthrough (Jaipur 400-Guest Wedding)

1. **Curtain Entrance:** Open `http://localhost:5173`. Click *"Partake in the Celebration"* to reveal the luxury portal.
2. **Palace Venue Discovery:** Navigate to **Palace Venues**. View OpenStreetMap markers for Rambagh Palace and book a consultation using the **SlotPicker**.
3. **Catering Quotation Comparison:** Navigate to **Couple Portal** (`/dashboard`). Under *"Intelligent Catering Quotation Comparison"*, compare:
   - *Royal Mewar Caterers* (₹2,800/plate, 18 live counters, bone china, recommended)
   - *Rajputana Heritage Feast* (₹3,200/plate, silver thalis)
   - *Shekhawati Gourmet Kitchens* (₹2,400/plate, melamine tableware)
   Click *"Accept Quotation"* to bind the agreement.
4. **Extra 60 Guests Simulation (+₹2,47,800 impact):**
   - In the Couple Dashboard *"Guest Impact Simulator"*, enter `60` guests.
   - Click *"Simulate Cost Impact"* to view live breakdown (Catering + 18% GST + Seating).
   - Click *"Create Formal Change Request"*. Notice that budget changes cannot be applied silently per Section 5.9.
   - Switch to **Planner Console** (`/planner-portal`) or click *"Authorize & Apply Budget Escalation"* to approve the request, updating the budget to ₹52.48 Lakhs.
5. **Live Command Centre Delay Simulation:**
   - Navigate to **Command Centre** (`/command-centre`).
   - Click *"Simulate 30m Catering Delay"* on Royal Mewar Caterers.
   - Observe cascade buffer highlights across dependent events (Milni, Dinner Buffet, Coordinator Mitigation).
   - Click *"Authorize & Publish Revised Run of Show"* to formally distribute the updated schedule.
6. **Grounded AI Wedding Copilot:**
   - In the Command Centre right-hand pane, click quick prompts: *"Which vendors are delayed?"* or *"What happens if 60 more guests attend?"*
   - Verify grounded responses retrieved from real database records.
7. **Staged Escrow Payment:**
   - In the Couple Dashboard, click *"Settle Escrow"* on the pending ₹4,50,000 floral milestone.
   - Authorize via Simulated UPI or RTGS. Confetti triggers and transaction `TXN-TRK-...` is recorded.
8. **Digital Contract Signing:**
   - Draw your signature on the **SignaturePad** canvas and click *"Confirm Signature"*.
9. **Vendor Verification Queue:**
   - Switch to **Admin Portal** (`/admin-portal`).
   - In the *"Vendor Verification & Compliance Queue"*, review *Shekhawati Gourmet Kitchens* and click *"Approve Vendor"* to grant verified status.

---

## 7. Security, Privacy & Transparency Charter

- **No Secrets in Source Control:** `.env` and `.env.*` are strictly excluded in `.gitignore`. A clean `.env.example` is provided.
- **No Stored Card Data:** The platform never stores or processes raw credit card numbers or CVV values.
- **GDPR / DPDP Compliance:** Full data deletion and export workflow under `/data-deletion`.
- **Zero Dark Patterns:** Transparent per-plate pricing, no fake scarcity timers, and honest disclosure of simulated escrow settlements.

---

## 8. License

Distributed under the MIT License. Copyright © 2026 The Royal Knot.
