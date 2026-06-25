from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel, Field


class AuditLog(SQLModel, table=True):

    __tablename__ = "audit_logs"

    log_id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int = Field(foreign_key="users.user_id")

    action_type: str

    action_details: str

    timestamp: datetime = Field(default_factory=datetime.utcnow)