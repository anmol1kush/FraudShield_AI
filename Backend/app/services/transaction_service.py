"""
app/services/transaction_service.py
─────────────────────────────────────────────
Purpose:
    The core business logic for money transfers.

    Full Transfer Pipeline:
    ┌─────────────────────────────────────────────────────────────────┐
    │  1. Verify JWT (done by dependency before entering service)     │
    │  2. Get sender's account                                        │
    │  3. Find receiver account by account_number                     │
    │  4. Validate receiver exists                                    │
    │  5. Verify receiver name matches DB record                      │
    │  6. Check sender is not transferring to themselves              │
    │  7. Verify sender has sufficient balance                        │
    │  8. Deduct amount from sender                                   │
    │  9. Add amount to receiver                                      │
    │ 10. Create Transaction record (status=SUCCESS initially)        │
    │ 11. Call ML model asynchronously                                │
    │ 12. Update transaction with anomaly_score and risk_level        │
    │ 13. If HIGH risk → create Alert, update status=FLAGGED          │
    │ 14. Commit everything atomically                                │
    └─────────────────────────────────────────────────────────────────┘
"""

from decimal import Decimal

from sqlmodel import Session

from app.ml.fraud_detector import call_fraud_model
from app.models.account import Account
from app.models.enums import RiskLevel, TransactionStatus
from app.models.transaction import Transaction
from app.models.user import User
from app.repositories import account_repo, transaction_repo
from app.schemas.transaction import TransferRequest
from app.services import alert_service
from app.utils.exceptions import (
    AccountNotFoundError,
    SelfTransferError,
    ReceiverNameMismatchError,
    InsufficientBalanceError,
    RapidFireFraudError,
)


async def transfer_money(
    session: Session,
    sender_user: User,
    data: TransferRequest,
) -> dict:
    """
    Execute a money transfer from the authenticated user to a receiver.

    Args:
        session: DB session.
        sender_user: The authenticated User ORM object (from JWT).
        data: Validated TransferRequest payload.

    Returns:
        Dict with transaction details and fraud assessment.

    Raises:
        AccountNotFoundError: Sender or receiver account not found.
        SelfTransferError: Sender tries to pay themselves.
        ReceiverNameMismatchError: Name provided doesn't match account holder.
        InsufficientBalanceError: Sender balance < amount.
        RapidFireFraudError: More than 3 transactions from the same account in 60s.
    """
    # ── Step 1: Get sender account ─────────────────────────────────────────
    sender_account = account_repo.get_account_by_user_id(
        session, sender_user.user_id
    )
    if sender_account is None:
        raise AccountNotFoundError("Sender account not found")

    # ── Step 2: Find receiver account ─────────────────────────────────────
    receiver_account = account_repo.get_account_by_number(
        session, data.receiver_account_number
    )
    if receiver_account is None:
        raise AccountNotFoundError(data.receiver_account_number)

    # ── Step 3: Self-transfer guard ────────────────────────────────────────
    if sender_account.account_id == receiver_account.account_id:
        raise SelfTransferError()

    # ── Step 4: Verify receiver name ──────────────────────────────────────
    # Look up receiver's user record to compare name
    from app.repositories import user_repo
    receiver_user = user_repo.get_user_by_id(session, receiver_account.user_id)

    if receiver_user is None:
        raise AccountNotFoundError(data.receiver_account_number)

    # Case-insensitive name comparison (strip whitespace)
    if data.receiver_name.strip().lower() != receiver_user.full_name.strip().lower():
        raise ReceiverNameMismatchError()

    # ── Step 5: Balance check ─────────────────────────────────────────────
    if sender_account.balance < data.amount:
        raise InsufficientBalanceError(
            balance=float(sender_account.balance),
            amount=float(data.amount),
        )

    # ── Step 5b: Rapid-fire fraud rule ────────────────────────────────────
    # Rule: if this sender account has already made >3 transactions in the
    # last 60 seconds, block immediately without calling the ML model.
    RAPID_FIRE_LIMIT = 2
    RAPID_FIRE_WINDOW = 60  # seconds
    recent_count = transaction_repo.count_recent_sender_transactions(
        session,
        sender_account_id=sender_account.account_id,
        within_seconds=RAPID_FIRE_WINDOW,
    )
    if recent_count >= RAPID_FIRE_LIMIT:
        import logging
        logging.getLogger(__name__).warning(
            "[RAPID-FIRE FRAUD BLOCKED] account=%s made %d transactions in last %ds (limit=%d)",
            sender_account.account_number,
            recent_count,
            RAPID_FIRE_WINDOW,
            RAPID_FIRE_LIMIT,
        )
        raise RapidFireFraudError(
            count=recent_count,
            window_seconds=RAPID_FIRE_WINDOW,
            limit=RAPID_FIRE_LIMIT,
        )

    # ── Step 6: Deduct from sender, add to receiver ───────────────────────
    sender_account.balance = Decimal(str(sender_account.balance)) - data.amount
    receiver_account.balance = Decimal(str(receiver_account.balance)) + data.amount

    account_repo.update_account(session, sender_account)
    account_repo.update_account(session, receiver_account)

    # ── Step 7: Create transaction record ────────────────────────────────
    transaction = Transaction(
        sender_account_id=sender_account.account_id,
        receiver_account_id=receiver_account.account_id,
        receiver_account_number=data.receiver_account_number,
        receiver_name=data.receiver_name,
        amount=data.amount,
        status=TransactionStatus.SUCCESS,
    )
    transaction = transaction_repo.create_transaction(session, transaction)

    # ── Step 8: Call ML Model ─────────────────────────────────────────────
    ml_result = await call_fraud_model(
        amount=data.amount,
        sender_account_number=sender_account.account_number,
        receiver_account_number=receiver_account.account_number,
        transaction_time=transaction.transaction_time,
    )

    # ── Step 9: Update transaction with ML results ────────────────────────
    transaction.anomaly_score = ml_result.anomaly_score
    transaction.risk_level = ml_result.risk_level

    alert_created = False

    if ml_result.risk_level == RiskLevel.HIGH:
        transaction.status = TransactionStatus.FLAGGED
        alert_service.create_fraud_alert(session, transaction)
        alert_created = True

    transaction_repo.update_transaction(session, transaction)

    return {
        "transaction_id": transaction.transaction_id,
        "sender_account_number": sender_account.account_number,
        "receiver_account_number": data.receiver_account_number,
        "receiver_name": data.receiver_name,
        "amount": str(data.amount),
        "transaction_time": transaction.transaction_time.isoformat(),
        "anomaly_score": ml_result.anomaly_score,
        "risk_level": ml_result.risk_level.value,
        "status": transaction.status.value,
        "alert_generated": alert_created,
        "message": (
            "⚠️ Transaction flagged as HIGH RISK. An alert has been generated."
            if alert_created
            else "✅ Transaction completed successfully."
        ),
    }


def get_my_transactions(
    session: Session,
    account_id: int,
    skip: int = 0,
    limit: int = 50,
) -> tuple[list[Transaction], int]:
    """Fetch paginated transactions for the authenticated user's account."""
    return transaction_repo.get_transactions_by_account(
        session, account_id=account_id, skip=skip, limit=limit
    )


def get_all_transactions(
    session: Session,
    skip: int = 0,
    limit: int = 50,
) -> tuple[list[Transaction], int]:
    """Admin: all transactions across the system."""
    return transaction_repo.get_all_transactions(session, skip=skip, limit=limit)
