"""
Session management endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.api.deps import get_db
from app.models.session import Session as SessionModel
from app.models.user import User
from app.schemas.session import SessionCreate, SessionResponse

router = APIRouter()


@router.post("/", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(
    session: SessionCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new session
    """
    
    # Validate foreign key exists if user_id is provided
    if session.user_id is not None:
        user_obj = db.query(User).filter(User.user_id == session.user_id).first()
        if not user_obj:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"User '{session.user_id}' does not exist"
            )
    
    db_session = SessionModel(
        session_id=session.session_id,
        user_id=session.user_id,
        started_at=session.started_at
    )
    db.add(db_session)
    
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database integrity error"
        )
    
    db.refresh(db_session)
    return db_session


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
