"""
Session model for tracking user sessions
"""

from datetime import datetime, timezone
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, DateTime, ForeignKey

from app.database import Base


class Session(Base):
    """Session tracking model"""
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    session_id: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    user_id: Mapped[str | None] = mapped_column(String(255), ForeignKey("users.user_id"), nullable=True, index=True)
    
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    last_activity: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    page_views: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    duration: Mapped[int | None] = mapped_column(Integer, nullable=True)  # Duration in seconds
    
    # Relationships
    user = relationship("User", back_populates="sessions")
    events = relationship("Event", back_populates="session", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Session(id={self.id}, session_id={self.session_id}, page_views={self.page_views})>"
