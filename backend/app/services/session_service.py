"""
Session management service
"""

from datetime import datetime, timedelta, timezone
from typing import Optional
from sqlalchemy.orm import Session as DBSession

from app.models import Session as SessionModel, User, Event


class SessionService:
    """Service for session lifecycle management"""
    
    # Session timeout in minutes
    SESSION_TIMEOUT_MINUTES = 30
    
    @staticmethod
    def create_session(db: DBSession, session_id: str, user_id: Optional[str] = None, started_at: Optional[datetime] = None, entry_page: Optional[str] = None) -> SessionModel:
        """
        Create a new session
        """
        
        if started_at is None:
            started_at = datetime.now(timezone.utc)
        
        db_session = SessionModel(
            session_id=session_id,
            user_id=user_id,
            started_at=started_at,
            last_activity=started_at,
            page_views=0,
            entry_page=entry_page
        )
        
        db.add(db_session)
        db.commit()
        db.refresh(db_session)
        
        # Update user's total sessions if user_id provided
        if user_id is not None:
            user = db.query(User).filter(User.user_id == user_id).first()
            if user:
                user.total_sessions = (user.total_sessions or 0) + 1
                db.commit()
        
        return db_session
    
    @staticmethod
    def update_session_activity(db: DBSession, session_id: str, timestamp: Optional[datetime] = None) -> Optional[SessionModel]:
        """
        Update session's last activity timestamp
        """
        
        if timestamp is None:
            timestamp = datetime.now(timezone.utc)
        
        session = db.query(SessionModel).filter(
            SessionModel.session_id == session_id
        ).first()
        
        if session:
            session.last_activity = timestamp
            db.commit()
            db.refresh(session)
        
        return session
    
    @staticmethod
    def check_session_timeout(db: DBSession, session_id: str) -> bool:
        """
        Check if session has timed out based on last activity
        """
        
        session = db.query(SessionModel).filter(
            SessionModel.session_id == session_id
        ).first()
        
        if not session:
            return True
        
        last_activity = session.last_activity
        if last_activity is None:
            return True
        
        timeout_threshold = datetime.now(timezone.utc) - timedelta(minutes=SessionService.SESSION_TIMEOUT_MINUTES)
        return bool(last_activity < timeout_threshold)
    
    @staticmethod
    def end_session(db: DBSession, session_id: str, ended_at: Optional[datetime] = None, exit_page: Optional[str] = None) -> Optional[SessionModel]:
        """
        End a session and calculate duration
        """
        
        if ended_at is None:
            ended_at = datetime.now(timezone.utc)
        
        session = db.query(SessionModel).filter(
            SessionModel.session_id == session_id
        ).first()
        
        if session:
            ended_at_val = session.ended_at
            if ended_at_val is None:
                session.ended_at = ended_at
                
                # Set exit page if provided
                if exit_page:
                    session.exit_page = exit_page
                
                # Calculate duration in seconds
                started_at = session.started_at
                if started_at is not None:
                    duration = (ended_at - started_at).total_seconds()
                    session.duration = int(duration)
                
                db.commit()
                db.refresh(session)
        
        return session
    
    @staticmethod
    def calculate_session_duration(session: SessionModel) -> Optional[int]:
        """
        Calculate session duration in seconds
        """
        
        ended_at = session.ended_at
        started_at = session.started_at
        last_activity = session.last_activity
        
        if ended_at is not None and started_at is not None:
            return int((ended_at - started_at).total_seconds())
        
        # If session is still active, calculate from last activity
        if last_activity is not None and started_at is not None:
            return int((last_activity - started_at).total_seconds())
        
        return None
    
    @staticmethod
    def end_inactive_sessions(db: DBSession) -> int:
        """
        End all sessions that have timed out
        """
        
        timeout_threshold = datetime.now(timezone.utc) - timedelta(minutes=SessionService.SESSION_TIMEOUT_MINUTES)
        
        # Find all active sessions that timed out
        inactive_sessions = db.query(SessionModel).filter(
            SessionModel.ended_at.is_(None),
            SessionModel.last_activity < timeout_threshold
        ).all()
        
        count = 0
        for session in inactive_sessions:
            # Use last_activity as end time for timed-out sessions

            sess_id: str = session.session_id
            last_act: datetime = session.last_activity
            SessionService.end_session(db, sess_id, last_act)
            count += 1
        
        return count
    
    @staticmethod
    def get_active_sessions_count(db: DBSession) -> int:
        """
        Get count of currently active sessions
        """
        
        timeout_threshold = datetime.now(timezone.utc) - timedelta(minutes=SessionService.SESSION_TIMEOUT_MINUTES)
        
        return db.query(SessionModel).filter(
            SessionModel.ended_at.is_(None),
            SessionModel.last_activity >= timeout_threshold
        ).count()
    
    @staticmethod
    def get_session_page_views(db: DBSession, session_id: str) -> int:
        """
        Get count of page views for a session
        """
        
        return db.query(Event).filter(
            Event.session_id == session_id,
            Event.event_type == "pageview"
        ).count()
    
    @staticmethod
    def get_average_session_duration(db: DBSession, start_date: Optional[datetime] = None, end_date: Optional[datetime] = None) -> Optional[float]:
        """
        Get average session duration in seconds
        """
        
        query = db.query(SessionModel).filter(SessionModel.duration.isnot(None))
        
        if start_date:
            query = query.filter(SessionModel.started_at >= start_date)
        
        if end_date:
            query = query.filter(SessionModel.started_at <= end_date)
        
        sessions = query.all()
        
        if not sessions:
            return None

        durations = [int(s.duration) for s in sessions if s.duration is not None]
        if not durations:
            return None
        
        total_duration = sum(durations)
        return float(total_duration) / len(durations)
