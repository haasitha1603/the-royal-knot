import json
import os
from typing import List, Optional

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
    
    # AI Copilot Engine
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000,http://localhost:4173"

    def get_cors_origins(self) -> List[str]:
        value = self.CORS_ORIGINS
        if isinstance(value, list):
            return value
        if not value:
            return []
        stripped = value.strip()
        if stripped.startswith("[") and stripped.endswith("]"):
            try:
                parsed = json.loads(stripped)
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                pass
        return [item.strip() for item in stripped.split(",") if item.strip()]
    
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
