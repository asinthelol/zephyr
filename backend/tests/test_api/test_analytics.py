"""
Tests for analytics endpoints
"""

import pytest


def test_get_analytics_overview(client, sample_user_data, sample_session_data, sample_event_data):
    """Test getting analytics overview"""
    
    # Create test data
    client.post("/api/users/", json=sample_user_data)
    client.post("/api/sessions/", json=sample_session_data)
    client.post("/api/events/", json=sample_event_data)
    
    # Get overview
    response = client.get("/api/analytics/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["metric"] == "overview"
    assert len(data["data"]) == 3  # events, sessions, users
    assert data["total"] >= 0


def test_get_events_analytics(client, sample_user_data, sample_session_data, sample_event_data):
    """Test getting events analytics"""
    
    # Create test data
    client.post("/api/users/", json=sample_user_data)
    client.post("/api/sessions/", json=sample_session_data)
    client.post("/api/events/", json=sample_event_data)
    
    # Get events analytics
    response = client.get("/api/analytics/events")
    assert response.status_code == 200
    data = response.json()
    assert data["metric"] == "events"
    assert data["total"] >= 1


def test_get_sessions_analytics(client, sample_user_data, sample_session_data):
    """Test getting sessions analytics"""
    
    # Create test data
    client.post("/api/users/", json=sample_user_data)
    client.post("/api/sessions/", json=sample_session_data)
    
    # Get sessions analytics
    response = client.get("/api/analytics/sessions")
    assert response.status_code == 200
    data = response.json()
    assert data["metric"] == "sessions"
    assert data["total"] >= 1
    assert len(data["data"]) == 3  # total_sessions, avg_duration, avg_page_views


def test_analytics_with_date_range(client, sample_user_data, sample_session_data, sample_event_data):
    """Test analytics with date range filtering"""
    
    # Create test data
    client.post("/api/users/", json=sample_user_data)
    client.post("/api/sessions/", json=sample_session_data)
    client.post("/api/events/", json=sample_event_data)
    
    # Get analytics with date range
    response = client.get(
        "/api/analytics/overview?start_date=2025-11-01T00:00:00Z&end_date=2025-11-30T23:59:59Z"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["start_date"] is not None
    assert data["end_date"] is not None
