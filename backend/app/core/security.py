"""
Security utilities for API key authentication
"""

import secrets
from datetime import datetime, timezone
from typing import Optional
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.api_key import APIKey

# API Key header configuration
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def generate_api_key() -> str:
    """
    Generate a secure random API key
    
    Returns:
        A 64-character hexadecimal API key
    """
    return secrets.token_hex(32)


async def validate_api_key(
    api_key: Optional[str] = Security(api_key_header),
    db: Session = Depends(get_db)
) -> APIKey:
    """
    Validate API key from request header
        
    Returns:
        APIKey model instance if valid
        HTTPException: If API key is invalid or inactive
    """
    
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key is required. Provide X-API-Key header."
        )
    
    # Get database session if not provided
    if db is None:
        db = next(get_db())
    
    # Query API key
    db_api_key = db.query(APIKey).filter(APIKey.key == api_key).first()
    
    if not db_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )
    
    if not db_api_key.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="API key is inactive"
        )
    
    # Update last used timestamp and request count
    db_api_key.last_used_at = datetime.now(timezone.utc)
    db_api_key.request_count += 1
    db.commit()
    
    return db_api_key


def create_api_key(
    db: Session,
    name: str,
    description: Optional[str] = None
) -> APIKey:
    """
    Create a new API key
        
    Returns:
        Created APIKey instance
    """
    
    api_key = APIKey(
        key=generate_api_key(),
        name=name,
        description=description,
        is_active=True
    )
    
    db.add(api_key)
    db.commit()
    db.refresh(api_key)
    
    return api_key


def revoke_api_key(db: Session, key: str) -> bool:
    """
    Revoke (deactivate) an API key
        
    Returns:
        True if revoked successfully, False if not found
    """
    
    api_key = db.query(APIKey).filter(APIKey.key == key).first()
    
    if not api_key:
        return False
    
    api_key.is_active = False
    db.commit()
    
    return True
