"""
app/ml/fraud_detector.py
─────────────────────────────────────────────
Purpose:
    Integration layer between the FraudShield backend and the XGBoost
    ML model deployed by the ML teammate.

    Architecture:
    ┌─────────────────┐    HTTP POST     ┌──────────────────────┐
    │  Backend        │ ───────────────► │  ML Model Server     │
    │  (this file)    │                  │  fraudshield-ai      │
    │                 │ ◄─────────────── │  on Render           │
    └─────────────────┘    JSON response └──────────────────────┘

    Request payload sent to ML model:
        {
            "sender_account": "ACC001",
            "receiver_account": "ACC002",
            "amount": 5000.00,
            "time": "2024-01-15T14:30:00"
        }

    Expected ML response:
        {
            "prediction": 1,
            "prediction_label": "Fraud",
            "fraud_probability": 0.94,
            "rule_score": 0.3,
            "triggered_rules": ["high_amount", "new_receiver"],
            "reasons": ["Amount exceeds threshold"],
            "risk_score": 0.87,
            "risk_level": "HIGH"
        }

    ── STUB MODE ────────────────────────────────────────────────────────────
    If the ML model server is not running (connection refused / timeout),
    `call_fraud_model` gracefully falls back to a LOCAL STUB that:
      - Returns anomaly_score = 0.10, risk_level = "LOW"  for amounts < 50,000
      - Returns anomaly_score = 0.75, risk_level = "MEDIUM" for 50k–1L
      - Returns anomaly_score = 0.95, risk_level = "HIGH" for amounts > 1L

    This allows backend development and testing to proceed independently
    of the ML model availability.
"""

import logging
from dataclasses import dataclass, field
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

import httpx

from app.config.settings import settings
from app.models.enums import RiskLevel

logger = logging.getLogger(__name__)


# ── ML Response Model ─────────────────────────────────────────────────────

@dataclass
class MLPrediction:
    """Structured response from the ML model."""
    anomaly_score: float          # mirrors fraud_probability (primary risk signal)
    risk_level: RiskLevel
    prediction: int = 0           # 0 = Legitimate, 1 = Fraud
    prediction_label: str = "Legitimate"
    fraud_probability: float = 0.0
    rule_score: float = 0.0
    risk_score: float = 0.0
    triggered_rules: List[str] = field(default_factory=list)
    reasons: List[str] = field(default_factory=list)


# ── Stub (Fallback) ───────────────────────────────────────────────────────

def _stub_prediction(amount: Decimal) -> MLPrediction:
    """
    Local rule-based fallback used when ML server is unreachable.
    Simulates the XGBoost model based on transaction amount thresholds.
    """
    amount_float = float(amount)

    if amount_float > 100_000:          # > ₹1 Lakh
        return MLPrediction(
            anomaly_score=0.95,
            risk_level=RiskLevel.HIGH,
            prediction=1,
            prediction_label="Fraud",
            fraud_probability=0.95,
            risk_score=0.95,
            reasons=["Amount exceeds ₹1,00,000 threshold (stub fallback)"],
        )
    elif amount_float > 50_000:         # ₹50k – ₹1L
        return MLPrediction(
            anomaly_score=0.75,
            risk_level=RiskLevel.MEDIUM,
            prediction=1,
            prediction_label="Suspicious",
            fraud_probability=0.75,
            risk_score=0.75,
            reasons=["Amount exceeds ₹50,000 threshold (stub fallback)"],
        )
    else:                               # < ₹50k
        return MLPrediction(
            anomaly_score=0.10,
            risk_level=RiskLevel.LOW,
            prediction=0,
            prediction_label="Legitimate",
            fraud_probability=0.10,
            risk_score=0.10,
        )


# ── Real ML Call ──────────────────────────────────────────────────────────

