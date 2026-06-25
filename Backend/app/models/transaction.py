from datetime import datetime
from decimal import Decimal
from typing import Optional

from sqlmodel import SQLModel, Field


class Transaction(SQLModel, table=True):

    __tablename__ = "transactions"

    transaction_id: Optional[int] = Field(default=None, primary_key=True)

    sender_account_id: int = Field(foreign_key="accounts.account_id")

    receiver_account_id: int = Field(foreign_key="accounts.account_id")

    receiver_account_number: str

    receiver_name: str

    amount: Decimal

    transaction_time: datetime = Field(default_factory=datetime.utcnow)

    anomaly_score: float = Field(default=0)

    risk_level: str = Field(default="LOW")

    status: str = Field(default="SUCCESS")