from decimal import Decimal
from typing import Optional

from sqlmodel import SQLModel, Field


class FraudRule(SQLModel, table=True):

    __tablename__ = "fraud_rules"

    rule_id: Optional[int] = Field(default=None, primary_key=True)

    rule_name: str

    threshold_value: Decimal

    description: str