"""
app/config/settings.py
─────────────────────────────────────────────
Purpose:
    Central configuration using Pydantic BaseSettings.
    All values are read from the .env file or environment variables.
    Import `settings` anywhere in the app to access config values.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── Database ──────────────────────────────────────────────────────────
    DATABASE_URL: str

    # ── JWT / Security ────────────────────────────────────────────────────
    SECRET_KEY: str = "changeme-use-a-strong-secret-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # ── ML Model ──────────────────────────────────────────────────────────
    # Set this to the ML teammate's endpoint URL once it is available.
    # Until then the fraud_detector module uses a local stub.
    ML_MODEL_URL: str = "http://localhost:8001/predict"
    ML_TIMEOUT_SECONDS: int = 10

    # ── App Meta ──────────────────────────────────────────────────────────
    APP_NAME: str = "FraudShield AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"          # ignore unknown env vars silently


# Singleton instance – import this everywhere
settings = Settings()
