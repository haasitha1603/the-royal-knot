from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.models import Wedding
from backend.app.schemas.schemas import AIQueryRequest, AIQueryResponse
from backend.app.services.ai_service import AIService

from backend.app.config import settings
from backend.app.services.rate_limiter import rate_limit_user

router = APIRouter(prefix="/ai", tags=["AI Wedding Copilot"])

@router.post(
    "/query",
    response_model=AIQueryResponse,
    dependencies=[Depends(rate_limit_user(
        settings.RATE_LIMIT_AI_USER_MAX,
        settings.RATE_LIMIT_AI_USER_WINDOW,
        "ai_requests_limit"
    ))]
)
def query_copilot(
    payload: AIQueryRequest,
    db: Session = Depends(get_db)
):
    """
    Genuine context-aware AI Wedding Concierge:
    Grounded in the real wedding celebration data from the database.
    Integrates with Google Gemini LLM when configured, with seamless
    deterministic reasoning engine fallback.
    """
    wedding = db.query(Wedding).filter(Wedding.id == payload.wedding_id).first()
    if not wedding:
        raise HTTPException(status_code=404, detail="Wedding celebration not found")

    result = AIService.answer_query(wedding, payload.query, db)

    return AIQueryResponse(
        query=result.get("query", payload.query),
        answer=result.get("answer", "I am monitoring your celebration."),
        data_points=result.get("data_points", {}),
        confidence=result.get("confidence", 0.98),
        action=result.get("action")
    )
