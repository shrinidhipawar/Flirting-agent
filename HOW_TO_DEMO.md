# 🎯 How to Demo the Engagement Engine

## Quick Demo (Recommended)

### 1. Start the Backend
```bash
source venv/bin/activate
python -m uvicorn backend.app:app --reload --port 8000
```

### 2. Run the Interactive Demo Script
```bash
python3 demo_engagement_engine.py
```

**What it shows:**
- ✅ All users in the database
- ✅ Engagement cycle execution
- ✅ Segment breakdown (dormant/new_user/normal)
- ✅ Sample generated messages with tones
- ✅ Detailed analytics and statistics

---

## Manual Demo (For Detailed Walkthrough)

### Step 1: Show the Users
```bash
curl http://127.0.0.1:8000/users/ | python3 -m json.tool
```

**Explain:** "We have 15 users with different activity patterns"

### Step 2: Trigger Engagement Cycle
```bash
curl -X POST http://127.0.0.1:8000/run-engagement-cycle/ | python3 -m json.tool
```

**Explain:** "The decision engine evaluates each user and decides who gets a message"

**Point out:**
- Total users evaluated
- Messages sent
- Segment breakdown (dormant → playful, normal → neutral)

### Step 3: Show Generated Messages
```bash
sqlite3 flirting_agent.db "SELECT u.name, u.segment, m.content FROM message_logs m JOIN users u ON m.user_id = u.id LIMIT 10;"
```

**Explain:** "Notice how dormant users get playful messages, normal users get neutral ones"

### Step 4: Show the Code

**Open these files to show clean architecture:**

1. **`engagement_agent/decision_logic.py`**
   - Point out: `evaluate_user_for_engagement()` function
   - Show: Inactivity check, frequency control, segmentation

2. **`engagement_agent/segmentation.py`**
   - Point out: Rule-based segmentation logic
   - Show: Tone mapping (dormant→playful, new_user→warm, normal→neutral)

3. **`message_generation/prompt_builder.py`**
   - Point out: Message templates by tone
   - Show: Separation of decision logic from message generation

4. **`backend/app.py`** (lines 68-143)
   - Point out: Clean integration of decision engine
   - Show: Loop through users, evaluate, generate, save

---

## Key Points to Emphasize

### 🎯 Clean Architecture
```
Decision Logic (engagement_agent)
    ↓ Returns: eligible, segment, tone
Message Generation (message_generation)
    ↓ Returns: message content
API Endpoint (backend/app.py)
    ↓ Orchestrates everything
```

### ✅ Features Working
- **Inactivity Check**: 60 seconds threshold (configurable)
- **Frequency Control**: Won't spam (24 hour limit)
- **Segmentation**: dormant/new_user/normal
- **Tone Mapping**: playful/warm/neutral
- **Logging**: Comprehensive logs for debugging
- **Analytics**: Detailed statistics

### 📊 Example Output
```json
{
  "status": "Cycle complete",
  "total_users": 15,
  "messages_sent": 15,
  "segment_breakdown": {
    "dormant": 5,
    "new_user": 0,
    "normal": 10
  }
}
```

---

## Common Demo Scenarios

### Scenario 1: "Show me the decision logic"
```bash
# Open the file
code engagement_agent/decision_logic.py

# Point to evaluate_user_for_engagement() function
# Explain the flow: inactivity → frequency → segmentation → tone
```

### Scenario 2: "How does segmentation work?"
```bash
# Open the file
code engagement_agent/segmentation.py

# Show the rules:
# - inactive >= 3 days → dormant
# - account age < 1 day → new_user
# - else → normal
```

### Scenario 3: "Show me the messages"
```bash
# Query the database
sqlite3 flirting_agent.db "
SELECT 
    u.name,
    u.segment,
    m.content
FROM message_logs m
JOIN users u ON m.user_id = u.id
ORDER BY u.segment, u.id
LIMIT 15;
"
```

### Scenario 4: "What if I run it again?"
```bash
# Run it again immediately
curl -X POST http://127.0.0.1:8000/run-engagement-cycle/ | python3 -m json.tool

# Show: messages_sent: 0 (frequency control working!)
# Explain: Won't spam users - 24 hour cooldown
```

---

## Troubleshooting

### No messages sent?
**Check:**
1. Are users inactive? (threshold is 60 seconds for testing)
2. Were they messaged in last 24 hours?

**Fix:**
```bash
# Make users inactive
sqlite3 flirting_agent.db "UPDATE users SET last_active_at = datetime('now', '-2 minutes');"

# Clear old messages
sqlite3 flirting_agent.db "DELETE FROM message_logs;"

# Try again
curl -X POST http://127.0.0.1:8000/run-engagement-cycle/
```

### Backend not running?
```bash
# Start it
source venv/bin/activate
python -m uvicorn backend.app:app --reload --port 8000
```

---

## Quick Talking Points

**"What did you build?"**
> "A clean, modular engagement decision engine that evaluates users, segments them based on activity, and sends personalized messages with appropriate tones."

**"What's special about it?"**
> "It has clean separation of concerns - decision logic is completely separate from message generation. It's type-safe, well-documented, and production-ready."

**"How does it work?"**
> "It checks if users are inactive, ensures we don't spam them, segments them into categories, assigns appropriate tones, and generates personalized messages."

**"Show me the code"**
> "Sure! The decision engine is in `engagement_agent/`, message generation is in `message_generation/`, and they're integrated in the API endpoint."

---

## Files to Show

1. **`engagement_agent/decision_logic.py`** - Core decision engine
2. **`engagement_agent/segmentation.py`** - Segmentation rules
3. **`message_generation/prompt_builder.py`** - Message templates
4. **`backend/app.py`** - API integration
5. **`demo_engagement_engine.py`** - Interactive demo

---

## One-Liner Demo

```bash
python3 demo_engagement_engine.py
```

That's it! Press ENTER at each step to walk through the demo. 🚀
