"""
Endpoint to get available time range options
"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/time-ranges")
def get_time_ranges():
    """
    Get list of available preset time range options
    """
    return {
        "ranges": [
            {"value": "30m", "label": "Last 30 Minutes"},
            {"value": "1h", "label": "Last Hour"},
            {"value": "24h", "label": "Last 24 Hours"},
            {"value": "today", "label": "Today"},
            {"value": "yesterday", "label": "Yesterday"},
            {"value": "7d", "label": "Last 7 Days"},
            {"value": "30d", "label": "Last 30 Days"},
            {"value": "this_week", "label": "This Week"},
            {"value": "last_week", "label": "Last Week"},
            {"value": "this_month", "label": "This Month"},
            {"value": "last_month", "label": "Last Month"},
        ]
    }
