from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel, Field


class Alert(SQLModel, table=True):

    __tablename__ = "alerts"

    alert_id: Optional[int] = Field(default=None, primary_key=True)

    transaction_id: int = Field(foreign_key="transactions.transaction_id")

    alert_type: str

    alert_message: str

    alert_time: datetime = Field(default_factory=datetime.utcnow)