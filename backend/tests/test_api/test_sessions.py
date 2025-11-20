"""
Tests for session endpoints
"""

import pytest


def test_create_session(client, sample_user_data, sample_session_data):
    """Test creating a new session"""
    
    # Create user first (required for foreign key)
    client.post("/api/users/", json=sample_user_data)
    
    # Create session
    response = client.post("/api/sessions/", json=sample_session_data)
    assert response.status_code == 201
    data = response.json()
    assert data["session_id"] == sample_session_data["session_id"]
    assert data["user_id"] == sample_session_data["user_id"]
    assert "id" in data


def test_create_session_without_user(client, sample_session_data):
    """Test that creating session without existing user fails"""
    session_data = sample_session_data.copy()
    session_data["user_id"] = "non-existent-user-999"
    session_data["session_id"] = "unique-session-999"
    response = client.post("/api/sessions/", json=session_data)
    assert response.status_code == 400  # Foreign key validation
    assert "User" in response.json()["detail"]


def test_get_sessions(client, sample_user_data, sample_session_data):
    """Test getting list of sessions"""
    
    # Create user and session
    client.post("/api/users/", json=sample_user_data)
    client.post("/api/sessions/", json=sample_session_data)
    
    # Get sessions
    response = client.get("/api/sessions/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["session_id"] == sample_session_data["session_id"]


def test_get_session_by_id(client, sample_user_data, sample_session_data):
    """Test getting a specific session by session_id"""
    
    # Create user and session
    client.post("/api/users/", json=sample_user_data)
    client.post("/api/sessions/", json=sample_session_data)
    
    # Get session by session_id
    response = client.get(f"/api/sessions/{sample_session_data['session_id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["session_id"] == sample_session_data["session_id"]


def test_get_nonexistent_session(client):
    """Test getting a session that doesn't exist"""
    
    response = client.get("/api/sessions/nonexistent-session")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]
