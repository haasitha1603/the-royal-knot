from typing import Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from backend.app.models.models import AuditLog

class AuditService:
    @staticmethod
    def log_event(
        db: Session,
        action: str,
        entity_name: str,
        entity_id: str,
        user_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ) -> AuditLog:
        """
        Records an immutable audit trail entry for critical platform actions:
        - Budget change requests, approvals, and rejections.
        - Vendor verification status changes.
        - Contract acceptances and quotations.
        - Escrow and simulated milestone payouts.
        - Schedule publications and revisions.
        """
        audit = AuditLog(
            user_id=user_id,
            action=action,
            entity_name=entity_name,
            entity_id=entity_id,
            details_json=details or {},
            created_at=datetime.utcnow()
        )
        db.add(audit)
        # Flush to persist within current transaction without forcing commit
        db.flush()
        return audit
