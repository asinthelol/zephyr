"""
Analytics data endpoints
"""

from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.api.deps import get_db
from app.models.event import Event
from app.models.session import Session as SessionModel
from app.models.user import User
from app.schemas.analytics import AnalyticsResponse, MetricData

router = APIRouter()


@router.get("/overview", response_model=AnalyticsResponse)
def get_overview(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get overview analytics with total counts
    """
    
    query = db.query(Event)
    
    if start_date:
        query = query.filter(Event.timestamp >= start_date)
    if end_date:
        query = query.filter(Event.timestamp <= end_date)
    
    total_events = query.count()
    total_sessions = db.query(SessionModel).count()
    total_users = db.query(User).count()
    
    return AnalyticsResponse(
        metric="overview",
        data=[
            MetricData(label="events", value=float(total_events)),
            MetricData(label="sessions", value=float(total_sessions)),
            MetricData(label="users", value=float(total_users)),
        ],
        total=float(total_events),
        start_date=start_date,
        end_date=end_date
    )


@router.get("/events", response_model=AnalyticsResponse)
def get_events_analytics(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    group_by: str = Query("day", regex="^(hour|day|week|month)$"),
    db: Session = Depends(get_db)
):
    """
    Get event analytics grouped by time period
    """
    
    query = db.query(Event)
    
    if start_date:
        query = query.filter(Event.timestamp >= start_date)
    if end_date:
        query = query.filter(Event.timestamp <= end_date)
    
    # Group by date (simplified for now)
    results = query.all()
    total = len(results)
    
    return AnalyticsResponse(
        metric="events",
        data=[MetricData(label="total_events", value=float(total))],
        total=float(total),
        start_date=start_date,
        end_date=end_date
    )


@router.get("/sessions", response_model=AnalyticsResponse)
def get_sessions_analytics(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get session analytics
    """
    
    query = db.query(SessionModel)
    
    if start_date:
        query = query.filter(SessionModel.started_at >= start_date)
    if end_date:
        query = query.filter(SessionModel.started_at <= end_date)
    
    total_sessions = query.count()
    avg_duration = query.with_entities(func.avg(SessionModel.duration)).scalar() or 0
    avg_page_views = query.with_entities(func.avg(SessionModel.page_views)).scalar() or 0
    
    return AnalyticsResponse(
        metric="sessions",
        data=[
            MetricData(label="total_sessions", value=float(total_sessions)),
            MetricData(label="avg_duration", value=float(avg_duration)),
            MetricData(label="avg_page_views", value=float(avg_page_views)),
        ],
        total=float(total_sessions),
        start_date=start_date,
        end_date=end_date
    )
