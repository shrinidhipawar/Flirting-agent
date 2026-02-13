"""
Engagement Decision Logic Module

This module contains the core decision engine for determining which users
should receive engagement messages and what tone to use.

It does NOT:
- Generate message content
- Save to database
- Make API calls

It ONLY:
- Evaluates user eligibility
- Determines message tone
- Returns decision data
"""

import logging
from datetime import datetime, timedelta
from typing import Dict, Any
from sqlalchemy.orm import Session

from .segmentation import determine_user_segment, get_tone_for_segment

# Configure logging
logger = logging.getLogger(__name__)

# Configuration
INACTIVITY_THRESHOLD_SECONDS = 60  # For testing (1 minute)
MESSAGE_FREQUENCY_HOURS = 24  # Don't message if sent within last 24 hours


def is_user_inactive(last_active_at: datetime) -> bool:
    """
    Check if a user is considered inactive based on the inactivity threshold.
    
    Args:
        last_active_at: User's last activity timestamp
        
    Returns:
        True if user is inactive, False otherwise
    """
    current_time = datetime.utcnow()
    time_diff = current_time - last_active_at
    return time_diff.total_seconds() > INACTIVITY_THRESHOLD_SECONDS


def check_message_frequency(user_id: int, db_session: Session) -> bool:
    """
    Check if the user has received a message recently (within frequency limit).
    
    Args:
        user_id: User's ID
        db_session: Database session
        
    Returns:
        True if user was messaged recently (should skip), False otherwise
    """
    from backend.models import MessageLog
    
    # Calculate cutoff time
    cutoff_time = datetime.utcnow() - timedelta(hours=MESSAGE_FREQUENCY_HOURS)
    
    # Query for recent messages
    recent_message = db_session.query(MessageLog).filter(
        MessageLog.user_id == user_id,
        MessageLog.sent_at >= cutoff_time
    ).first()
    
    return recent_message is not None


def evaluate_user_for_engagement(user, db_session: Session) -> Dict[str, Any]:
    """
    Evaluate whether a user should receive an engagement message.
    
    This is the main decision function that:
    1. Checks if user is inactive
    2. Checks message frequency limits
    3. Determines user segment
    4. Maps segment to tone
    5. Returns eligibility decision
    
    Args:
        user: User object from database
        db_session: Database session for queries
        
    Returns:
        Dictionary containing:
        {
            "eligible": bool,        # Whether to send message
            "segment": str,          # User segment (dormant/new_user/normal)
            "tone": str,             # Message tone (playful/warm/neutral)
            "reason": str            # Explanation for decision
        }
    """
    # Initialize result
    result = {
        "eligible": False,
        "segment": None,
        "tone": None,
        "reason": ""
    }
    
    # Check 1: Is user inactive?
    if not is_user_inactive(user.last_active_at):
        result["reason"] = "User is currently active"
        logger.debug(f"User {user.id} ({user.name}): Skipped - Currently active")
        return result
    
    # Check 2: Message frequency control
    if check_message_frequency(user.id, db_session):
        result["reason"] = f"User was messaged within last {MESSAGE_FREQUENCY_HOURS} hours"
        logger.debug(f"User {user.id} ({user.name}): Skipped - Recently messaged")
        return result
    
    # User is eligible - determine segment and tone
    segment = determine_user_segment(user.created_at, user.last_active_at)
    tone = get_tone_for_segment(segment)
    
    result["eligible"] = True
    result["segment"] = segment
    result["tone"] = tone
    result["reason"] = f"Eligible for engagement (segment: {segment})"
    
    logger.info(f"User {user.id} ({user.name}): Eligible - Segment: {segment}, Tone: {tone}")
    
    return result


def get_engagement_stats(users, db_session: Session) -> Dict[str, Any]:
    """
    Generate statistics about engagement eligibility for a list of users.
    
    This is useful for monitoring and analytics.
    
    Args:
        users: List of user objects
        db_session: Database session
        
    Returns:
        Dictionary with engagement statistics
    """
    stats = {
        "total_users": len(users),
        "eligible": 0,
        "skipped": 0,
        "by_segment": {
            "dormant": 0,
            "new_user": 0,
            "normal": 0
        },
        "skip_reasons": {
            "active": 0,
            "recently_messaged": 0
        }
    }
    
    for user in users:
        evaluation = evaluate_user_for_engagement(user, db_session)
        
        if evaluation["eligible"]:
            stats["eligible"] += 1
            segment = evaluation["segment"]
            if segment in stats["by_segment"]:
                stats["by_segment"][segment] += 1
        else:
            stats["skipped"] += 1
            if "active" in evaluation["reason"].lower():
                stats["skip_reasons"]["active"] += 1
            elif "messaged" in evaluation["reason"].lower():
                stats["skip_reasons"]["recently_messaged"] += 1
    
    return stats
