"""
Load stage: insert canonical events and update session/user rollups.
"""

import logging
from collections import defaultdict
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, List, Set
from sqlalchemy.orm import Session

from app.etl.models import CanonicalEvent, Reject
from app.models import Event, Session as SessionModel, User

logger = logging.getLogger(__name__)


@dataclass
class LoadResult:
    loaded: int = 0
    duplicates: int = 0
    rejects: List[Reject] = field(default_factory=list)


def _as_utc(value: datetime) -> datetime:
    """Treat datetimes (e.g. from SQLite) as UTC"""
    return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value.astimezone(timezone.utc)


def load(db: Session, events: List[CanonicalEvent], batch_id: str) -> LoadResult:
    """
    Insert events that are new and reference known sessions/users

    - events whose event_id already exists are counted as duplicates
    - events referencing a missing session or user become 'load' rejects
    """

    result = LoadResult()
    if not events:
        return result

    # One query each, instead of one per event
    existing_ids: Set[str] = {
        row[0] for row in db.query(Event.event_id).filter(Event.event_id.in_([e.event_id for e in events]))
    }
    sessions: Dict[str, SessionModel] = {
        s.session_id: s
        for s in db.query(SessionModel).filter(SessionModel.session_id.in_({e.session_id for e in events}))
    }
    user_ids = {e.user_id for e in events if e.user_id}
    users: Dict[str, User] = (
        {u.user_id: u for u in db.query(User).filter(User.user_id.in_(user_ids))} if user_ids else {}
    )

    accepted: List[CanonicalEvent] = []
    for event in events:
        if event.event_id in existing_ids:
            result.duplicates += 1
        elif event.session_id not in sessions:
            result.rejects.append(
                Reject("load", f"Session '{event.session_id}' does not exist", event.model_dump(mode="json"))
            )
        elif event.user_id and event.user_id not in users:
            result.rejects.append(
                Reject("load", f"User '{event.user_id}' does not exist", event.model_dump(mode="json"))
            )
        else:
            accepted.append(event)

    db.add_all([Event(**event.model_dump()) for event in accepted])

    _update_rollups(accepted, sessions, users)

    result.loaded = len(accepted)
    logger.info(
        "batch=%s load loaded=%d duplicates=%d rejected=%d",
        batch_id, result.loaded, result.duplicates, len(result.rejects),
    )
    return result


def _update_rollups(
    accepted: List[CanonicalEvent],
    sessions: Dict[str, SessionModel],
    users: Dict[str, User],
) -> None:
    """Apply session and user counters once per session/user rather than once per event."""

    by_session: Dict[str, List[CanonicalEvent]] = defaultdict(list)
    by_user: Dict[str, List[CanonicalEvent]] = defaultdict(list)
    for event in sorted(accepted, key=lambda e: e.timestamp):
        by_session[event.session_id].append(event)
        if event.user_id:
            by_user[event.user_id].append(event)

    for session_id, group in by_session.items():
        session = sessions[session_id]
        session.page_views = (session.page_views or 0) + len(group)
        session.last_activity = max(_as_utc(session.last_activity), group[-1].timestamp)

        pageviews = [e for e in group if e.event_type == "pageview"]
        if pageviews:
            if session.entry_page is None:
                session.entry_page = pageviews[0].url
            session.exit_page = pageviews[-1].url

    for user_id, group in by_user.items():
        user = users[user_id]
        user.total_page_views = (user.total_page_views or 0) + len(group)
        user.last_seen = max(_as_utc(user.last_seen), group[-1].timestamp)
