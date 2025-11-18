"""
API v1 Router - Aggregates all v1 endpoints
"""

from fastapi import APIRouter

from app.api.v1.endpoints import events, sessions, users, analytics

api_router = APIRouter()

api_router.include_router(
    events.router,
    prefix="/events",
    tags=["events"]
)

api_router.include_router(
    sessions.router,
    prefix="/sessions",
    tags=["sessions"]
)

api_router.include_router(
    users.router,
    prefix="/users",
    tags=["users"]
)

api_router.include_router(
    analytics.router,
    prefix="/analytics",
    tags=["analytics"]
)
