"""
Validate stage: serialize canonical events to XML and check them against the XSD
"""

import json
import logging
from functools import lru_cache
from pathlib import Path
from typing import Any, List, Tuple

from lxml import etree

from app.etl.models import SCHEMA_VERSION, CanonicalEvent, Reject

logger = logging.getLogger(__name__)

NAMESPACE = "urn:zephyr:canonical:event:v1"
XSD_PATH = Path(__file__).parent / "schemas" / "canonical_event.xsd"


@lru_cache(maxsize=1)
def get_schema() -> etree.XMLSchema:
    """Load and cache the canonical event schema"""
    return etree.XMLSchema(etree.parse(str(XSD_PATH)))


def _q(tag: str) -> str:
    return f"{{{NAMESPACE}}}{tag}"


def _metadata_text(value: Any) -> str:
    """XML metadata entries are text: booleans become true/false, containers become JSON"""
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (dict, list)):
        return json.dumps(value, separators=(",", ":"), default=str)
    return str(value)


def _add(parent: etree._Element, tag: str, text: Any) -> etree._Element:
    child = etree.SubElement(parent, _q(tag))
    child.text = str(text)
    return child


def event_to_xml(event: CanonicalEvent) -> etree._Element:
    """
    Serialize one canonical event to an <event> element

    Raises ValueError if a value cannot be represented in XML (e.g. control characters).
    """

    el = etree.Element(_q("event"), nsmap={None: NAMESPACE})
    _add(el, "eventId", event.event_id)
    _add(el, "eventType", event.event_type)
    _add(el, "timestamp", event.timestamp.isoformat())
    _add(el, "sessionId", event.session_id)
    if event.user_id:
        _add(el, "userId", event.user_id)
    _add(el, "url", event.url)
    if event.referrer:
        _add(el, "referrer", event.referrer)
    _add(el, "userAgent", event.user_agent)

    if event.viewport_width is not None or event.viewport_height is not None:
        viewport = etree.SubElement(el, _q("viewport"))
        if event.viewport_width is not None:
            _add(viewport, "width", event.viewport_width)
        if event.viewport_height is not None:
            _add(viewport, "height", event.viewport_height)

    if event.channel:
        _add(el, "channel", event.channel)

    if event.event_metadata:
        metadata = etree.SubElement(el, _q("metadata"))
        for key, value in event.event_metadata.items():
            if value is None:
                continue
            entry = _add(metadata, "entry", _metadata_text(value))
            entry.set("key", str(key))

    return el


def events_to_batch_xml(events: List[CanonicalEvent], batch_id: str) -> etree._Element:
    """Serialize events to an <eventBatch> document (also used for the full-batch export)"""
    root = etree.Element(
        _q("eventBatch"),
        nsmap={None: NAMESPACE},
        batchId=batch_id,
        schemaVersion=SCHEMA_VERSION,
    )
    for event in events:
        root.append(event_to_xml(event))
    return root


def validate_event(event: CanonicalEvent, batch_id: str) -> None:
    """
    Check one canonical event against the XSD

    Raises ValueError with the schema error message if it does not conform.
    """

    schema = get_schema()
    doc = events_to_batch_xml([event], batch_id)

    if not schema.validate(doc):
        errors = "; ".join(e.message for e in schema.error_log)
        raise ValueError(errors)


def validate(events: List[CanonicalEvent], batch_id: str) -> Tuple[List[CanonicalEvent], List[Reject]]:
    """
    Validate canonical events individually

    Returns (valid events, rejects). Failures do not affect other events.
    """

    valid: List[CanonicalEvent] = []
    rejects: List[Reject] = []

    for event in events:
        try:
            validate_event(event, batch_id)
            valid.append(event)
        except ValueError as e:
            rejects.append(Reject("validate", str(e), event.model_dump(mode="json")))

    logger.info(
        "batch=%s validate in=%d valid=%d rejected=%d",
        batch_id, len(events), len(valid), len(rejects),
    )
    return valid, rejects
