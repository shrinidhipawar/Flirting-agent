"""
User Segmentation Module

This module handles rule-based user segmentation for the engagement system.
It categorizes users based on their activity patterns and account age.
"""

from datetime import datetime, timedelta
from typing import Literal

# Segment types
SegmentType = Literal["dormant", "new_user", "normal"]

# Segmentation thresholds (in days)
DORMANT_THRESHOLD_DAYS = 3
NEW_USER_THRESHOLD_DAYS = 1


def calculate_days_since_activity(last_active_at: datetime) -> float:
    """
    Calculate the number of days since the user was last active.
    
    Args:
        last_active_at: User's last activity timestamp
        
    Returns:
        Number of days (can be fractional)
    """
    current_time = datetime.utcnow()
    time_diff = current_time - last_active_at
    return time_diff.total_seconds() / 86400  # Convert seconds to days


def calculate_account_age_days(created_at: datetime) -> float:
    """
    Calculate the age of the user's account in days.
    
    Args:
        created_at: User's account creation timestamp
        
    Returns:
        Account age in days (can be fractional)
    """
    current_time = datetime.utcnow()
    time_diff = current_time - created_at
    return time_diff.total_seconds() / 86400


def determine_user_segment(created_at: datetime, last_active_at: datetime) -> SegmentType:
    """
    Determine user segment based on activity and account age.
    
    Segmentation Rules:
    - If inactive for >= 3 days → "dormant"
    - If account age < 1 day → "new_user"
    - Otherwise → "normal"
    
    Args:
        created_at: User's account creation timestamp
        last_active_at: User's last activity timestamp
        
    Returns:
        User segment: "dormant", "new_user", or "normal"
    """
    days_inactive = calculate_days_since_activity(last_active_at)
    account_age = calculate_account_age_days(created_at)
    
    # Check dormant first (highest priority)
    if days_inactive >= DORMANT_THRESHOLD_DAYS:
        return "dormant"
    
    # Check if new user
    if account_age < NEW_USER_THRESHOLD_DAYS:
        return "new_user"
    
    # Default to normal
    return "normal"


def get_tone_for_segment(segment: SegmentType) -> str:
    """
    Map user segment to appropriate message tone.
    
    Tone Mapping:
    - dormant → "playful" (re-engagement)
    - new_user → "warm" (welcoming)
    - normal → "neutral" (standard)
    
    Args:
        segment: User segment
        
    Returns:
        Message tone category
    """
    tone_mapping = {
        "dormant": "playful",
        "new_user": "warm",
        "normal": "neutral"
    }
    
    return tone_mapping.get(segment, "neutral")
