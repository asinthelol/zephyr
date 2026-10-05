"""
Transform stage: map raw tracker events onto the canonical event model
"""

import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Set, Tuple

from app.etl.models import CanonicalEvent, RawTrackerEvent, Reject, TransformError
from app.services.event_service import EventService
from app.utils.validators import validate_url, validate_viewport_dimension

logger = logging.getLogger(__name__)

# Tracker fields that have no column of their own and are carried in event_metadata
_METADATA_FIELDS = ("language", "timezone", "platform", "screen_width", "screen_height")


def _as_utc(value: datetime) -> datetime:
    """Treat naive datetimes as UTC"""
    return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value.astimezone(timezone.utc)


def resolve_timestamp(
    client_ts: Optional[datetime],
    sent_at: Optional[datetime],
    received_at: datetime,
) -> datetime:
    """
    Correct client clock skew and clamp to the receive time

    skew = received_at - sent_at, applied to the client timestamp. Without
    a client timestamp, the receive time is used.
    """

    if client_ts is None:
        return received_at

    ts = _as_utc(client_ts)
    if sent_at is not None:
        ts = ts + (received_at - _as_utc(sent_at))

    return min(ts, received_at)


def transform_event(
    raw: RawTrackerEvent,
    sent_at: Optional[datetime] = None,
    received_at: Optional[datetime] = None,
) -> CanonicalEvent:
    """
    Map one raw event to the canonical model

    Raises TransformError for records that parse but are semantically invalid.
    """

    received_at = received_at or datetime.now(timezone.utc)

    if not validate_url(raw.url):
        raise TransformError("Invalid URL format")
    if raw.referrer and not validate_url(raw.referrer):
        raise TransformError("Invalid referrer URL format")
    if not validate_viewport_dimension(raw.viewport_width):
        raise TransformError("Invalid viewport width")
    if not validate_viewport_dimension(raw.viewport_height):
        raise TransformError("Invalid viewport height")

    metadata: Dict[str, Any] = dict(raw.event_metadata or {})
    for name in _METADATA_FIELDS:
        value = getattr(raw, name)
        if value is not None:
            metadata[name] = value

    # Reuse the shared enrichment: user-agent parsing, sanitizing, channel classification
    enriched = EventService.enrich_event_data({
        "url": raw.url,
        "referrer": raw.referrer,
        "user_agent": raw.user_agent,
        "event_metadata": metadata,
    })

    if not enriched.get("url"):
        raise TransformError("URL is empty after sanitizing")

    return CanonicalEvent(
        event_id=raw.event_id,
        event_type=raw.event_type.strip().lower(),
        timestamp=resolve_timestamp(raw.timestamp, sent_at, received_at),
        session_id=raw.session_id,
        user_id=raw.user_id or None,
        url=enriched["url"],
        referrer=enriched.get("referrer"),
        user_agent=raw.user_agent,
        viewport_width=raw.viewport_width,
        viewport_height=raw.viewport_height,
        channel=enriched.get("channel"),
        event_metadata=enriched["event_metadata"],
    )


def transform(
    events: List[RawTrackerEvent],
    batch_id: str,
    sent_at: Optional[datetime] = None,
    received_at: Optional[datetime] = None,
) -> Tuple[List[CanonicalEvent], List[Reject], int]:
    """
    Transform a list of raw events

    Returns (canonical events, rejects, in-batch duplicate count). Repeated
    event_ids within the batch are dropped as duplicates, keeping the first.
    """

    received_at = received_at or datetime.now(timezone.utc)
    canonical: List[CanonicalEvent] = []
    rejects: List[Reject] = []
    seen: Set[str] = set()
    duplicates = 0

    for raw in events:
        if raw.event_id in seen:
            duplicates += 1
            continue
        seen.add(raw.event_id)

        try:
            canonical.append(transform_event(raw, sent_at, received_at))
        except TransformError as e:
            rejects.append(Reject("transform", str(e), raw.model_dump(mode="json")))

    logger.info(
        "batch=%s transform in=%d out=%d rejected=%d duplicates=%d",
        batch_id, len(events), len(canonical), len(rejects), duplicates,
    )
    return canonical, rejects, duplicates
