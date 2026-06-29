"""
app/routers/transactions.py
─────────────────────────────────────────────
Endpoints:
    POST /transactions/transfer    — Initiate a money transfer (USER)
    GET  /transactions/            — My transaction history (USER)
    GET  /admin/transactions       — All transactions (ADMIN)
    GET  /admin/transactions/high-risk — High risk only (ADMIN)
"""

from fastapi import APIRouter, Depends, Query, status
from sqlmodel import Session

from app.core.dependencies import get_current_user, require_admin
from app.database import get_session
from app.models.user import User
from app.repositories import account_repo, transaction_repo
from app.schemas.transaction import (
    TransferRequest,
    TransactionListResponse,
)
from app.services import transaction_service, account_service
from app.utils.response import success_response

router = APIRouter(tags=["Transactions"])


@router.post(
    "/transactions/transfer",
    status_code=status.HTTP_201_CREATED,
    summary="Transfer money to another account",
    description=(
        "Initiates a money transfer. The backend will: "
        "verify the receiver, check balance, deduct/add amounts, "
        "call the ML fraud detection model, and generate an alert if HIGH risk."
    ),
)
async def transfer_money(
    body: TransferRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
     **Authenticated users only.**

    Request body:
    - `receiver_account_number`: e.g. ACC100002
    - `receiver_name`: Must match the account holder's name
    - `amount`: Positive decimal amount (max ₹1,00,00,000)
    """
    result = await transaction_service.transfer_money(session, current_user, body)
    return success_response(
        data=result,
        message=result.get("message", "Transfer processed"),
        status_code=status.HTTP_201_CREATED,
    )


@router.get(
    "/transactions/",
    response_model=TransactionListResponse,
    summary="My transaction history",
)
def get_my_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """ **Authenticated users only.** Returns all sent and received transactions."""
    account = account_service.get_my_account(session, current_user.user_id)
    transactions, total = transaction_service.get_my_transactions(
        session, account_id=account.account_id, skip=skip, limit=limit
    )
    return TransactionListResponse(transactions=transactions, total=total)


@router.get(
    "/admin/transactions",
    response_model=TransactionListResponse,
    summary="[Admin] All transactions",
)
def get_all_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin),
):
    """🔒 **Admin only.** Returns all transactions across the system."""
    transactions, total = transaction_service.get_all_transactions(
        session, skip=skip, limit=limit
    )
    return TransactionListResponse(transactions=transactions, total=total)


@router.get(
    "/admin/transactions/high-risk",
    response_model=TransactionListResponse,
    summary="[Admin] High risk transactions",
)
def get_high_risk_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    session: Session = Depends(get_session),
    current_user: User = Depends(require_admin),
):
    """🔒 **Admin only.** Returns only transactions flagged as HIGH risk by the ML model."""
    transactions, total = transaction_repo.get_high_risk_transactions(
        session, skip=skip, limit=limit
    )
    return TransactionListResponse(transactions=transactions, total=total)
