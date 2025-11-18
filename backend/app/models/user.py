"""
User model for tracking unique visitors
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    """User tracking model"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), unique=True, nullable=False, index=True)
    ip_address = Column(String(45), nullable=True)  # IPv6 can be up to 45 chars
    country = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    first_seen = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    last_seen = Column(DateTime, default=datetime.utcnow, nullable=False)
    total_sessions = Column(Integer, default=0, nullable=False)
    total_page_views = Column(Integer, default=0, nullable=False)
    
    # Relationships
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, user_id={self.user_id}, total_sessions={self.total_sessions})>"
