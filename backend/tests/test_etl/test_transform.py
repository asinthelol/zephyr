from datetime import datetime, timedelta, timezone

import pytest

from app.etl.models import RawTrackerEvent, TransformError
from app.etl.transform import resolve_timestamp, transform, transform_event

NOW = datetime(2026, 10, 4, 12, 0, 0, tzinfo=timezone.utc)


def parse(raw_dict):
    return RawTrackerEvent.model_validate(raw_dict)


def test_maps_and_enriches(raw):
    event = transform_event(parse(raw(event_type=" PageView ", language="en-US", screen_width=1920)), None, NOW)

    assert event.event_type == "pageview"
    assert event.channel == "organic_search"
    assert event.event_metadata["browser"] == "Chrome"
    assert event.event_metadata["device_type"] == "desktop"
    assert event.event_metadata["language"] == "en-US"
    assert event.event_metadata["screen_width"] == 1920


def test_tracker_metadata_is_preserved(raw):
    event = transform_event(parse(raw(event_metadata={"element_id": "buy"})), None, NOW)

    assert event.event_metadata["element_id"] == "buy"
    assert event.event_metadata["browser"] == "Chrome"


def test_empty_user_id_becomes_none(raw):
    assert transform_event(parse(raw(user_id="")), None, NOW).user_id is None


@pytest.mark.parametrize("overrides, message", [
    ({"url": "not-a-url"}, "Invalid URL"),
    ({"referrer": "nope"}, "Invalid referrer"),
    ({"viewport_width": 0}, "Invalid viewport width"),
    ({"viewport_height": 99999}, "Invalid viewport height"),
])
def test_semantic_errors_raise(raw, overrides, message):
    with pytest.raises(TransformError, match=message):
        transform_event(parse(raw(**overrides)), None, NOW)


def test_long_url_is_truncated(raw):
    event = transform_event(parse(raw(url="https://example.com/" + "a" * 5000)), None, NOW)

    assert len(event.url) == 2048


class TestResolveTimestamp:
    def test_missing_client_timestamp_uses_receive_time(self):
        assert resolve_timestamp(None, None, NOW) == NOW

    def test_without_sent_at_client_time_is_kept(self):
        ts = NOW - timedelta(seconds=30)
        assert resolve_timestamp(ts, None, NOW) == ts

    def test_corrects_clock_skew(self):
        # Client clock is 1 hour behind: it sent at 11:00 while the server saw 12:00
        client_event = datetime(2026, 10, 4, 10, 59, 50, tzinfo=timezone.utc)
        sent_at = datetime(2026, 10, 4, 11, 0, 0, tzinfo=timezone.utc)

        assert resolve_timestamp(client_event, sent_at, NOW) == datetime(
            2026, 10, 4, 11, 59, 50, tzinfo=timezone.utc
        )

    def test_future_timestamps_are_clamped(self):
        assert resolve_timestamp(NOW + timedelta(days=1), None, NOW) == NOW

    def test_naive_timestamps_are_treated_as_utc(self):
        naive = datetime(2026, 10, 4, 11, 0, 0)
        assert resolve_timestamp(naive, None, NOW) == naive.replace(tzinfo=timezone.utc)


def test_batch_drops_duplicates_and_collects_rejects(raw):
    events = [parse(raw()), parse(raw()), parse(raw(event_id="evt-2", url="bad")), parse(raw(event_id="evt-3"))]

    canonical, rejects, duplicates = transform(events, "b1", received_at=NOW)

    assert [e.event_id for e in canonical] == ["evt-1", "evt-3"]
    assert duplicates == 1
    assert len(rejects) == 1
    assert rejects[0].stage == "transform"
    assert rejects[0].raw_payload["event_id"] == "evt-2"
