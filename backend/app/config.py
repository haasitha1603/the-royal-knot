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
    
    # Database & Connection Pooling
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./royal_knot.db")
    DB_POOL_SIZE: int = int(os.getenv("DB_POOL_SIZE", "100"))
    DB_MAX_OVERFLOW: int = int(os.getenv("DB_MAX_OVERFLOW", "450"))
    DB_POOL_TIMEOUT: int = int(os.getenv("DB_POOL_TIMEOUT", "60"))

    # Redis & Distributed Rate Limiting
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    RATE_LIMIT_ENABLED: bool = os.getenv("RATE_LIMIT_ENABLED", "true").lower() in ("true", "1", "yes")
    RATE_LIMIT_LOGIN_ACCOUNT_MAX: int = int(os.getenv("RATE_LIMIT_LOGIN_ACCOUNT_MAX", "5"))
    RATE_LIMIT_LOGIN_ACCOUNT_WINDOW: int = int(os.getenv("RATE_LIMIT_LOGIN_ACCOUNT_WINDOW", "300"))  # 5 attempts per 5 mins
    RATE_LIMIT_LOGIN_IP_MAX: int = int(os.getenv("RATE_LIMIT_LOGIN_IP_MAX", "30"))
    RATE_LIMIT_LOGIN_IP_WINDOW: int = int(os.getenv("RATE_LIMIT_LOGIN_IP_WINDOW", "60"))  # 30 per min
    RATE_LIMIT_REGISTER_IP_MAX: int = int(os.getenv("RATE_LIMIT_REGISTER_IP_MAX", "5"))
    RATE_LIMIT_REGISTER_IP_WINDOW: int = int(os.getenv("RATE_LIMIT_REGISTER_IP_WINDOW", "600"))  # 5 per 10 mins
    RATE_LIMIT_AI_USER_MAX: int = int(os.getenv("RATE_LIMIT_AI_USER_MAX", "10"))
    RATE_LIMIT_AI_USER_WINDOW: int = int(os.getenv("RATE_LIMIT_AI_USER_WINDOW", "60"))  # 10 per min
    RATE_LIMIT_ADMIN_MAX: int = int(os.getenv("RATE_LIMIT_ADMIN_MAX", "60"))
    RATE_LIMIT_ADMIN_WINDOW: int = int(os.getenv("RATE_LIMIT_ADMIN_WINDOW", "60"))  # 60 per min

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
