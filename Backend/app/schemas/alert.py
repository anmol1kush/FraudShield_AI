"""
app/schemas/alert.py
─────────────────────────────────────────────
Purpose:
    Pydantic schemas for Alert API I/O.
"""

from datetime import datetime

from pydantic import BaseModel

from app.models.enums import AlertType


# ── Response Schemas ──────────────────────────────────────────────────────

class AlertResponse(BaseModel):
    alert_id: int
    transaction_id: int
    alert_type: AlertType
    alert_message: str
    alert_time: datetime
    is_resolved: bool

    model_config = {"from_attributes": True}


class AlertListResponse(BaseModel):
    alerts: list[AlertResponse]
    total: int
