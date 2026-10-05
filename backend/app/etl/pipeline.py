"""
The big orchestrator: extract -> transform -> validate -> load
"""

import logging
import uuid
from datetime import datetime, timezone
from typing import Any, List, Optional
from sqlalchemy.orm import Session

from app.etl.extract import extract
from app.etl.load import load
from app.etl.models import Reject
from app.etl.transform import transform
from app.etl.validate import validate
from app.models import IngestReject
from app.schemas.ingest import IngestResult

logger = logging.getLogger(__name__)


def run_pipeline(
    db: Session,
    payload: Any,
    batch_id: Optional[str] = None,
    received_at: Optional[datetime] = None,
) -> IngestResult:
    """
    Ingest one tracker envelope

    Raises EnvelopeError if the envelope is unusable. Bad records are recorded
    in ingest_rejects and do not stop the batch. Any failure rolls back commits.
    """

    batch_id = batch_id or uuid.uuid4().hex
    received_at = received_at or datetime.now(timezone.utc)

    extracted = extract(payload, batch_id)
    rejects: List[Reject] = list(extracted.rejects)

    canonical, transform_rejects, batch_duplicates = transform(
        extracted.events, batch_id, extracted.sent_at, received_at
    )
    rejects.extend(transform_rejects)

    valid, validate_rejects = validate(canonical, batch_id)
    rejects.extend(validate_rejects)

    try:
        loaded = load(db, valid, batch_id)
        rejects.extend(loaded.rejects)

        db.add_all(
            IngestReject(batch_id=batch_id, stage=r.stage, reason=r.reason, raw_payload=r.raw_payload)
            for r in rejects
        )
        db.commit()
    except Exception:
        db.rollback()
        logger.exception("batch=%s load failed, transaction rolled back", batch_id)
        raise

    result = IngestResult(
        batch_id=batch_id,
        received=extracted.received,
        loaded=loaded.loaded,
        rejected=len(rejects),
        duplicates=batch_duplicates + loaded.duplicates,
    )
    logger.info("batch=%s done %s", batch_id, result.model_dump())
    return result
