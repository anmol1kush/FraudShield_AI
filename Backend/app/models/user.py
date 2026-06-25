from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel, Field  


class User(SQLModel, table=True):

    __tablename__ = "users"

    user_id: Optional[int] = Field(default=None, primary_key=True)

    full_name: str

    email: str = Field(unique=True, index=True)

    phone_number: str = Field(unique=True, index=True)

    password_hash: str

    role: str

    created_at: datetime = Field(default_factory=datetime.utcnow)