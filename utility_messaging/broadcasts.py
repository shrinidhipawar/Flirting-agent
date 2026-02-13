"""
utility_messaging/broadcasts.py

Scalable broadcast messaging system.

Features:
- Mass broadcast templates
- Priority-based channel selection
- Structured payload output
"""

from datetime import datetime
from typing import List, Dict, Optional

# ---------------------------------------------------
# Broadcast Template Library
# ---------------------------------------------------

BROADCAST_TEMPLATES = {
    "system_update": {
        "template": "We’ve updated our system to improve your experience.",
        "priority": "medium",
        "priority_level": "medium" # Cleaned up naming
    },
    "policy_update": {
        "template": "Our privacy policy has been updated. Please review the latest version.",
        "priority": "high",
        "priority_level": "high"
    },
    "maintenance": {
        # Requires context_data for date/time
        "template": "Scheduled maintenance on {date} from {start_time} to {end_time}.",
        "priority": "high",
        "priority_level": "high"
    },
    "feature_release": {
        # Requires context_data for feature_name
        "template": "New feature released: {feature_name}. Update your app to explore.",
        "priority": "medium",
        "priority_level": "medium"
    }
}


# ---------------------------------------------------
# Channel Selector
# ---------------------------------------------------

def select_broadcast_channel(priority: str) -> str:
    if priority == "high":
        return "push"
    return "email" # Default for medium/low priority broadcasts


# ---------------------------------------------------
# Generate Broadcast Message (Helper)
# ---------------------------------------------------

def generate_broadcast_message(broadcast_type: str, context_data: Dict = None) -> Optional[Dict]:
    config = BROADCAST_TEMPLATES.get(broadcast_type)

    if not config:
        return None

    try:
        if context_data:
            message = config["template"].format(**context_data)
        else:
            message = config["template"]
    except KeyError as e:
        # Handles case where template expects data but none provided
        return None

    return {
        "message": message,
        "priority": config["priority"]
    }


# ---------------------------------------------------
# Send Broadcast (Main Function)
# ---------------------------------------------------

def create_broadcast_payloads(users: List, broadcast_type: str, context_data: Dict = None) -> List[Dict]:
    """
    Creates structured payloads for bulk dispatch.
    
    Args:
        users: List of SQLAlchemy User objects
        broadcast_type: Key from BROADCAST_TEMPLATES
        context_data: Dictionary of data to fill into template
        
    Returns:
        List of dictionaries ready for the dispatch queue
    """

    # 1. GENERATE CONTENT
    broadcast_data = generate_broadcast_message(broadcast_type, context_data)
    if not broadcast_data:
        return []

    # 2. SELECT CHANNEL
    channel = select_broadcast_channel(broadcast_data["priority"])

    payloads = []

    # 3. BUILD PAYLOAD FOR EACH USER
    for user in users:
        # Check for opt-out if attribute exists (safeguard)
        if getattr(user, "broadcast_opt_out", False):
            continue

        payloads.append({
            "user_id": user.id, # Using .id to match our SQLAlchemy model
            "category": "utility",
            "type": broadcast_type,
            "channel": channel,
            "priority": broadcast_data["priority"],
            "message": broadcast_data["message"],
            "status": "pending",
            "created_at": datetime.now(),
            "metadata": {
                "source": "broadcast_engine"
            }
        })

    return payloads
