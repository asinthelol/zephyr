"""
Tests for user endpoints
"""

import pytest


def test_create_user(client, sample_user_data):
    """Test creating a new user"""
    
    response = client.post("/api/users/", json=sample_user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["user_id"] == sample_user_data["user_id"]
    assert data["country"] == sample_user_data["country"]
    assert "id" in data


def test_create_duplicate_user(client, sample_user_data):
    """Test that creating duplicate user fails"""
    
    # Create first user
    client.post("/api/users/", json=sample_user_data)
    
    # Try to create duplicate
    response = client.post("/api/users/", json=sample_user_data)
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]


def test_get_users(client, sample_user_data):
    """Test getting list of users"""
    
    # Create a user first
    client.post("/api/users/", json=sample_user_data)
    
    # Get users
    response = client.get("/api/users/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["user_id"] == sample_user_data["user_id"]


def test_get_user_by_id(client, sample_user_data):
    """Test getting a specific user by user_id"""
    
    # Create user
    client.post("/api/users/", json=sample_user_data)
    
    # Get user by user_id
    response = client.get(f"/api/users/{sample_user_data['user_id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["user_id"] == sample_user_data["user_id"]


def test_get_nonexistent_user(client):
    """Test getting a user that doesn't exist"""
    
    response = client.get("/api/users/nonexistent-user")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]
