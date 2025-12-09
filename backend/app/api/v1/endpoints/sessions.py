"""
Session management endpoints
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.session import Session as SessionModel
from app.models.user import User
from app.models.api_key import APIKey
from app.schemas.session import SessionCreate, SessionResponse
from app.services.session_service import SessionService
from app.utils.validators import validate_session_id
from app.core.security import validate_api_key

router = APIRouter()


@router.post("/", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(
    session: SessionCreate,
    db: Session = Depends(get_db),
    api_key: APIKey = Depends(validate_api_key)
):
    """
    Create a new session
    Requires valid API key in X-API-Key header.
    """
    # Validate session ID format
    if not validate_session_id(session.session_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid session ID format"
        )
    
    # Create user if it doesn't exist
    if session.user_id is not None:
        user_obj = db.query(User).filter(User.user_id == session.user_id).first()
        if not user_obj:
            # Auto-create user on first session
            user_obj = User(
                user_id=session.user_id,
                first_seen=session.started_at,
                last_seen=session.started_at
            )
            db.add(user_obj)
            db.commit()
            db.refresh(user_obj)
    
    try:
        db_session = SessionService.create_session(
            db,
            session.session_id,
            session.user_id,
            session.started_at
        )
        return db_session
    except Exception as e:
        import traceback
        error_detail = f"Error creating session: {str(e)}\n{traceback.format_exc()}"
        print(error_detail)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=error_detail
        )


@router.get("/", response_model=List[SessionResponse])
def get_sessions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get list of sessions
    """
    
    sessions = db.query(SessionModel).offset(skip).limit(limit).all()
    return sessions


@router.get("/{session_id}", response_model=SessionResponse)
def get_session(
    session_id: str,
    db: Session = Depends(get_db)
):
    """
    Get a specific session by session_id
    """
    
    session = db.query(SessionModel).filter(SessionModel.session_id == session_id).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    return session


@router.put("/{session_id}/end", response_model=SessionResponse)
def end_session(
    session_id: str,
    db: Session = Depends(get_db)
):
    """
    End a session and calculate its duration
    """
    
    try:
        session = SessionService.end_session(db, session_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )
        return session
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error ending session: {str(e)}"
        )


@router.get("/active/count")
def get_active_sessions_count(db: Session = Depends(get_db)):
    """
    Get count of currently active sessions (not timed out)
    """
    
    try:
        count = SessionService.get_active_sessions_count(db)
        return {"active_sessions": count}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting active sessions: {str(e)}"
        )
