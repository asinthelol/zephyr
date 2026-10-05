"""
Ingestion endpoint (ETL pipeline)
"""

from typing import Any
from fastapi import APIRouter, Body, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.security import validate_api_key
from app.etl.models import MAX_BATCH_SIZE, EnvelopeError
from app.etl.pipeline import run_pipeline
from app.models.api_key import APIKey
from app.schemas.ingest import IngestResult

router = APIRouter()


@router.post("/events", response_model=IngestResult, status_code=status.HTTP_202_ACCEPTED)
def ingest_events(
    payload: Any = Body(
        ...,
        description=(
            "Tracker envelope: {schema_version, sent_at, events: [...]}. "
            f"Up to {MAX_BATCH_SIZE} events per batch."
        ),
    ),
    db: Session = Depends(get_db),
    api_key: APIKey = Depends(validate_api_key),
):
    """
    Ingest a batch of tracker events through the extract, transform, validate and load pipeline.
    Requires valid API key in X-API-Key header.

    Records that fail a stage are rejected individually (stored in ingest_rejects).
    Events are de-duplicated on event_id.
    """

    try:
        return run_pipeline(db, payload)
    except EnvelopeError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e)
        )
