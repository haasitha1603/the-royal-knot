#!/usr/bin/env python3
"""
Seed script for generating 500 distinct load-test user accounts for The Royal Knot.

Features:
- Fast bulk seeding: Pre-hashes password once with bcrypt, completing 500 inserts in < 2 seconds.
- Role distribution:
    * 300 Couples (loadtest_couple_001@theroyalknot.com -> loadtest_couple_300@theroyalknot.com)
    * 100 Planners (loadtest_planner_301@theroyalknot.com -> loadtest_planner_400@theroyalknot.com)
    * 80 Vendors (loadtest_vendor_401@theroyalknot.com -> loadtest_vendor_480@theroyalknot.com)
    * 20 Admins (loadtest_admin_481@theroyalknot.com -> loadtest_admin_500@theroyalknot.com)
- Associated sample wedding and vendor profiles for realistic authenticated load testing.
- Teardown / cleanup flag (--clean) to wipe all load-test accounts safely without affecting demo/production data.
"""

import sys
import os
import argparse
import time
import uuid

import sys
import os
import argparse
import time
import uuid

# Reconfigure stdout/stderr for Windows console unicode safety
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from passlib.context import CryptContext
from sqlalchemy.orm import Session
from backend.app.database import SessionLocal, engine
from backend.app.models.models import User, Wedding, Vendor, WeddingFunction, BudgetCategory

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
TEST_PASSWORD = "TestUserPass2026!"
EMAIL_DOMAIN = "theroyalknot.com"
LOAD_TEST_TAG = "loadtest_"


def clean_load_users(db: Session):
    """Deletes all seeded load-test users and their associated records."""
    print("🧹 Cleaning existing load-test entities...")
    start = time.time()
    
    # 1. Find all load test user IDs
    users = db.query(User).filter(User.email.like(f"{LOAD_TEST_TAG}%@{EMAIL_DOMAIN}")).all()
    user_ids = [u.id for u in users]
    
    if not user_ids:
        print("  No load-test users found to clean.")
        return 0

    print(f"  Found {len(user_ids)} load-test users to remove.")
    
    # Clean associated vendors
    db.query(Vendor).filter(Vendor.user_id.in_(user_ids)).delete(synchronize_session=False)
    
    # Clean associated weddings (and cascade functions/budgets)
    weddings = db.query(Wedding).filter(Wedding.owner_id.in_(user_ids)).all()
    wedding_ids = [w.id for w in weddings]
    if wedding_ids:
        db.query(BudgetCategory).filter(BudgetCategory.wedding_id.in_(wedding_ids)).delete(synchronize_session=False)
        db.query(WeddingFunction).filter(WeddingFunction.wedding_id.in_(wedding_ids)).delete(synchronize_session=False)
        db.query(Wedding).filter(Wedding.id.in_(wedding_ids)).delete(synchronize_session=False)

    # Clean users
    deleted_count = db.query(User).filter(User.id.in_(user_ids)).delete(synchronize_session=False)
    db.commit()
    
    elapsed = time.time() - start
    print(f"✅ Cleaned {deleted_count} load-test users in {elapsed:.2f}s.")
    return deleted_count


def seed_load_users(db: Session, count: int = 500):
    """Generates and inserts 500 deterministic load-test user accounts."""
    print(f"🚀 Seeding {count} distinct load-test users with role distribution...")
    start_time = time.time()
    
    # Clean up any existing load test users first
    clean_load_users(db)
    
    print(f"🔑 Pre-computing bcrypt hash for test password '{TEST_PASSWORD}' (1 round)...")
    hash_start = time.time()
    shared_hash = pwd_context.hash(TEST_PASSWORD)
    print(f"  Hash computed in {time.time() - hash_start:.3f}s. Reusing hash across all {count} records.")

    # Distribution:
    # 1-300: Couples (60%)
    # 301-400: Planners (20%)
    # 401-480: Vendors (16%)
    # 481-500: Admins (4%)
    
    users = []
    weddings = []
    vendors = []

    for i in range(1, count + 1):
        uid = str(uuid.uuid4())
        
        if i <= 300:
            role = "couple"
            email = f"loadtest_couple_{i:03d}@{EMAIL_DOMAIN}"
            full_name = f"Couple User {i:03d}"
            
            # Create a sample wedding for every 5th couple to keep DB compact
            if i % 5 == 1:
                wed_id = str(uuid.uuid4())
                weddings.append(Wedding(
                    id=wed_id,
                    owner_id=uid,
                    couple_names=f"Couple {i:03d} & Partner",
                    partner1_name=f"Partner A {i:03d}",
                    partner2_name=f"Partner B {i:03d}",
                    wedding_date="2026-12-18",
                    destination_city="Jaipur",
                    destination_state="Rajasthan",
                    estimated_guests=350,
                    total_budget=4500000.0,
                    allocated_budget=4200000.0,
                    style="Royal Palace Heritage",
                    status="planning"
                ))
        elif i <= 400:
            role = "planner"
            email = f"loadtest_planner_{i:03d}@{EMAIL_DOMAIN}"
            full_name = f"Planner User {i:03d}"
        elif i <= 480:
            role = "vendor"
            email = f"loadtest_vendor_{i:03d}@{EMAIL_DOMAIN}"
            full_name = f"Vendor User {i:03d}"
            
            # Associate Vendor profile
            vendors.append(Vendor(
                id=str(uuid.uuid4()),
                user_id=uid,
                business_name=f"Royal Services {i:03d}",
                representative_name=full_name,
                category=["Caterers", "Decorators", "Photographers", "Planners", "Entertainment"][i % 5],
                city="Jaipur",
                state="Rajasthan",
                address=f"{i:03d} Heritage Road, Jaipur",
                description=f"Premium wedding service provider #{i:03d}",
                verified_status="approved",
                rating=4.8,
                review_count=15
            ))
        else:
            role = "admin"
            email = f"loadtest_admin_{i:03d}@{EMAIL_DOMAIN}"
            full_name = f"Admin User {i:03d}"

        users.append(User(
            id=uid,
            email=email,
            hashed_password=shared_hash,
            full_name=full_name,
            phone=f"+9198765{i:05d}",
            role=role,
            is_active=True
        ))

    # Bulk insert
    print(f"📦 Inserting {len(users)} users, {len(weddings)} weddings, {len(vendors)} vendors...")
    db.bulk_save_objects(users)
    if weddings:
        db.bulk_save_objects(weddings)
    if vendors:
        db.bulk_save_objects(vendors)
    db.commit()

    total_time = time.time() - start_time
    print(f"🎉 Successfully seeded {len(users)} load-test users in {total_time:.2f} seconds!")
    print(f"   Couples: 300 | Planners: 100 | Vendors: 80 | Admins: 20")
    print(f"   Credentials: Any loadtest_*@{EMAIL_DOMAIN} with password '{TEST_PASSWORD}'")
    return len(users)


def main():
    parser = argparse.ArgumentParser(description="Seed or clean load-test accounts for The Royal Knot.")
    parser.add_argument("--clean", action="store_true", help="Remove all load-test users from the database")
    parser.add_argument("--count", type=int, default=500, help="Number of load-test users to seed (default: 500)")
    args = parser.parse_args()

    db = SessionLocal()
    try:
        if args.clean:
            clean_load_users(db)
        else:
            seed_load_users(db, count=args.count)
    finally:
        db.close()


if __name__ == "__main__":
    main()
