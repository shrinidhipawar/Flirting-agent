"""
Engagement Agent Module

A clean, modular engagement decision engine that determines:
- Which users are eligible for engagement messages
- What tone/segment to use for each user
- Whether to skip messaging based on activity and frequency rules

This module does NOT handle:
- Message content generation
- Database writes
- API routing

It ONLY provides decision logic.
"""

from .decision_logic import (
    evaluate_user_for_engagement,
    get_engagement_stats,
    is_user_inactive,
    check_message_frequency
)

from .segmentation import (
    determine_user_segment,
    get_tone_for_segment,
    calculate_minutes_since_activity,
    calculate_account_age_minutes
)

__all__ = [
    # Decision logic
    "evaluate_user_for_engagement",
    "get_engagement_stats",
    "is_user_inactive",
    "check_message_frequency",
    
    # Segmentation
    "determine_user_segment",
    "get_tone_for_segment",
    "calculate_minutes_since_activity",
    "calculate_account_age_minutes",
]
