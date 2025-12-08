"""
Script to create an initial API key for testing

Usage:
    python -m app.scripts.create_api_key
"""

import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent.parent.parent
sys.path.insert(0, str(backend_dir))

from app.database import SessionLocal
from app.core.security import create_api_key


def main():
    """Create a default API key for development"""
    
    db = SessionLocal()
    
    try:
        # Create API key
        api_key = create_api_key(
            db=db,
            name="Development Key",
            description="Default API key for local development and testing"
        )
        
        print("=" * 60)
        print("API Key Created Successfully!")
        print("=" * 60)
        print(f"ID:          {api_key.id}")
        print(f"Name:        {api_key.name}")
        print(f"Description: {api_key.description}")
        print(f"API Key:     {api_key.key}")
        print(f"Created:     {api_key.created_at}")
        print("=" * 60)
        print("\n ### IMPORTANT: Store this key securely! ### \n")
        print("This is the only time the full key will be displayed.\n")
        print("Add this to your tracker configuration:")
        print(f'  X-API-Key: {api_key.key}')
        print("=" * 60)
        
    except Exception as e:
        print(f"Error creating API key: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    main()
