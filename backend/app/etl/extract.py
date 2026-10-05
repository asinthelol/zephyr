"""
Extract stage: parse the tracker's JSON envelope into raw records
"""

import logging
from datetime import datetime
from typing import Any, Optional
from pydantic import ValidationError

from app.etl.models import (
    MAX_BATCH_SIZE,
    SCHEMA_VERSION,
    EnvelopeError,
    ExtractResult,
    RawTrackerEvent,
    Reject,
)

logger = logging.getLogger(__name__)


def _parse_sent_at(value: Any) -> Optional[datetime]:
    if value is None:
        return None
    if not isinstance(value, str):
        raise EnvelopeError("sent_at must be an ISO 8601 string")
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        raise EnvelopeError("sent_at is not a valid ISO 8601 timestamp")


def _summarize(error: ValidationError) -> str:
    return "; ".join(
        f"{'.'.join(str(p) for p in e['loc']) or 'record'}: {e['msg']}" for e in error.errors()
    )


def extract(payload: Any, batch_id: str) -> ExtractResult:
    """
    Parse an envelope of the form {schema_version, sent_at, events: [...]}

    Raises EnvelopeError if the envelope is unusable. Individual bad records
    are returned as rejects so the rest of the batch can continue.
    """

    if not isinstance(payload, dict):
        raise EnvelopeError("Envelope must be a JSON object")

    if str(payload.get("schema_version")) != SCHEMA_VERSION:
        raise EnvelopeError(f"Unsupported schema_version, expected '{SCHEMA_VERSION}'")

    records = payload.get("events")
    if not isinstance(records, list) or not records:
        raise EnvelopeError("events must be a non-empty list")
    if len(records) > MAX_BATCH_SIZE:
        raise EnvelopeError(f"Batch too large: {len(records)} events (max {MAX_BATCH_SIZE})")

    result = ExtractResult(sent_at=_parse_sent_at(payload.get("sent_at")), received=len(records))

    for index, record in enumerate(records):
        try:
            result.events.append(RawTrackerEvent.model_validate(record))
        except ValidationError as e:
            result.rejects.append(
                Reject("extract", f"events[{index}]: {_summarize(e)}", record)
            )

    logger.info(
        "batch=%s extract received=%d parsed=%d rejected=%d",
        batch_id, result.received, len(result.events), len(result.rejects),
    )
    return result
