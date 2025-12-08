"""
Test configuration
"""

import os
import sys

# Set test database URL BEFORE any app imports
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

import pytest
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

# Use in-memory SQLite for testing
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

# Enable foreign key constraints
@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_conn, connection_record):
    """Enable foreign keys for SQLite test database connections"""
    cursor = dbapi_conn.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database for each test"""
    
    # Import here after environment variable is set to override default database
    from app.database import Base
    import app.database
    from app.models import Event, Session, User, APIKey  # Import models to register with Base
    
    # Replace app's database engine with test engine
    app.database.engine = engine
    app.database.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Drop all tables first to ensure clean state
    Base.metadata.drop_all(bind=engine)
    
    # Create all tables fresh
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        
        # Clean up after test
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with database session override"""
    
    # Import here to use test database
    from app.main import app as fastapi_app
    from app.database import get_db
    from app.core.security import validate_api_key
    from app.models.api_key import APIKey
    
    # Create a test API key
    test_api_key = APIKey(
        key="test-api-key-123",
        name="Test API Key",
        is_active=True
    )
    db_session.add(test_api_key)
    db_session.commit()
    
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    # Override API key validation to always return the test API key
    async def override_validate_api_key():
        return test_api_key
    
    fastapi_app.dependency_overrides[get_db] = override_get_db
    fastapi_app.dependency_overrides[validate_api_key] = override_validate_api_key
    
    with TestClient(fastapi_app) as test_client:
        # Set default API key header for all requests
        test_client.headers = {"X-API-Key": "test-api-key-123"}
        yield test_client
    
    fastapi_app.dependency_overrides.clear()


@pytest.fixture
def sample_user_data():
    """Sample user data"""
    
    return {
        "user_id": "test-user-123",
        "ip_address": "192.168.1.1",
        "country": "United States",
        "city": "New York",
        "first_seen": "2025-11-18T10:00:00Z"
    }


@pytest.fixture
def sample_session_data():
    """Sample session data"""
    
    return {
        "session_id": "test-session-456",
        "user_id": "test-user-123",
        "started_at": "2025-11-18T10:00:00Z"
    }


@pytest.fixture
def sample_event_data():
    """Sample event"""
    
    return {
        "event_type": "pageview",
        "url": "https://example.com/test",
        "referrer": "https://google.com",
        "user_agent": "Mozilla/5.0 (Test Browser)",
        "viewport_width": 1920,
        "viewport_height": 1080,
        "event_metadata": {"test": "data"},
        "session_id": "test-session-456",
        "user_id": "test-user-123"
    }


@pytest.fixture
def test_api_key():
    """Test API key value"""
    return "test-api-key-123"
