"""
Validation utilities
"""

import re
from typing import Optional
from urllib.parse import urlparse


def validate_url(url: str) -> bool:
    """
    Validate if string is a valid URL
    """
    
    if not url:
        return False
    
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except Exception:
        return False


def validate_ip_address(ip: str) -> bool:
    """
    Validate if string is a valid IPv4 or IPv6 address
    
    """
    
    if not ip:
        return False
    
    # IPv4 pattern
    ipv4_pattern = r"^(\d{1,3}\.){3}\d{1,3}$"
    if re.match(ipv4_pattern, ip):
      
        # Validate each octet is 0-255
        octets = ip.split(".")
        return all(0 <= int(octet) <= 255 for octet in octets)
    
    # IPv6 pattern
    ipv6_pattern = r"^([0-9a-fA-F]{0,4}:){7}[0-9a-fA-F]{0,4}$"
    if re.match(ipv6_pattern, ip):
        return True
    
    # IPv6 compressed format
    if "::" in ip:
        parts = ip.split("::")
        if len(parts) == 2:
            return True
    
    return False


def validate_session_id(session_id: str) -> bool:
    """
    Validate session ID format
    """
    
    if not session_id:
        return False
    
    # Session ID should be alphanumeric with hyphens, 8-255 chars
    pattern = r"^[a-zA-Z0-9\-_]{8,255}$"
    return bool(re.match(pattern, session_id))


def validate_user_id(user_id: str) -> bool:
    """
    Validate user ID format
    """
    
    if not user_id:
        return False
    
    # User ID should be alphanumeric with hyphens, 8-255 chars
    pattern = r"^[a-zA-Z0-9\-_]{8,255}$"
    return bool(re.match(pattern, user_id))


def sanitize_string(text: Optional[str], max_length: int = 255) -> Optional[str]:
    """
    Sanitize and truncate string input
    """
    if not text:
        return None
    
    # Remove control characters
    sanitized = "".join(char for char in text if ord(char) >= 32 or char in "\n\r\t")
    
    # Truncate to max length
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized.strip() or None


def validate_viewport_dimension(dimension: Optional[int]) -> bool:
    """
    Validate viewport dimension (width or height)
    """
    if dimension is None:
        return True  # Optional field
    
    # Reasonable range for viewport dimensions (1-10000 pixels)
    return 1 <= dimension <= 10000
