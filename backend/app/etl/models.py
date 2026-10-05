"""
Data structures passed between ETL stages
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field

SCHEMA_VERSION = "1"
MAX_BATCH_SIZE = 500


class EnvelopeError(ValueError):
    """The batch envelope itself is unusable, so no records can be extracted"""


class TransformError(ValueError):
    """A single record could not be mapped to the canonical model"""


class RawTrackerEvent(BaseModel):
    """
    One event exactly as the tracker sends it (field names match tracker/src/events.ts EventData,
    plus the fields DataCollector gathers but did not previously send)
    """

    model_config = ConfigDict(extra="ignore")

    event_id: str = Field(..., min_length=1, max_length=255)
    event_type: str = Field(..., min_length=1, max_length=50)
    session_id: str = Field(..., min_length=1, max_length=255)
    user_id: Optional[str] = Field(None, max_length=255)
    url: str = Field(..., min_length=1)
    referrer: Optional[str] = None
    user_agent: str = Field(..., min_length=1)
    timestamp: Optional[datetime] = Field(None, description="Client-side time of the event")

    viewport_width: Optional[int] = None
    viewport_height: Optional[int] = None
    screen_width: Optional[int] = None
    screen_height: Optional[int] = None
    language: Optional[str] = None
    timezone: Optional[str] = None
    platform: Optional[str] = None
    event_metadata: Optional[Dict[str, Any]] = None


class CanonicalEvent(BaseModel):
    """
    Canonical event model (see schemas/canonical_event.xsd)
    Maps onto the Event table, with event_id as the idempotency key
    """

    event_id: str
    event_type: str
    timestamp: datetime
    session_id: str
    user_id: Optional[str] = None
    url: str
    referrer: Optional[str] = None
    user_agent: str
    viewport_width: Optional[int] = None
    viewport_height: Optional[int] = None
    channel: Optional[str] = None
    event_metadata: Dict[str, Any] = Field(default_factory=dict)


@dataclass
class Reject:
    """A record that failed a stage; persisted to ingest_rejects"""

    stage: str  # extract | transform | validate
    reason: str
    raw_payload: Any = None


@dataclass
class ExtractResult:
    events: List[RawTrackerEvent] = field(default_factory=list)
    rejects: List[Reject] = field(default_factory=list)
    sent_at: Optional[datetime] = None
    received: int = 0
