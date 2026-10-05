import pytest
from sqlalchemy.exc import IntegrityError

from app.etl.models import EnvelopeError
from app.etl.pipeline import run_pipeline
from app.models import Event, IngestReject


def reconciles(result):
    return result.received == result.loaded + result.rejected + result.duplicates


def test_mixed_batch_counts_reconcile(seeded_db, raw, envelope):
    payload = envelope(
        raw(event_id="ok-1"),
        raw(event_id="ok-1"),                                  # duplicate in batch
        raw(event_id="ok-2", url="https://example.com/b"),
        raw(event_id="bad-url", url="nope"),                   # transform reject
        raw(event_id="bad-type", event_type="Bad Type!"),      # validate reject
        raw(event_id="no-sess", session_id="ghost"),           # load reject
        {"event_id": "broken"},                                # extract reject
    )

    result = run_pipeline(seeded_db, payload)

    assert (result.received, result.loaded, result.rejected, result.duplicates) == (7, 2, 4, 1)
    assert reconciles(result)
    stages = sorted(r.stage for r in seeded_db.query(IngestReject).filter_by(batch_id=result.batch_id))
    assert stages == ["extract", "load", "transform", "validate"]


def test_resending_a_batch_is_idempotent(seeded_db, raw, envelope):
    payload = envelope(raw(event_id="a"), raw(event_id="b"))

    first = run_pipeline(seeded_db, payload)
    second = run_pipeline(seeded_db, payload)

    assert first.loaded == 2
    assert (second.loaded, second.duplicates) == (0, 2)
    assert seeded_db.query(Event).count() == 2


def test_rejects_keep_raw_payload_and_reason(seeded_db, raw, envelope):
    run_pipeline(seeded_db, envelope(raw(event_id="x", url="nope")))

    reject = seeded_db.query(IngestReject).one()
    assert reject.reason == "Invalid URL format"
    assert reject.raw_payload["event_id"] == "x"


def test_enriched_fields_are_stored(seeded_db, raw, envelope):
    run_pipeline(seeded_db, envelope(raw(language="en-US")))

    event = seeded_db.query(Event).one()
    assert event.event_id == "evt-1"
    assert event.channel == "organic_search"
    assert event.event_metadata["browser"] == "Chrome"
    assert event.event_metadata["language"] == "en-US"


def test_bad_envelope_raises_and_writes_nothing(seeded_db):
    with pytest.raises(EnvelopeError):
        run_pipeline(seeded_db, {"schema_version": "1", "events": []})

    assert seeded_db.query(Event).count() == 0
    assert seeded_db.query(IngestReject).count() == 0


def test_load_failure_rolls_back_everything(seeded_db, raw, envelope, monkeypatch):
    def boom(*args, **kwargs):
        raise IntegrityError("insert", {}, Exception("simulated"))

    monkeypatch.setattr("app.etl.pipeline.load", boom)

    with pytest.raises(IntegrityError):
        run_pipeline(seeded_db, envelope(raw(), raw(event_id="bad", url="nope")))

    assert seeded_db.query(Event).count() == 0
    assert seeded_db.query(IngestReject).count() == 0
