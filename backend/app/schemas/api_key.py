"""
API Key schemas
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class APIKeyBase(BaseModel):
    """Base API key schema"""
    name: str = Field(..., description="Name/identifier for the API key")
    description: Optional[str] = Field(None, description="Optional description")


class APIKeyCreate(APIKeyBase):
    """Schema for creating new API keys"""
    pass


class APIKeyResponse(APIKeyBase):
    """Schema for API key responses"""
    id: int
    key: str
    is_active: bool
    created_at: datetime
    last_used_at: Optional[datetime] = None
    request_count: int
    
    model_config = ConfigDict(from_attributes=True)


class APIKeyListResponse(BaseModel):
    """Schema for listing API keys (without exposing full key)"""
    id: int
    name: str
    description: Optional[str]
    is_active: bool
    created_at: datetime
    last_used_at: Optional[datetime]
    request_count: int
    key_preview: str  # Show only first 8 characters
    
    model_config = ConfigDict(from_attributes=True)
