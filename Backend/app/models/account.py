from decimal import Decimal
from typing import Optional

from sqlmodel import SQLModel, Field


class Account(SQLModel, table=True):

    __tablename__ = "accounts"

    account_id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int = Field(foreign_key="users.user_id")

    account_number: str = Field(unique=True, index=True)

    account_type: str

    balance: Decimal = Field(default=0)