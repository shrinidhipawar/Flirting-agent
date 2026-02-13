from datetime import datetime, timedelta
from typing import Dict, Optional

# ---------------------------------------------------
# Reminder Configuration
# ---------------------------------------------------

REMINDER_TEMPLATES = {
    "appointment": {
        "template": "Reminder: Your appointment is scheduled on {date} at {time}.",
        "priority": "high",
        "cooldown_hours": 12
    },
    "payment_due": {
        "template": "Reminder: Your payment of ₹{amount} is due on {date}.",
        "priority": "high",
        "cooldown_hours": 24
    },
    "subscription_expiry": {
        "template": "Your subscription will expire on {date}. Renew to continue services.",
        "priority": "medium",
        "cooldown_hours": 48
    },
    "cart_abandonment": {
        "template": "You left items in your cart. Complete your purchase before they sell out.",
        "priority": "low",
        "cooldown_hours": 72
    }
}


# ---------------------------------------------------
# Eligibility Check
# ---------------------------------------------------

def check_opt_out(user) -> bool:
    """
    Returns False if user has opted out of utility messages.
    """
    return not getattr(user, "utility_opt_out", False)


def check_cooldown(user, cooldown_hours: int) -> bool:
    """
    Prevents reminder spam.
    """
    # Assuming user object has a last_utility_message_time attribute
    # Since our simplified DB model might not have this yet, we handle the case safely
    last_msg_time = getattr(user, "last_utility_message_time", None)
    
    if not last_msg_time:
        return True

    time_diff = datetime.now() - last_msg_time
    return time_diff >= timedelta(hours=cooldown_hours)


# ---------------------------------------------------
# Channel Selection Logic
# ---------------------------------------------------

def select_channel(user, priority: str) -> str:
    """
    Decide delivery channel based on priority.
    """
    if priority == "high":
        return "push"
    elif priority == "medium":
        return "email"
    return "push" # Default


# ---------------------------------------------------
# Reminder Generator
# ---------------------------------------------------

def generate_reminder_message(reminder_type: str, context_data: Dict) -> Optional[Dict]:
    """
    Generates reminder payload configuration.
    """

    config = REMINDER_TEMPLATES.get(reminder_type)

    if not config:
        return None

    try:
        message = config["template"].format(**context_data)
    except KeyError as e:
        print(f"Missing data for template: {e}")
        return None

    return {
        "message": message,
        "priority": config["priority"],
        "cooldown_hours": config["cooldown_hours"]
    }


# ---------------------------------------------------
# Main Reminder Processing Function
# ---------------------------------------------------

def process_reminder(user, reminder_type: str, context_data: Dict) -> Optional[Dict]:
    """
    Complete utility reminder workflow.
    """

    # 1. OPT-OUT CHECK
    if not check_opt_out(user):
        return None

    # 2. GENERATE CONTENT
    reminder_data = generate_reminder_message(reminder_type, context_data)
    if not reminder_data:
        return None

    # 3. COOLDOWN CHECK
    # Note: In a real DB integration, you'd query the MessageLogs table here
    if not check_cooldown(user, reminder_data["cooldown_hours"]):
        return None

    # 4. SELECT CHANNEL
    channel = select_channel(user, reminder_data["priority"])

    # 5. CONSTRUCT PAYLOAD
    payload = {
        "user_id": user.id, # Using .id to match our SQLAlchemy model
        "category": "utility",
        "type": reminder_type,
        "channel": channel,
        "priority": reminder_data["priority"],
        "message": reminder_data["message"],
        "status": "pending",
        "created_at": datetime.now(),
        "metadata": {
            "source": "utility_reminder_engine",
            "retry_count": 0
        }
    }

    return payload
