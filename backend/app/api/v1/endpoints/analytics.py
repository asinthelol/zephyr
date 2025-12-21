"""
Analytics data endpoints
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.analytics import AnalyticsResponse, MetricData
from app.services.analytics_service import AnalyticsService
from app.utils.time_ranges import get_time_range, get_available_ranges

router = APIRouter()


@router.get("/overview")
def get_overview(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    time_range: Optional[str] = Query(None, description="Preset time range (30m, 1h, 24h, today, yesterday, 7d, 30d, etc.)"),
    db: Session = Depends(get_db)
):
    """
    Get comprehensive overview analytics including events, sessions, users, and durations
    """
    
    try:
        # Use time_range if provided, otherwise use start_date/end_date
        if time_range:
            start_date, end_date = get_time_range(time_range)
        
        stats = AnalyticsService.get_overview_stats(db, start_date, end_date)
        return {
            "metric": "overview",
            "data": [
                {"label": "events", "value": stats["total_events"]},
                {"label": "sessions", "value": stats["total_sessions"]},
                {"label": "users", "value": stats["total_users"]}
            ],
            "total": stats["total_events"],
            "start_date": start_date,
            "end_date": end_date
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting overview stats: {str(e)}"
        )


@router.get("/events")
def get_events_analytics(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    time_range: Optional[str] = Query(None, description="Preset time range"),
    db: Session = Depends(get_db)
):
    """
    Get event analytics
    """
    
    try:
        if time_range:
            start_date, end_date = get_time_range(time_range)
        
        stats = AnalyticsService.get_overview_stats(db, start_date, end_date)
        return {
            "metric": "events",
            "data": [{"label": "total_events", "value": stats["total_events"]}],
            "total": stats["total_events"],
            "start_date": start_date,
            "end_date": end_date
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting events analytics: {str(e)}"
        )


@router.get("/sessions")
def get_sessions_analytics(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    time_range: Optional[str] = Query(None, description="Preset time range"),
    db: Session = Depends(get_db)
):
    """
    Get session analytics
    """
    
    try:
        if time_range:
            start_date, end_date = get_time_range(time_range)
        
        stats = AnalyticsService.get_overview_stats(db, start_date, end_date)
        avg_duration = stats.get("avg_session_duration", 0)
        total_sessions = stats["total_sessions"]
        avg_page_views = stats.get("avg_pages_per_session", 0)
        
        return {
            "metric": "sessions",
            "data": [
                {"label": "total_sessions", "value": total_sessions},
                {"label": "avg_duration", "value": avg_duration},
                {"label": "avg_page_views", "value": avg_page_views}
            ],
            "total": total_sessions,
            "start_date": start_date,
            "end_date": end_date
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting sessions analytics: {str(e)}"
        )


@router.get("/events/by-type")
def get_events_by_type(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    time_range: Optional[str] = Query(None, description="Preset time range"),
    db: Session = Depends(get_db)
):
    """
    Get event counts grouped by event type
    """
    
    try:
        if time_range:
            start_date, end_date = get_time_range(time_range)
        
        events = AnalyticsService.get_events_by_type(db, start_date, end_date)
        return {"events": events}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting events by type: {str(e)}"
        )


@router.get("/events/timeline")
def get_events_timeline(
    interval: str = Query("day", pattern="^(hour|day|week|month)$"),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    time_range: Optional[str] = Query(None, description="Preset time range"),
    db: Session = Depends(get_db)
):
    """
    Get event counts over time grouped by interval
    """
    
    try:
        if time_range:
            start_date, end_date = get_time_range(time_range)
        
        timeline = AnalyticsService.get_events_timeline(db, interval, start_date, end_date)
        return {"timeline": timeline, "interval": interval}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting events timeline: {str(e)}"
        )


@router.get("/pages/top")
def get_top_pages(
    limit: int = Query(10, ge=1, le=100),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    time_range: Optional[str] = Query(None, description="Preset time range"),
    db: Session = Depends(get_db)
):
    """
    Get top pages by view count
    """
    
    try:
        if time_range:
            start_date, end_date = get_time_range(time_range)
        
        pages = AnalyticsService.get_top_pages(db, limit, start_date, end_date)
        return {"pages": pages}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting top pages: {str(e)}"
        )


@router.get("/traffic/device")
def get_traffic_by_device(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    time_range: Optional[str] = Query(None, description="Preset time range"),
    db: Session = Depends(get_db)
):
    """
    Get traffic distribution by device type (mobile, tablet, desktop, bot)
    """
    
    try:
        if time_range:
            start_date, end_date = get_time_range(time_range)
        
        traffic = AnalyticsService.get_traffic_by_device(db, start_date, end_date)
        return {"traffic": traffic}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting traffic by device: {str(e)}"
        )


@router.get("/traffic/browser")
def get_traffic_by_browser(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    time_range: Optional[str] = Query(None, description="Preset time range"),
    db: Session = Depends(get_db)
):
    """
    Get traffic dis
    tribution by browser (Chrome, Firefox, Safari, etc.)
    """
    
    try:
        if time_range:
            start_date, end_date = get_time_range(time_range)
        
        traffic = AnalyticsService.get_traffic_by_browser(db, start_date, end_date)
        return {"traffic": traffic}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting traffic by browser: {str(e)}"
        )


@router.get("/traffic/location")
def get_traffic_by_location(
    limit: int = Query(10, ge=1, le=100),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    time_range: Optional[str] = Query(None, description="Preset time range"),
    db: Session = Depends(get_db)
):
    """
    Get traffic distribution by geographic location (country/city)
    """
    
    try:
        if time_range:
            start_date, end_date = get_time_range(time_range)
        
        traffic = AnalyticsService.get_traffic_by_location(db, limit, start_date, end_date)
        return {"traffic": traffic}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting traffic by location: {str(e)}"
        )


@router.get("/sessions/bounce-rate")
def get_bounce_rate(
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    time_range: Optional[str] = Query(None, description="Preset time range"),
    db: Session = Depends(get_db)
):
    """
    Get bounce rate (percentage of sessions with only 1 page view)
    """
    
    try:
        if time_range:
            start_date, end_date = get_time_range(time_range)
        
        bounce_rate = AnalyticsService.get_bounce_rate(db, start_date, end_date)
        return {
            "bounce_rate": bounce_rate,
            "description": "Percentage of sessions with only 1 page view"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting bounce rate: {str(e)}"
        )
