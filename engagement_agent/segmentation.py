"""
User Segmentation Module

This module handles rule-based user segmentation for the engagement system.
It categorizes users based on their activity patterns and account age.
"""

from datetime import datetime, timedelta
from typing import Literal

# Segment types
SegmentType = Literal["dormant", "loyal", "normal"]

# Segmentation thresholds (in MINUTES for easier testing)
# In production, these would be DAYS (e.g., 3 days for dormant, 30 days for loyal)
DORMANT_THRESHOLD_MINUTES = 60
LOYAL_THRESHOLD_MINUTES = 5


def calculate_minutes_since_activity(last_active_at: datetime) -> float:
    """
    Calculate the number of minutes since the user was last active.
    """
    current_time = datetime.utcnow()
    time_diff = current_time - last_active_at
    return time_diff.total_seconds() / 60


def calculate_account_age_minutes(created_at: datetime) -> float:
    """
    Calculate the age of the user's account in minutes.
    """
    current_time = datetime.utcnow()
    time_diff = current_time - created_at
    return time_diff.total_seconds() / 60


def determine_user_segment(created_at: datetime, last_active_at: datetime) -> SegmentType:
    """
    Determine user segment based on activity and account age.
    
    Segmentation Rules (Optimized for fast testing):
    - If inactive for >= 2 minutes → "dormant" (needs re-engagement)
    - If account age >= 5 minutes AND active → "loyal" (established user)
    - Otherwise → "normal" (new or casual user)
    
    Args:
        created_at: User's account creation timestamp
        last_active_at: User's last activity timestamp
        
    Returns:
        User segment: "dormant", "loyal", or "normal"
    """
    minutes_inactive = calculate_minutes_since_activity(last_active_at)
    account_age_minutes = calculate_account_age_minutes(created_at)
    
    # Check dormant first (highest priority)
    if minutes_inactive >= DORMANT_THRESHOLD_MINUTES:
        return "dormant"
    
    # Check if loyal (established user who is active)
    if account_age_minutes >= LOYAL_THRESHOLD_MINUTES:
        return "loyal"
    
    # Default to normal (new users or casual active users)
    return "normal"


def get_tone_for_segment(segment: SegmentType) -> str:
    """
    Map user segment to appropriate message tone.
    
    Tone Mapping:
    - dormant → "playful" (re-engagement: "We miss you!")
    - loyal → "warm" (appreciation: "Glad you're here!")
    - normal → "neutral" (standard updates)
    """
    tone_mapping = {
        "dormant": "playful",
        "loyal": "warm",
        "normal": "neutral"
    }
    
    return tone_mapping.get(segment, "neutral")
