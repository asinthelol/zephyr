"""
Channel classification utilities
Determines the traffic channel based on referrer URL
"""

from typing import Optional
from urllib.parse import urlparse
import re


# Common search engines
SEARCH_ENGINES = [
    'google.com', 'google.co', 'bing.com', 'yahoo.com', 'duckduckgo.com',
    'baidu.com', 'yandex.com', 'ecosia.org', 'ask.com', 'aol.com',
    'search.brave.com', 'startpage.com', 'qwant.com', 'searx.me'
]

# Common social media platforms
SOCIAL_MEDIA = [
    'facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'linkedin.com',
    'pinterest.com', 'reddit.com', 'tiktok.com', 'youtube.com', 'snapchat.com',
    'tumblr.com', 'whatsapp.com', 'telegram.org', 'discord.com', 't.co',
    'fb.me', 'lnkd.in'
]


def classify_channel(referrer: Optional[str], current_url: str) -> str:
    """
    Classify traffic channel based on referrer URL
    
    Args:
        referrer: The referrer URL
        current_url: The current page URL
        
    Returns:
        Channel type: 'direct', 'organic_search', 'social', 'referral', 'unknown'
    """
    
    # No referrer = Direct traffic
    if not referrer or referrer.strip() == '':
        return 'direct'
    
    try:
        referrer_parsed = urlparse(referrer)
        current_parsed = urlparse(current_url)
        
        # Same domain = Direct (internal navigation)
        if referrer_parsed.netloc == current_parsed.netloc:
            return 'direct'
        
        referrer_domain = referrer_parsed.netloc.lower()
        
        # Remove 'www.' prefix
        referrer_domain = re.sub(r'^www\.', '', referrer_domain)
        
        # Check if from search engine
        if any(search_engine in referrer_domain for search_engine in SEARCH_ENGINES):
            return 'organic_search'
        
        # Check if from social media
        if any(social in referrer_domain for social in SOCIAL_MEDIA):
            return 'social'
        
        # Everything else is a referral
        return 'referral'
        
    except Exception:
        # If parsing fails, return unknown
        return 'unknown'


def get_referrer_domain(referrer: Optional[str]) -> Optional[str]:
    """
    Extract domain from referrer URL
    """
    if not referrer:
        return None
    
    try:
        parsed = urlparse(referrer)
        domain = parsed.netloc.lower()
        # Remove 'www.' prefix
        domain = re.sub(r'^www\.', '', domain)
        return domain if domain else None
    except Exception:
        return None
