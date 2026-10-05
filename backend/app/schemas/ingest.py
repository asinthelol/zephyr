"""
Ingest pipeline schemas
"""

from pydantic import BaseModel, Field


class IngestResult(BaseModel):
    """Outcome of one ingested batch; received = loaded + rejected + duplicates"""

    batch_id: str = Field(..., description="Identifier used in logs and ingest_rejects")
    received: int = Field(..., description="Records in the submitted envelope")
    loaded: int = Field(..., description="Events inserted")
    rejected: int = Field(..., description="Records that failed a stage (see ingest_rejects)")
    duplicates: int = Field(..., description="Records skipped because their event_id was already seen")
