"""
API Key management endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.api_key import APIKey
from app.schemas.api_key import APIKeyCreate, APIKeyResponse, APIKeyListResponse
from app.core.security import create_api_key, revoke_api_key

router = APIRouter()


@router.post("/", response_model=APIKeyResponse, status_code=status.HTTP_201_CREATED)
def create_new_api_key(
    api_key_data: APIKeyCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new API key for tracking
    
    **Note**: The full API key is only shown once during creation.
    Store it securely as it cannot be retrieved later.
    """
    
    db_api_key = create_api_key(
        db=db,
        name=api_key_data.name,
        description=api_key_data.description
    )
    
    return db_api_key


@router.get("/", response_model=List[APIKeyListResponse])
def list_api_keys(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    List all API keys (key preview)
    """
    
    api_keys = db.query(APIKey).offset(skip).limit(limit).all()
    
    # Add key preview (first 8 characters)
    response = []
    for key in api_keys:
        key_dict = {
            "id": key.id,
            "name": key.name,
            "description": key.description,
            "is_active": key.is_active,
            "created_at": key.created_at,
            "last_used_at": key.last_used_at,
            "request_count": key.request_count,
            "key_preview": key.key[:8] + "..." if len(key.key) > 8 else key.key
        }
        response.append(key_dict)
    
    return response


@router.get("/{api_key_id}", response_model=APIKeyListResponse)
def get_api_key(
    api_key_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific API key by ID (partial key only)
    """
    
    api_key = db.query(APIKey).filter(APIKey.id == api_key_id).first()
    
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )
    
    return {
        "id": api_key.id,
        "name": api_key.name,
        "description": api_key.description,
        "is_active": api_key.is_active,
        "created_at": api_key.created_at,
        "last_used_at": api_key.last_used_at,
        "request_count": api_key.request_count,
        "key_preview": api_key.key[:8] + "..."
    }


@router.delete("/{api_key_id}", status_code=status.HTTP_204_NO_CONTENT)
def revoke_api_key_endpoint(
    api_key_id: int,
    db: Session = Depends(get_db)
):
    """
    Revoke (deactivate) an API key
    """
    
    api_key = db.query(APIKey).filter(APIKey.id == api_key_id).first()
    
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )
    
    success = revoke_api_key(db, api_key.key)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to revoke API key"
        )
    
    return None
