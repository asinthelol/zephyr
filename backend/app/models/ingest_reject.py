"""
Dead-letter model for records rejected by the ETL ingestion pipeline
"""

from datetime import datetime, timezone
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, Text, JSON

from app.database import Base


class IngestReject(Base):
    """A raw record that failed extract, transform or validate"""
    __tablename__ = "ingest_rejects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    batch_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    stage: Mapped[str] = mapped_column(String(20), nullable=False, index=True)  # extract | transform | validate
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    raw_payload: Mapped[dict | list | str | None] = mapped_column(JSON, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self):
        return f"<IngestReject(id={self.id}, batch={self.batch_id}, stage={self.stage})>"
