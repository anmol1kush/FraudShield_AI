"""
app/schemas/transaction.py
─────────────────────────────────────────────
Purpose:
    Pydantic schemas for Transaction API I/O.
"""

from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, field_validator

from app.models.enums import RiskLevel, TransactionStatus


# ── Request Schemas ───────────────────────────────────────────────────────

class TransferRequest(BaseModel):
    """Body for POST /transactions/transfer"""
    receiver_account_number: str
    receiver_name: str
    amount: Decimal

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Transfer amount must be greater than zero")
        if v > Decimal("10000000"):  # 1 crore limit
            raise ValueError("Transfer amount exceeds maximum limit of ₹1,00,00,000")
        return v

    @field_validator("receiver_account_number")
    @classmethod
    def validate_account_number(cls, v: str) -> str:
        v = v.strip().upper()
        if not v.startswith("ACC"):
            raise ValueError("Invalid account number format. Must start with ACC")
        return v

    @field_validator("receiver_name")
    @classmethod
    def validate_receiver_name(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Receiver name must be at least 2 characters")
        return v


# ── Response Schemas ──────────────────────────────────────────────────────

class TransactionResponse(BaseModel):
    """Full transaction details."""
    transaction_id: int
    sender_account_id: int
    receiver_account_id: int
    receiver_account_number: str
    receiver_name: str
    amount: Decimal
    transaction_time: datetime
    anomaly_score: Optional[float]
    risk_level: RiskLevel
    status: TransactionStatus

    model_config = {"from_attributes": True}


class TransactionListResponse(BaseModel):
    """Paginated list of transactions."""
    transactions: list[TransactionResponse]
    total: int
