"""
app/services/alert_service.py
─────────────────────────────────────────────
Purpose:
    Business logic for fraud alert creation and retrieval.
    Called by transaction_service when risk_level == HIGH.
"""

from sqlmodel import Session

from app.models.alert import Alert
from app.models.transaction import Transaction
from app.models.enums import AlertType, RiskLevel
from app.repositories import alert_repo
from app.utils.exceptions import NotFoundError


def create_fraud_alert(session: Session, transaction: Transaction) -> Alert:
    """
    Automatically create an alert for a HIGH risk transaction.

    Args:
        session: DB session.
        transaction: The flagged Transaction ORM object.

    Returns:
        The persisted Alert object.
    """
    alert_message = (
        f"HIGH risk transaction detected! "
        f"Transaction ID: {transaction.transaction_id} | "
        f"Amount: ₹{transaction.amount:.2f} | "
        f"Anomaly Score: {transaction.anomaly_score:.4f} | "
        f"Receiver Account: {transaction.receiver_account_number}"
    )

    alert = Alert(
        transaction_id=transaction.transaction_id,
        alert_type=AlertType.HIGH_RISK_TRANSACTION,
        alert_message=alert_message,
    )
    return alert_repo.create_alert(session, alert)


def get_user_alerts(
    session: Session,
    account_id: int,
    skip: int = 0,
    limit: int = 50,
) -> tuple[list[Alert], int]:
    """Fetch alerts for the authenticated user's account transactions."""
    return alert_repo.get_alerts_for_account_transactions(
        session, account_id=account_id, skip=skip, limit=limit
    )


def get_all_alerts(
    session: Session,
    skip: int = 0,
    limit: int = 50,
    unresolved_only: bool = False,
) -> tuple[list[Alert], int]:
    """Admin: all alerts with optional unresolved filter."""
    return alert_repo.get_all_alerts(
        session, skip=skip, limit=limit, unresolved_only=unresolved_only
    )


def resolve_alert(session: Session, alert_id: int) -> Alert:
    """
    Mark an alert as resolved (admin action).

    Raises:
        NotFoundError: If alert does not exist.
    """
    alert = alert_repo.resolve_alert(session, alert_id)
    if alert is None:
        raise NotFoundError(detail=f"Alert with ID {alert_id} not found")
    return alert
