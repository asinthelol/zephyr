"""
Event model for tracking user interactions
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.database import Base


class Event(Base):
    """Event tracking model"""
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String(50), nullable=False, index=True)
    url = Column(Text, nullable=False)
    referrer = Column(Text, nullable=True)
    user_agent = Column(Text, nullable=False)
    viewport_width = Column(Integer, nullable=True)
    viewport_height = Column(Integer, nullable=True)
    event_metadata = Column(JSON, default={})
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    
    # Foreign keys
    session_id = Column(String(255), ForeignKey("sessions.session_id"), nullable=False, index=True)
    user_id = Column(String(255), ForeignKey("users.user_id"), nullable=True, index=True)
    
    # Relationships
    session = relationship("Session", back_populates="events")
    user = relationship("User", back_populates="events")

    def __repr__(self):
        return f"<Event(id={self.id}, type={self.event_type}, url={self.url})>"
