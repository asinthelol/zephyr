"""
Time range helper utilities
"""

from datetime import datetime, timedelta, timezone
from typing import Tuple


def get_time_range(range_type: str) -> Tuple[datetime, datetime]:
    """
    Get start and end datetime for common time ranges
    
    Args:
        range_type: One of 'today', 'yesterday', '7d', '30d', '1h', '24h', 'this_week', 'this_month'
    
    Returns:
        Tuple of (start_date, end_date)
    """
    now = datetime.now(timezone.utc)
    
    if range_type == "today":
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end = now
        
    elif range_type == "yesterday":
        yesterday = now - timedelta(days=1)
        start = yesterday.replace(hour=0, minute=0, second=0, microsecond=0)
        end = yesterday.replace(hour=23, minute=59, second=59, microsecond=999999)
        
    elif range_type == "7d":
        start = now - timedelta(days=7)
        end = now
        
    elif range_type == "30d":
        start = now - timedelta(days=30)
        end = now
        
    elif range_type == "1h":
        start = now - timedelta(hours=1)
        end = now
        
    elif range_type == "24h":
        start = now - timedelta(hours=24)
        end = now
        
    elif range_type == "30m":
        start = now - timedelta(minutes=30)
        end = now
        
    elif range_type == "this_week":
        # Start of week (Monday)
        start = now - timedelta(days=now.weekday())
        start = start.replace(hour=0, minute=0, second=0, microsecond=0)
        end = now
        
    elif range_type == "this_month":
        start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end = now
        
    elif range_type == "last_week":
        # Previous Monday to Sunday
        days_to_monday = now.weekday()
        last_monday = now - timedelta(days=days_to_monday + 7)
        last_sunday = last_monday + timedelta(days=6)
        start = last_monday.replace(hour=0, minute=0, second=0, microsecond=0)
        end = last_sunday.replace(hour=23, minute=59, second=59, microsecond=999999)
        
    elif range_type == "last_month":
        # First day of last month to last day of last month
        first_of_this_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_last_month = first_of_this_month - timedelta(days=1)
        start = last_day_of_last_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end = last_day_of_last_month.replace(hour=23, minute=59, second=59, microsecond=999999)
        
    else:
        # Default to last 24 hours
        start = now - timedelta(hours=24)
        end = now
    
    return start, end


def get_available_ranges() -> list[str]:
    """
    Get list of available time range options
    """
    return [
        "30m",
        "1h",
        "24h",
        "today",
        "yesterday",
        "7d",
        "30d",
        "this_week",
        "last_week",
        "this_month",
        "last_month",
    ]
