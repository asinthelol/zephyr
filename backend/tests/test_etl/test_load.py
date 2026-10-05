from datetime import datetime, timedelta, timezone

from app.etl.load import load
from app.etl.models import CanonicalEvent
from app.models import Event, Session as SessionModel, User

T0 = datetime(2026, 10, 4, 12, 0, tzinfo=timezone.utc)


def canonical(**overrides):
    data = {
        "event_id": "evt-1",
        "event_type": "pageview",
        "timestamp": T0,
        "session_id": "sess-0001",
        "user_id": "user-0001",
        "url": "https://example.com/a",
        "user_agent": "UA",
        "channel": "direct",
    }
    data.update(overrides)
    return CanonicalEvent(**data)


def test_inserts_events(seeded_db):
    result = load(seeded_db, [canonical(), canonical(event_id="evt-2")], "b1")
    seeded_db.commit()

    assert result.loaded == 2
    assert seeded_db.query(Event).count() == 2


def test_load_does_not_commit(seeded_db):
    load(seeded_db, [canonical()], "b1")
    seeded_db.rollback()

    assert seeded_db.query(Event).count() == 0


def test_existing_event_ids_are_duplicates(seeded_db):
    load(seeded_db, [canonical()], "b1")
    seeded_db.commit()

    result = load(seeded_db, [canonical(), canonical(event_id="evt-2")], "b2")
    seeded_db.commit()

    assert result.duplicates == 1
    assert result.loaded == 1
    assert seeded_db.query(Event).count() == 2


def test_missing_session_or_user_become_rejects(seeded_db):
    result = load(
        seeded_db,
        [
            canonical(event_id="evt-1", session_id="ghost-session"),
            canonical(event_id="evt-2", user_id="ghost-user"),
            canonical(event_id="evt-3"),
        ],
        "b1",
    )

    assert result.loaded == 1
    assert [r.stage for r in result.rejects] == ["load", "load"]
    assert "Session 'ghost-session'" in result.rejects[0].reason
    assert "User 'ghost-user'" in result.rejects[1].reason


def test_rollups_are_applied_once_per_session_and_user(seeded_db):
    # Seeded rows default to "now"; start them before the events so the later time wins
    seeded_db.query(User).one().last_seen = T0 - timedelta(days=1)
    seeded_db.query(SessionModel).one().last_activity = T0 - timedelta(days=1)
    seeded_db.commit()

    load(
        seeded_db,
        [
            canonical(event_id="e1", url="https://example.com/a", timestamp=T0),
            canonical(
                event_id="e2", event_type="click", url="https://example.com/click",
                timestamp=T0 + timedelta(seconds=5),
            ),
            canonical(event_id="e3", url="https://example.com/b", timestamp=T0 + timedelta(seconds=10)),
        ],
        "b1",
    )
    seeded_db.commit()

    session = seeded_db.query(SessionModel).one()
    user = seeded_db.query(User).one()
    assert session.page_views == 3
    assert session.entry_page == "https://example.com/a"
    assert session.exit_page == "https://example.com/b"  # last pageview, not the click
    assert user.total_page_views == 3
    assert user.last_seen.replace(tzinfo=timezone.utc) == T0 + timedelta(seconds=10)
    assert session.last_activity.replace(tzinfo=timezone.utc) == T0 + timedelta(seconds=10)


def test_last_activity_never_moves_backwards(seeded_db):
    newest = seeded_db.query(SessionModel).one().last_activity
    load(seeded_db, [canonical(timestamp=T0 - timedelta(days=30))], "b1")
    seeded_db.commit()

    assert seeded_db.query(SessionModel).one().last_activity == newest


def test_entry_page_is_not_overwritten(seeded_db):
    load(seeded_db, [canonical(event_id="e1", url="https://example.com/first")], "b1")
    seeded_db.commit()
    load(
        seeded_db,
        [canonical(event_id="e2", url="https://example.com/second", timestamp=T0 + timedelta(seconds=1))],
        "b2",
    )
    seeded_db.commit()

    session = seeded_db.query(SessionModel).one()
    assert session.entry_page == "https://example.com/first"
    assert session.exit_page == "https://example.com/second"


def test_event_without_user_still_loads(seeded_db):
    result = load(seeded_db, [canonical(user_id=None)], "b1")

    assert result.loaded == 1


def test_empty_input_is_a_noop(seeded_db):
    result = load(seeded_db, [], "b1")

    assert (result.loaded, result.duplicates, result.rejects) == (0, 0, [])
