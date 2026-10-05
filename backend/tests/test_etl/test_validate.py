from datetime import datetime, timezone
from pathlib import Path

import pytest
from lxml import etree

from app.etl.models import CanonicalEvent
from app.etl.validate import XSD_PATH, event_to_xml, events_to_batch_xml, get_schema, validate


def canonical(**overrides):
    data = {
        "event_id": "evt-1",
        "event_type": "pageview",
        "timestamp": datetime(2026, 10, 4, 12, 0, tzinfo=timezone.utc),
        "session_id": "sess-0001",
        "url": "https://example.com/",
        "user_agent": "UA",
        "channel": "direct",
    }
    data.update(overrides)
    return CanonicalEvent(**data)


def test_sample_batch_conforms_to_schema():
    sample = Path(XSD_PATH).parent / "sample_batch.xml"

    assert get_schema().validate(etree.parse(str(sample)))


def test_valid_event_passes():
    valid, rejects = validate([canonical()], "b1")

    assert len(valid) == 1
    assert rejects == []


@pytest.mark.parametrize("overrides", [
    {},
    {"viewport_width": 1440},
    {"viewport_height": 900},
    {"user_id": "user-1", "referrer": "https://google.com/"},
    {"event_type": "custom-type.v2"},
    {"channel": None},
    {"event_metadata": {"flag": True, "nested": {"a": [1, 2]}, "none": None, "n": 3}},
])
def test_valid_variants_pass(overrides):
    valid, rejects = validate([canonical(**overrides)], "b1")

    assert rejects == [], rejects and rejects[0].reason
    assert len(valid) == 1


@pytest.mark.parametrize("overrides, fragment", [
    ({"event_type": "Bad Type"}, "eventType"),
    ({"event_type": "9lives"}, "eventType"),
    ({"channel": "carrier_pigeon"}, "channel"),
    ({"viewport_width": 50000}, "width"),
    ({"viewport_width": -1}, "width"),
    ({"url": "https://example.com/" + "a" * 3000}, "url"),
    ({"session_id": ""}, "sessionId"),
])
def test_invalid_events_are_rejected_with_reason(overrides, fragment):
    valid, rejects = validate([canonical(**overrides)], "b1")

    assert valid == []
    assert rejects[0].stage == "validate"
    assert fragment in rejects[0].reason


def test_control_characters_are_rejected():
    valid, rejects = validate([canonical(user_agent="bad\x01agent")], "b1")

    assert valid == []
    assert "XML compatible" in rejects[0].reason


def test_failures_do_not_affect_other_events():
    valid, rejects = validate(
        [canonical(), canonical(event_id="evt-2", channel="bogus"), canonical(event_id="evt-3")], "b1"
    )

    assert [e.event_id for e in valid] == ["evt-1", "evt-3"]
    assert len(rejects) == 1


def test_xml_serialization_shape():
    el = event_to_xml(canonical(user_id="u-1", event_metadata={"flag": True, "nested": {"a": 1}, "skip": None}))
    ns = {"z": "urn:zephyr:canonical:event:v1"}

    assert el.findtext("z:userId", namespaces=ns) == "u-1"
    entries = {e.get("key"): e.text for e in el.findall("z:metadata/z:entry", ns)}
    assert entries == {"flag": "true", "nested": '{"a":1}'}


def test_batch_document_validates():
    doc = events_to_batch_xml([canonical(), canonical(event_id="evt-2")], "b1")

    assert get_schema().validate(doc)
