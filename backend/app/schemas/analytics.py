"""
Analytics query and response schemas
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict, Field


class AnalyticsQuery(BaseModel):
    """Schema for analytics queries"""
    start_date: Optional[datetime] = Field(None, description="Start date for analytics range")
    end_date: Optional[datetime] = Field(None, description="End date for analytics range")
    metric: str = Field(..., description="Metric to query (sessions, users, page_views, etc.)")
    group_by: Optional[str] = Field(None, description="Field to group results by")


class MetricData(BaseModel):
    """Individual metric data point"""
    label: str
    value: float
    timestamp: Optional[datetime] = None


class AnalyticsResponse(BaseModel):
    """Schema for analytics responses"""
    metric: str
    data: List[MetricData]
    total: float
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
    
    model_config = ConfigDict(from_attributes=True)
