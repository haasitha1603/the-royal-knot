import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "The Royal Knot"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"
    
    # Security
    SECRET_KEY: str = "the_royal_knot_luxury_wedding_secret_key_2026_super_secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./royal_knot.db")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Brand & Business Information
    PLATFORM_NAME: str = "The Royal Knot"
    PLATFORM_EMAIL: str = "concierge@theroyalknot.com"
    PLATFORM_PHONE: str = "+91 141 289 9000"
    SUPPORT_HOURS: str = "9:00 AM - 8:00 PM IST (Mon - Sat)"
    REGISTERED_OFFICE: str = "Palace Road, C-Scheme, Jaipur, Rajasthan 302001, India"

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
