from fastapi import FastAPI
from sqlmodel import SQLModel

from app.database import engine

# Import all models
from app.models.user import User
from app.models.account import Account
from app.models.transaction import Transaction
from app.models.fraud_rule import FraudRule
from app.models.alert import Alert
from app.models.audit_log import AuditLog

app = FastAPI()


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


@app.get("/")
def home():
    return {"message": "FraudShield AI Backend Running"}