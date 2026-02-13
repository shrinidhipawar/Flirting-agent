# Engagement Agent Module

A clean, modular decision engine for user engagement in the Flirting Agent system.

## 📋 Overview

This module is responsible for **decision-making only**. It does NOT:
- Generate message content
- Save to database
- Make API calls
- Handle routing

It ONLY:
- Evaluates user eligibility for engagement
- Determines user segments
- Maps segments to message tones
- Returns decision data

## 🏗️ Architecture

```
engagement_agent/
├── __init__.py           # Package exports
├── decision_logic.py     # Core decision engine
├── segmentation.py       # User segmentation rules
└── README.md            # This file
```

## 📊 Decision Flow

```
User → Inactivity Check → Frequency Check → Segmentation → Tone Mapping → Decision
         ↓ Active              ↓ Recently                ↓                    ↓
       SKIP                  SKIP                   dormant/new/normal    playful/warm/neutral
                                                          ↓
                                                      ELIGIBLE
```

## 🔧 Configuration

### Thresholds (in `decision_logic.py`)

```python
INACTIVITY_THRESHOLD_SECONDS = 60  # User must be inactive for 60 seconds
MESSAGE_FREQUENCY_HOURS = 24       # Don't message within 24 hours
```

### Segmentation Rules (in `segmentation.py`)

```python
DORMANT_THRESHOLD_DAYS = 3    # Inactive for 3+ days → dormant
NEW_USER_THRESHOLD_DAYS = 1   # Account age < 1 day → new_user
```

## 📝 Usage

### Basic Evaluation

```python
from engagement_agent import evaluate_user_for_engagement

# Evaluate a single user
result = evaluate_user_for_engagement(user, db_session)

# Result structure:
{
    "eligible": True/False,
    "segment": "dormant" | "new_user" | "normal",
    "tone": "playful" | "warm" | "neutral",
    "reason": "Explanation string"
}
```

### In the Engagement Endpoint

```python
@app.post("/run-engagement-cycle/")
def trigger_engagement(db: Session = Depends(get_db)):
    from engagement_agent import evaluate_user_for_engagement
    from message_generation.prompt_builder import generate_message
    
    all_users = db.query(User).all()
    
    for user in all_users:
        # 1. Evaluate eligibility
        evaluation = evaluate_user_for_engagement(user, db)
        
        if evaluation["eligible"]:
            # 2. Generate message
            context = {"name": user.name}
            message = generate_message(evaluation["tone"], context)
            
            # 3. Save to database
            new_msg = MessageLog(
                user_id=user.id,
                content=message,
                ...
            )
            db.add(new_msg)
    
    db.commit()
```

### Get Statistics

```python
from engagement_agent import get_engagement_stats

stats = get_engagement_stats(all_users, db_session)

# Returns:
{
    "total_users": 15,
    "eligible": 8,
    "skipped": 7,
    "by_segment": {
        "dormant": 5,
        "new_user": 2,
        "normal": 1
    },
    "skip_reasons": {
        "active": 4,
        "recently_messaged": 3
    }
}
```

## 🎯 Segmentation Logic

### Rule-Based Segmentation

| Condition | Segment | Tone | Use Case |
|-----------|---------|------|----------|
| Inactive ≥ 3 days | `dormant` | `playful` | Re-engagement |
| Account age < 1 day | `new_user` | `warm` | Onboarding |
| Otherwise | `normal` | `neutral` | Standard engagement |

### Examples

```python
from engagement_agent import determine_user_segment, get_tone_for_segment

# User inactive for 5 days
segment = determine_user_segment(created_at, last_active_at)
# → "dormant"

tone = get_tone_for_segment(segment)
# → "playful"
```

## 🔍 Decision Rules

### 1. Inactivity Check

```python
def is_user_inactive(last_active_at: datetime) -> bool:
    """User must be inactive for INACTIVITY_THRESHOLD_SECONDS"""
    current_time = datetime.utcnow()
    time_diff = current_time - last_active_at
    return time_diff.total_seconds() > INACTIVITY_THRESHOLD_SECONDS
```

**Result:**
- `True` → Continue to next check
- `False` → SKIP (user is active)

### 2. Frequency Control

```python
def check_message_frequency(user_id: int, db_session: Session) -> bool:
    """Check if user was messaged within MESSAGE_FREQUENCY_HOURS"""
    cutoff_time = datetime.utcnow() - timedelta(hours=MESSAGE_FREQUENCY_HOURS)
    recent_message = db_session.query(MessageLog).filter(
        MessageLog.user_id == user_id,
        MessageLog.sent_at >= cutoff_time
    ).first()
    return recent_message is not None
```

**Result:**
- `True` → SKIP (recently messaged)
- `False` → Continue to segmentation

