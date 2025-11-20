"""
Tests for event endpoints
"""

import pytest


def test_create_event(client, sample_user_data, sample_session_data, sample_event_data):
    """Test creating a new event"""
    
    # Create user and session first
    client.post("/api/users/", json=sample_user_data)
    client.post("/api/sessions/", json=sample_session_data)
    
    # Create event
    response = client.post("/api/events/", json=sample_event_data)
    assert response.status_code == 201
    data = response.json()
    assert data["event_type"] == sample_event_data["event_type"]
    assert data["url"] == sample_event_data["url"]
    assert data["session_id"] == sample_event_data["session_id"]
    assert "id" in data
    assert "timestamp" in data


def test_create_event_without_session(client, sample_event_data):
    """Test that creating event without session fails"""
    event_data = sample_event_data.copy()
    event_data["session_id"] = "non-existent-session-999"
    event_data["user_id"] = "non-existent-user-999"
    response = client.post("/api/events/", json=event_data)
    assert response.status_code == 400  # Foreign key validation
    assert "Session" in response.json()["detail"]


def test_get_events(client, sample_user_data, sample_session_data, sample_event_data):
    """Test getting list of events"""
    
    # Create user, session, and event
    client.post("/api/users/", json=sample_user_data)
    client.post("/api/sessions/", json=sample_session_data)
    client.post("/api/events/", json=sample_event_data)
    
    # Get events
    response = client.get("/api/events/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["event_type"] == sample_event_data["event_type"]


def test_get_events_with_pagination(client, sample_user_data, sample_session_data, sample_event_data):
    """Test getting events with pagination"""
    
    # Create user and session
    client.post("/api/users/", json=sample_user_data)
    client.post("/api/sessions/", json=sample_session_data)
    
    # Create multiple events
    for i in range(5):
        event_data = sample_event_data.copy()
        event_data["url"] = f"https://example.com/page{i}"
        client.post("/api/events/", json=event_data)
    
    # Get with limit
    response = client.get("/api/events/?skip=0&limit=3")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3


def test_get_event_by_id(client, sample_user_data, sample_session_data, sample_event_data):
    """Test getting a specific event by ID"""
    
    # Create user, session, and event
    client.post("/api/users/", json=sample_user_data)
    client.post("/api/sessions/", json=sample_session_data)
    create_response = client.post("/api/events/", json=sample_event_data)
    event_id = create_response.json()["id"]
    
    # Get event by ID
    response = client.get(f"/api/events/{event_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == event_id


def test_get_nonexistent_event(client):
    """Test getting an event that doesn't exist"""
    
    response = client.get("/api/events/99999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]
