from datetime import datetime, timezone
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DateTime, Text, ForeignKey, JSON

from app.database import Base


class Event(Base):
    """Event tracking model"""
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    event_type: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    referrer: Mapped[str | None] = mapped_column(Text, nullable=True)
    channel: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)
    user_agent: Mapped[str] = mapped_column(Text, nullable=False)

    viewport_width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    viewport_height: Mapped[int | None] = mapped_column(Integer, nullable=True)

    event_metadata: Mapped[dict] = mapped_column(JSON, default={})

    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    # Foreign keys
    session_id: Mapped[str] = mapped_column(
        String(255), 
        ForeignKey("sessions.session_id"),
        nullable=False,
        index=True
    )

    user_id: Mapped[str | None] = mapped_column(
        String(255),
        ForeignKey("users.user_id"),
        nullable=True,
        index=True
    )

    # Relationships
    session = relationship("Session", back_populates="events")
    user = relationship("User", back_populates="events")

    def __repr__(self):
        return f"<Event(id={self.id}, type={self.event_type}, url={self.url})>"
