"""
app/schemas/audit_log.py
─────────────────────────────────────────────
Purpose:
    Pydantic schemas for AuditLog API I/O.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.enums import AuditActionType


# ── Response Schemas ──────────────────────────────────────────────────────

class AuditLogResponse(BaseModel):
    log_id: int
    user_id: int
    action_type: AuditActionType
    action_details: str
    timestamp: datetime
    ip_address: Optional[str]

    model_config = {"from_attributes": True}


class AuditLogListResponse(BaseModel):
    logs: list[AuditLogResponse]
    total: int
