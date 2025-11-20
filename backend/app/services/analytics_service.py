"""
Analytics aggregation and calculation service
"""

from datetime import datetime
from typing import Dict, List, Optional, Any
from sqlalchemy import func, distinct
from sqlalchemy.orm import Session

from app.models import Event, Session as SessionModel, User


class AnalyticsService:
    """Service for analytics calculations and aggregations"""
    
    @staticmethod
    def _apply_date_filters(query, start_date: Optional[datetime], end_date: Optional[datetime], timestamp_column):
        """
        Apply date range filters to a query
        """
        
        if start_date:
            query = query.filter(timestamp_column >= start_date)
        if end_date:
            query = query.filter(timestamp_column <= end_date)
        return query
    
    @staticmethod
    def get_overview_stats(
        db: Session,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """
        Get overview analytics statistics
        """
        
        # Build base queries with date filters
        event_query = AnalyticsService._apply_date_filters(
            db.query(Event), start_date, end_date, Event.timestamp
        )
        session_query = AnalyticsService._apply_date_filters(
            db.query(SessionModel), start_date, end_date, SessionModel.started_at
        )
        user_query = AnalyticsService._apply_date_filters(
            db.query(User), start_date, end_date, User.first_seen
        )
        
        # Calculate statistics
        total_events = event_query.count()
        total_sessions = session_query.count()
        total_users = user_query.count()
        
        # Unique visitors
        unique_visitors = event_query.with_entities(
            func.count(distinct(Event.user_id))
        ).scalar() or 0
        
        # Page views
        page_views = event_query.filter(Event.event_type == "pageview").count()
        
        # Average session duration
        avg_duration_result = session_query.with_entities(
            func.avg(SessionModel.duration)
        ).filter(SessionModel.duration.isnot(None)).scalar()
        avg_session_duration = float(avg_duration_result) if avg_duration_result else 0
        
        return {
            "total_events": total_events,
            "total_sessions": total_sessions,
            "total_users": total_users,
            "unique_visitors": unique_visitors,
            "page_views": page_views,
            "avg_session_duration": avg_session_duration,
        }
    
    @staticmethod
    def get_events_by_type(
        db: Session,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Get event counts grouped by event type
        """
        
        query = db.query(
            Event.event_type,
            func.count(Event.id).label("count")
        ).group_by(Event.event_type)
        
        query = AnalyticsService._apply_date_filters(query, start_date, end_date, Event.timestamp)
        
        results = query.all()
        
        return [
            {"event_type": event_type, "count": count}
            for event_type, count in results
        ]
    
    @staticmethod
    def get_top_pages(
        db: Session,
        limit: int = 10,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Get top pages by view count
        """
        
        query = db.query(
            Event.url,
            func.count(Event.id).label("views")
        ).filter(
            Event.event_type == "pageview",
            Event.url.isnot(None)
        ).group_by(Event.url).order_by(func.count(Event.id).desc())
        
        query = AnalyticsService._apply_date_filters(query, start_date, end_date, Event.timestamp)
        
        results = query.limit(limit).all()
        
        return [
            {"url": url, "views": views}
            for url, views in results
        ]
    
    @staticmethod
    def get_traffic_by_device(
        db: Session,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Get traffic counts grouped by device type
        """
        
        query = db.query(
            Event.device_type,
            func.count(distinct(Event.user_id)).label("users")
        ).filter(
            Event.device_type.isnot(None)
        ).group_by(Event.device_type)
        
        query = AnalyticsService._apply_date_filters(query, start_date, end_date, Event.timestamp)
        
        results = query.all()
        
        return [
            {"device_type": device_type or "unknown", "users": users}
            for device_type, users in results
        ]
    
    @staticmethod
    def get_traffic_by_browser(
        db: Session,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Get traffic counts grouped by browser
        """
        
        query = db.query(
            Event.browser,
            func.count(distinct(Event.user_id)).label("users")
        ).filter(
            Event.browser.isnot(None)
        ).group_by(Event.browser)
        
        query = AnalyticsService._apply_date_filters(query, start_date, end_date, Event.timestamp)
        
        results = query.all()
        
        return [
            {"browser": browser or "unknown", "users": users}
            for browser, users in results
        ]
    
    @staticmethod
    def get_traffic_by_location(
        db: Session,
        limit: int = 10,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Get traffic counts grouped by location (country/city)
        """
        
        query = db.query(
            User.country,
            User.city,
            func.count(distinct(User.user_id)).label("users")
        ).filter(
            User.country.isnot(None)
        ).group_by(User.country, User.city).order_by(func.count(distinct(User.user_id)).desc())
        
        query = AnalyticsService._apply_date_filters(query, start_date, end_date, User.first_seen)
        
        results = query.limit(limit).all()
        
        return [
            {
                "country": country or "unknown",
                "city": city or "unknown",
                "users": users
            }
            for country, city, users in results
        ]
    
    @staticmethod
    def get_events_timeline(
        db: Session,
        interval: str = "day",
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Get event counts over time grouped by interval
        """
        
        # Determine date truncation based on interval
        if interval == "hour":
            date_trunc = func.date_trunc('hour', Event.timestamp)
        elif interval == "day":
            date_trunc = func.date_trunc('day', Event.timestamp)
        elif interval == "week":
            date_trunc = func.date_trunc('week', Event.timestamp)
        elif interval == "month":
            date_trunc = func.date_trunc('month', Event.timestamp)
        else:
            date_trunc = func.date_trunc('day', Event.timestamp)
        
        query = db.query(
            date_trunc.label("period"),
            func.count(Event.id).label("count")
        ).group_by("period").order_by("period")
        
        query = AnalyticsService._apply_date_filters(query, start_date, end_date, Event.timestamp)
        
        results = query.all()
        
        return [
            {"timestamp": period.isoformat() if period else None, "count": count}
            for period, count in results
        ]
    
    @staticmethod
    def get_bounce_rate(
        db: Session,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> Optional[float]:
        """
        Calculate bounce rate (sessions with only 1 page view)
        """
        
        query = AnalyticsService._apply_date_filters(
            db.query(SessionModel), start_date, end_date, SessionModel.started_at
        )
        
        total_sessions = query.count()
        
        if total_sessions == 0:
            return None
        
        # Count sessions with only 1 page view
        bounced_sessions = query.filter(SessionModel.page_views <= 1).count()
        
        return (bounced_sessions / total_sessions) * 100