async def call_fraud_model(
    amount: Decimal,
    sender_account_number: str,
    receiver_account_number: str,
    transaction_time: Optional[datetime] = None,
) -> MLPrediction:
    """
    Call the deployed ML model's /predict endpoint and return a structured prediction.

    Args:
        amount: Transaction amount.
        sender_account_number: Account number string of the sender.
        receiver_account_number: Account number string of the receiver.
        transaction_time: When the transaction occurred (defaults to now).

    Returns:
        MLPrediction with full ML fields: anomaly_score, risk_level,
        prediction, fraud_probability, rule_score, risk_score,
        triggered_rules, reasons.

    Behaviour:
        - On success: returns the ML model's prediction.
        - On any network/timeout error: logs a warning and returns stub prediction.
        - On unexpected ML response format: logs error and returns stub prediction.
    """
    if transaction_time is None:
        transaction_time = datetime.utcnow()

    # Payload matching the deployed ML API schema
    # The ML API expects time as "HH:MM" (e.g. "10:10"), not a full ISO string
    payload = {
        "sender_account": sender_account_number,
        "receiver_account": receiver_account_number,
        "amount": float(amount),
        "time": transaction_time.strftime("%H:%M"),
    }

    try:
        async with httpx.AsyncClient(timeout=settings.ML_TIMEOUT_SECONDS) as client:
            response = await client.post(settings.ML_MODEL_URL, json=payload)
            response.raise_for_status()

            data = response.json()

            # Parse all response fields
            prediction = int(data.get("prediction", 0))
            prediction_label = str(data.get("prediction_label", "Legitimate"))
            fraud_probability = float(data.get("fraud_probability", 0.0))
            rule_score = float(data.get("rule_score", 0.0))
            risk_score = float(data.get("risk_score", fraud_probability))
            triggered_rules: List[str] = list(data.get("triggered_rules", []))
            reasons: List[str] = list(data.get("reasons", []))

            # Map risk_level string → RiskLevel enum
            risk_level_str = str(data.get("risk_level", "LOW")).upper()
            try:
                risk_level = RiskLevel(risk_level_str)
            except ValueError:
                logger.error(
                    "ML model returned unknown risk_level '%s'. Defaulting to LOW.",
                    risk_level_str,
                )
                risk_level = RiskLevel.LOW

            logger.info("[ML MODEL RESPONSE] Successfully got prediction from Render ML API!")
            logger.info("   Payload: sender=%s, receiver=%s, amount=%s", sender_account_number, receiver_account_number, amount)
            logger.info("   Result: prediction=%d (%s), fraud_probability=%.2f%%, risk_level=%s", prediction, prediction_label, fraud_probability, risk_level.value)

            logger.info(
                "ML prediction: prediction=%d (%s), fraud_probability=%.4f, "
                "risk_level=%s, risk_score=%.4f, triggered_rules=%s",
                prediction,
                prediction_label,
                fraud_probability,
                risk_level.value,
                risk_score,
                triggered_rules,
            )

            return MLPrediction(
                anomaly_score=fraud_probability,   # fraud_probability is the primary signal
                risk_level=risk_level,
                prediction=prediction,
                prediction_label=prediction_label,
                fraud_probability=fraud_probability,
                rule_score=rule_score,
                risk_score=risk_score,
                triggered_rules=triggered_rules,
                reasons=reasons,
            )

    except httpx.ConnectError:
        logger.warning(
            "ML model server unreachable at %s. Using stub prediction.",
            settings.ML_MODEL_URL,
        )
    except httpx.TimeoutException:
        logger.warning(
            "ML model request timed out after %ds. Using stub prediction.",
            settings.ML_TIMEOUT_SECONDS,
        )
    except httpx.HTTPStatusError as exc:
        logger.error(
            "ML model returned HTTP %d. Using stub prediction. Response: %s",
            exc.response.status_code,
            exc.response.text,
        )
    except Exception as exc:
        logger.error("Unexpected ML model error: %s. Using stub prediction.", exc)

    # Graceful fallback
    stub_pred = _stub_prediction(amount)
    logger.warning("[STUB FALLBACK RESPONSE] ML Model server failed or unreachable. Using local stub rules.")
    logger.warning("   Stub Result: anomaly_score=%.2f, risk_level=%s", stub_pred.anomaly_score, stub_pred.risk_level.value)
    return stub_pred
