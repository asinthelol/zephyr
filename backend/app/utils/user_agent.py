"""
User agent parsing utilities
"""

from typing import Dict, Optional
import re


def parse_user_agent(user_agent: str) -> Dict[str, Optional[str]]:
    """
    Parse user agent string into structured data
    """
    
    if not user_agent:
        return {
            "browser": None,
            "browser_version": None,
            "os": None,
            "os_version": None,
            "device": None,
            "device_type": None,
        }
    
    browser_info = get_browser_info(user_agent)
    os_info = get_os_info(user_agent)
    device_type = get_device_type(user_agent)
    
    return {
        "browser": browser_info.get("name"),
        "browser_version": browser_info.get("version"),
        "os": os_info.get("name"),
        "os_version": os_info.get("version"),
        "device": None,  # not necessary
        "device_type": device_type,
    }


def get_browser_info(user_agent: str) -> Dict[str, Optional[str]]:
    """
    Extract browser name and version from user agent
    """
    
    # Browser patterns in order of specificity
    browsers = [
        # Edge
        (r"Edg/(\d+\.\d+)", "Edge"),
        # Chrome
        (r"Chrome/(\d+\.\d+)", "Chrome"),
        # Safari
        (r"Safari/(\d+\.\d+)", "Safari"),
        # Firefox
        (r"Firefox/(\d+\.\d+)", "Firefox"),
        # Opera
        (r"OPR/(\d+\.\d+)", "Opera"),
        # Internet Explorer
        (r"MSIE (\d+\.\d+)", "Internet Explorer"),
        (r"Trident/.*rv:(\d+\.\d+)", "Internet Explorer"),
    ]
    
    for pattern, name in browsers:
        match = re.search(pattern, user_agent, re.IGNORECASE)
        if match:
            return {"name": name, "version": match.group(1)}
    
    return {"name": "Unknown", "version": None}


def get_os_info(user_agent: str) -> Dict[str, Optional[str]]:
    """
    Extract operating system name and version from user agent
    """
    
    os_patterns = [
        # Windows
        (r"Windows NT 10\.0", "Windows", "10"),
        (r"Windows NT 6\.3", "Windows", "8.1"),
        (r"Windows NT 6\.2", "Windows", "8"),
        (r"Windows NT 6\.1", "Windows", "7"),
        (r"Windows NT 6\.0", "Windows", "Vista"),
        # macOS
        (r"Mac OS X (\d+[._]\d+)", "macOS", None),
        # Linux
        (r"Linux", "Linux", None),
        # iOS
        (r"iPhone OS (\d+_\d+)", "iOS", None),
        (r"iPad.*OS (\d+_\d+)", "iOS", None),
        # Android
        (r"Android (\d+\.\d+)", "Android", None),
    ]
    
    for pattern, name, version in os_patterns:
        match = re.search(pattern, user_agent, re.IGNORECASE)
        if match:
            if version is None and match.groups():
                version = match.group(1).replace("_", ".")
            return {"name": name, "version": version}
    
    return {"name": "Unknown", "version": None}


def get_device_type(user_agent: str) -> str:
    """
    Determine device type from user agent
    """
    
    user_agent_lower = user_agent.lower()
    
    # Check for bots/crawlers
    bot_patterns = ["bot", "crawler", "spider", "scraper"]
    if any(pattern in user_agent_lower for pattern in bot_patterns):
        return "bot"
    
    # Check for mobile devices
    mobile_patterns = ["mobile", "android", "iphone", "ipod", "blackberry", "windows phone"]
    if any(pattern in user_agent_lower for pattern in mobile_patterns):
        return "mobile"
    
    # Check for tablets
    tablet_patterns = ["ipad", "tablet", "kindle"]
    if any(pattern in user_agent_lower for pattern in tablet_patterns):
        return "tablet"
    
    return "desktop"
