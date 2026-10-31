from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.app.config import settings
from backend.app.database import engine, Base
from backend.app.seed import seed_database
from backend.app.routers import (
    auth, weddings, venues, vendors, quotations,
    budgets, payments, guests, operations, ai_copilot, admin
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create DB tables & Seed demo data on startup
    Base.metadata.create_all(bind=engine)
    try:
        seed_database()
    except Exception as e:
        print(f"Startup seed notice: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="The Royal Knot — Premium Indian Wedding Planning, Marketplace & Operations Management Platform API",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under API Prefix
api_prefix = settings.API_V1_PREFIX
app.include_router(auth.router, prefix=api_prefix)
app.include_router(weddings.router, prefix=api_prefix)
app.include_router(venues.router, prefix=api_prefix)
app.include_router(vendors.router, prefix=api_prefix)
app.include_router(quotations.router, prefix=api_prefix)
app.include_router(budgets.router, prefix=api_prefix)
app.include_router(payments.router, prefix=api_prefix)
app.include_router(guests.router, prefix=api_prefix)
app.include_router(operations.router, prefix=api_prefix)
app.include_router(ai_copilot.router, prefix=api_prefix)
app.include_router(admin.router, prefix=api_prefix)

@app.get("/")
def root():
    return {
        "platform": settings.PLATFORM_NAME,
        "tagline": "Every detail connected. Every moment managed. Every wedding unforgettable.",
        "version": settings.VERSION,
        "status": "operational",
        "documentation": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "database": "connected"
    }
