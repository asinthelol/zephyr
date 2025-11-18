"""
Event tracking schemas
"""

from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class EventBase(BaseModel):
    """Base event schema"""
    event_type: str = Field(..., description="Type of event (pageview, click, etc.)")
    url: str = Field(..., description="Page URL where event occurred")
    referrer: Optional[str] = Field(None, description="Referrer URL")
    user_agent: str = Field(..., description="User agent string")
    viewport_width: Optional[int] = Field(None, description="Browser viewport width")
    viewport_height: Optional[int] = Field(None, description="Browser viewport height")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional event metadata")


class EventCreate(EventBase):
    """Schema for creating new events"""
    session_id: str = Field(..., description="Session identifier")
    user_id: Optional[str] = Field(None, description="User identifier")


class EventResponse(EventBase):
    """Schema for event responses"""
    id: int
    session_id: str
    user_id: Optional[str]
    timestamp: datetime
    
    class Config:
        from_attributes = True
