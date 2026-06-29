"""
app/services/audit_service.py
─────────────────────────────────────────────
Purpose:
    Records admin actions to the audit_logs table.
    Every significant admin operation should call `log_action`.

    Placed before other services so they can import it.
"""

import json
from typing import Any, Optional

from sqlmodel import Session

from app.models.audit_log import AuditLog
from app.models.enums import AuditActionType
from app.repositories import audit_log_repo


def log_action(
    session: Session,
    user_id: int,
    action_type: AuditActionType,
    details: Any,
    ip_address: Optional[str] = None,
) -> AuditLog:
    """
    Create an audit log entry.

    Args:
        session: Active DB session.
        user_id: ID of the admin user performing the action.
        action_type: AuditActionType enum value.
        details: Any dict/string — will be JSON-encoded.
        ip_address: Optional request IP for security tracing.

    Returns:
        The persisted AuditLog ORM object.
    """
    if isinstance(details, dict):
        details_str = json.dumps(details)
    else:
        details_str = str(details)

    log = AuditLog(
        user_id=user_id,
        action_type=action_type,
        action_details=details_str,
        ip_address=ip_address,
    )
    return audit_log_repo.create_log(session, log)


def get_audit_logs(
    session: Session,
    skip: int = 0,
    limit: int = 50,
    action_type: Optional[AuditActionType] = None,
) -> tuple[list[AuditLog], int]:
    """Retrieve paginated audit logs with optional action type filter."""
    return audit_log_repo.get_all_logs(
        session, skip=skip, limit=limit, action_type=action_type
    )