### 3. Segmentation & Tone Mapping

```python
segment = determine_user_segment(user.created_at, user.last_active_at)
tone = get_tone_for_segment(segment)
```

**Result:** User is ELIGIBLE with determined segment and tone

## 📊 Logging

The module uses Python's `logging` module:

```python
import logging
logger = logging.getLogger(__name__)

# Log levels used:
logger.debug()  # Skipped users
logger.info()   # Eligible users, cycle completion
```

### Example Logs

```
INFO: Starting engagement cycle...
DEBUG: User 1 (Active Alice): Skipped - Currently active
DEBUG: User 2 (Daily Dan): Skipped - Recently messaged
INFO: User 3 (Ghost Gary): Eligible - Segment: dormant, Tone: playful
INFO: ✓ Sent message to Ghost Gary (ID: 3) - Segment: dormant, Tone: playful
INFO: Engagement cycle complete: 8 messages sent, 7 users skipped
```

## 🧪 Testing

### Test Inactivity (60 seconds for testing)

```python
# Create a user
user = User(
    name="Test User",
    created_at=datetime.utcnow(),
    last_active_at=datetime.utcnow() - timedelta(seconds=120)  # 2 minutes ago
)

# Check inactivity
is_inactive = is_user_inactive(user.last_active_at)
# → True (120 seconds > 60 seconds threshold)
```

### Test Segmentation

```python
# Dormant user (inactive 5 days)
created_at = datetime.utcnow() - timedelta(days=10)
last_active_at = datetime.utcnow() - timedelta(days=5)
segment = determine_user_segment(created_at, last_active_at)
# → "dormant"

# New user (created 12 hours ago)
created_at = datetime.utcnow() - timedelta(hours=12)
last_active_at = datetime.utcnow()
segment = determine_user_segment(created_at, last_active_at)
# → "new_user"
```

## 🔄 Integration with Message Generation

The decision engine works with the `message_generation` module:

```python
# 1. Decision engine determines eligibility and tone
evaluation = evaluate_user_for_engagement(user, db)

# 2. Message generator creates content based on tone
if evaluation["eligible"]:
    message = generate_message(
        tone=evaluation["tone"],
        context={"name": user.name}
    )
```

## 📈 Statistics & Monitoring

Use `get_engagement_stats()` for analytics:

```python
stats = get_engagement_stats(all_users, db)

print(f"Engagement Rate: {stats['eligible'] / stats['total_users'] * 100}%")
print(f"Dormant Users: {stats['by_segment']['dormant']}")
print(f"Skip Rate (Active): {stats['skip_reasons']['active']}")
```

## 🎨 Clean Code Principles

1. **Single Responsibility**: Each function does one thing
2. **No Side Effects**: Functions don't modify database
3. **Type Hints**: All functions have type annotations
4. **Documentation**: Comprehensive docstrings
5. **Logging**: Proper logging for debugging
6. **Modularity**: Easy to test and maintain

## 🚀 Production Considerations

### Adjust Thresholds for Production

```python
# In decision_logic.py
INACTIVITY_THRESHOLD_SECONDS = 86400  # 24 hours (not 60 seconds)
MESSAGE_FREQUENCY_HOURS = 24          # Keep at 24 hours
```

### Add Monitoring

```python
# Track engagement metrics
stats = get_engagement_stats(all_users, db)
send_to_monitoring_service(stats)
```

### Schedule with CRON

```bash
# Run engagement cycle every hour
0 * * * * curl -X POST http://localhost:8000/run-engagement-cycle/
```

## 📚 API Reference

### Functions

#### `evaluate_user_for_engagement(user, db_session) -> dict`
Main decision function. Returns eligibility decision with segment and tone.

#### `is_user_inactive(last_active_at) -> bool`
Checks if user exceeds inactivity threshold.

#### `check_message_frequency(user_id, db_session) -> bool`
Checks if user was recently messaged.

#### `determine_user_segment(created_at, last_active_at) -> str`
Categorizes user into segment based on activity.

#### `get_tone_for_segment(segment) -> str`
Maps segment to appropriate message tone.

#### `get_engagement_stats(users, db_session) -> dict`
Generates engagement statistics for analytics.

## 🐛 Troubleshooting

### Issue: All users marked as active

**Solution:** Check `INACTIVITY_THRESHOLD_SECONDS` - it's set to 60 seconds for testing. Adjust for production.

### Issue: No messages sent

**Solution:** Check:
1. Are users inactive?
2. Were they messaged in last 24 hours?
3. Check logs for skip reasons

### Issue: Wrong segment assigned

**Solution:** Verify `created_at` and `last_active_at` timestamps in database.

## 📄 License

Part of the Flirting Agent project.
