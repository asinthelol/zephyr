"""
Shared builders for ETL tests
"""

from datetime import datetime, timezone
import pytest

from app.models import Session as SessionModel, User

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0 Safari/537.36"


def make_raw(**overrides):
    """A valid raw tracker event dict"""
    event = {
        "event_id": "evt-1",
        "event_type": "pageview",
        "session_id": "sess-0001",
        "user_id": "user-0001",
        "url": "https://example.com/pricing",
        "referrer": "https://www.google.com/",
        "user_agent": UA,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    event.update(overrides)
    return event


def make_envelope(*events, sent_at=None):
    return {
        "schema_version": "1",
        "sent_at": sent_at or datetime.now(timezone.utc).isoformat(),
        "events": list(events),
    }


@pytest.fixture
def raw():
    return make_raw


@pytest.fixture
def envelope():
    return make_envelope


@pytest.fixture
def seeded_db(db_session):
    """db_session with one user and one session already present"""
    db_session.add(User(user_id="user-0001"))
    db_session.add(SessionModel(session_id="sess-0001", user_id="user-0001"))
    db_session.commit()
    return db_session
