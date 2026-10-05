import pytest

from app.etl.extract import extract
from app.etl.models import MAX_BATCH_SIZE, EnvelopeError


def test_parses_valid_records(raw, envelope):
    result = extract(envelope(raw(), raw(event_id="evt-2")), "b1")

    assert result.received == 2
    assert [e.event_id for e in result.events] == ["evt-1", "evt-2"]
    assert result.rejects == []
    assert result.sent_at is not None


def test_bad_record_is_rejected_without_stopping_batch(raw, envelope):
    result = extract(envelope(raw(), {"event_id": "evt-2"}, raw(event_id="evt-3")), "b1")

    assert result.received == 3
    assert len(result.events) == 2
    assert len(result.rejects) == 1
    reject = result.rejects[0]
    assert reject.stage == "extract"
    assert reject.reason.startswith("events[1]:")
    assert reject.raw_payload == {"event_id": "evt-2"}


def test_non_object_record_is_rejected(raw, envelope):
    result = extract(envelope(raw(), "garbage"), "b1")

    assert len(result.events) == 1
    assert result.rejects[0].raw_payload == "garbage"


def test_unknown_fields_are_ignored(raw, envelope):
    result = extract(envelope(raw(surprise="x")), "b1")

    assert len(result.events) == 1


@pytest.mark.parametrize("payload", [
    None,
    [],
    "text",
    {"events": []},
    {"schema_version": "2", "events": [{}]},
    {"schema_version": "1"},
    {"schema_version": "1", "events": []},
    {"schema_version": "1", "events": "nope"},
    {"schema_version": "1", "sent_at": 5, "events": [{}]},
    {"schema_version": "1", "sent_at": "yesterday", "events": [{}]},
])
def test_unusable_envelope_raises(payload):
    with pytest.raises(EnvelopeError):
        extract(payload, "b1")


def test_oversized_batch_raises(raw, envelope):
    with pytest.raises(EnvelopeError, match="too large"):
        extract(envelope(*[raw(event_id=f"e{i}") for i in range(MAX_BATCH_SIZE + 1)]), "b1")
