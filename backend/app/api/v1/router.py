"""
API v1 Router - Aggregates all v1 endpoints
"""

from fastapi import APIRouter

from app.api.v1.endpoints import events, sessions, users, analytics, api_keys, time_ranges

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

api_router.include_router(
    api_keys.router,
    prefix="/api-keys",
    tags=["api-keys"]
)

api_router.include_router(
    time_ranges.router,
    prefix="/time-ranges",
    tags=["time-ranges"]
)
