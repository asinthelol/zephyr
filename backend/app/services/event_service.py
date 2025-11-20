"""
Event processing service
"""

from datetime import datetime, timezone
from typing import Dict, Optional
from sqlalchemy.orm import Session

from app.models import Event, User, Session as SessionModel
from app.schemas.event import EventCreate
from app.utils.user_agent import parse_user_agent
from app.utils.validators import sanitize_string, validate_url


class EventService:
    """Service for event processing and enrichment"""
    
    @staticmethod
    def enrich_event_data(event_data: Dict) -> Dict:
        """
        Enrich event data with parsed user agent and sanitized fields
        
        Args:
            event_data: Raw event data dictionary
            
        Returns:
            Enriched event data dictionary
        """
        enriched = event_data.copy()
        
        # Parse user agent if present
        if "user_agent" in enriched and enriched["user_agent"]:
            ua_info = parse_user_agent(enriched["user_agent"])
            
            # Get existing metadata or create new dict
            metadata = enriched.get("event_metadata", {})
            
            # Add parsed user agent info to metadata
            metadata.update({
                "browser": ua_info.get("browser"),
                "browser_version": ua_info.get("browser_version"),
                "os": ua_info.get("os"),
                "os_version": ua_info.get("os_version"),
                "device_type": ua_info.get("device_type")
            })
            
            enriched["event_metadata"] = metadata
        
        # Sanitize string fields
        if "url" in enriched:
            enriched["url"] = sanitize_string(enriched["url"], max_length=2048)
        
        if "referrer" in enriched:
            enriched["referrer"] = sanitize_string(enriched["referrer"], max_length=2048)
        
        return enriched
    
    @staticmethod
    def validate_event(event_data: EventCreate) -> tuple[bool, Optional[str]]:
        """
        Validate event data
        """
        
        # Validate URL if present
        if event_data.url and not validate_url(event_data.url):
            return False, "Invalid URL format"
        
        # Validate referrer if present
        if event_data.referrer and not validate_url(event_data.referrer):
            return False, "Invalid referrer URL format"
        
        # Validate viewport dimensions
        if event_data.viewport_width and (event_data.viewport_width < 1 or event_data.viewport_width > 10000):
            return False, "Invalid viewport width"
        
        if event_data.viewport_height and (event_data.viewport_height < 1 or event_data.viewport_height > 10000):
            return False, "Invalid viewport height"
        
        return True, None
    
    @staticmethod
    def create_event(db: Session, event_data: EventCreate) -> Event:
        """
        Create a new event with enriched data
        """
        
        # Validate event
        is_valid, error_msg = EventService.validate_event(event_data)
        if not is_valid:
            raise ValueError(error_msg)
        
        # Validate foreign keys exist
        session_obj = db.query(SessionModel).filter(SessionModel.session_id == event_data.session_id).first()
        if not session_obj:
            raise ValueError(f"Session '{event_data.session_id}' does not exist")
        
        if event_data.user_id is not None:
            user_obj = db.query(User).filter(User.user_id == event_data.user_id).first()
            if not user_obj:
                raise ValueError(f"User '{event_data.user_id}' does not exist")
        
        # Convert to dict and enrich
        event_dict = event_data.model_dump()
        enriched_data = EventService.enrich_event_data(event_dict)
        
        # Create event
        db_event = Event(**enriched_data)
        db.add(db_event)
        db.commit()
        db.refresh(db_event)
        
        # Update session last activity
        session_id = db_event.session_id
        if session_id is not None:
            session = db.query(SessionModel).filter(
                SessionModel.session_id == session_id
            ).first()
            if session:
                session.last_activity = datetime.now(timezone.utc)
                session.page_views = (session.page_views or 0) + 1
                db.commit()
        
        # Update user last seen
        user_id = db_event.user_id
        if user_id is not None:
            user = db.query(User).filter(User.user_id == user_id).first()
            if user:
                user.last_seen = datetime.now(timezone.utc)
                user.total_page_views = (user.total_page_views or 0) + 1
                db.commit()
        
        return db_event
    
    @staticmethod
    def get_event_count_by_type(db: Session, event_type: str, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> int:
        """
        Get count of events by type within date range
        """
        
        query = db.query(Event).filter(Event.event_type == event_type)
        
        if start_date:
            query = query.filter(Event.timestamp >= start_date)
        
        if end_date:
            query = query.filter(Event.timestamp <= end_date)
        
        return query.count()
    
    @staticmethod
    def get_unique_users_count(db: Session, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> int:
        """
        Get count of unique users within date range
        """
        
        query = db.query(Event.user_id).distinct()
        
        if start_date:
            query = query.filter(Event.timestamp >= start_date)
        
        if end_date:
            query = query.filter(Event.timestamp <= end_date)
        
        return query.count()
