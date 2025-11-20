"""
User tracking schemas
"""

from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class UserBase(BaseModel):
    """Base user schema"""
    user_id: str = Field(..., description="Unique user identifier")
    ip_address: Optional[str] = Field(None, description="User IP address")
    country: Optional[str] = Field(None, description="User country")
    city: Optional[str] = Field(None, description="User city")


class UserCreate(UserBase):
    """Schema for creating new users"""
    first_seen: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="First time user was seen")


class UserResponse(UserBase):
    """Schema for user responses"""
    id: int
    first_seen: datetime
    last_seen: Optional[datetime] = None
    total_sessions: int = Field(0, description="Total number of sessions")
    total_page_views: int = Field(0, description="Total number of page views")
    
    model_config = ConfigDict(from_attributes=True)
