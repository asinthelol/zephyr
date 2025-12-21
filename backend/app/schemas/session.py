"""
Session tracking schemas
"""

from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class SessionBase(BaseModel):
    """Base session schema"""
    session_id: str = Field(..., description="Unique session identifier")
    user_id: Optional[str] = Field(None, description="User identifier")


class SessionCreate(SessionBase):
    """Schema for creating new sessions"""
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Session start time")


class SessionResponse(SessionBase):
    """Schema for session responses"""
    id: int
    started_at: datetime
    ended_at: Optional[datetime] = None
    page_views: int = Field(0, description="Number of page views in session")
    duration: Optional[int] = Field(None, description="Session duration in seconds")
    entry_page: Optional[str] = Field(None, description="First page viewed in session")
    exit_page: Optional[str] = Field(None, description="Last page viewed in session")
    
    model_config = ConfigDict(from_attributes=True)
