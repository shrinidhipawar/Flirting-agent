# 🎬 Quick Demo Guide - Engagement Engine

## Before Each Demo

**IMPORTANT:** Run this command before EVERY demo:

```bash
python3 reset_demo.py
```

This will:
- ✅ Clear all old messages
- ✅ Make all users inactive (ready for engagement)
- ✅ Ensure messages WILL be sent

---

## Demo Flow (3 minutes)

### **Step 1: Reset (30 seconds)**
```bash
python3 reset_demo.py
```

Expected output:
```
✓ Cleared XX old messages
✓ Made 15 users inactive
✅ Demo reset complete!
```

### **Step 2: Show Dashboard (30 seconds)**

Open: http://localhost:8082/dashboard

**Point out:**
- 15 user cards with different segments
- "❤️ Run Flirting Cycle" button
- High Risk badges on dormant users

### **Step 3: Trigger Engagement (1 minute)**

**Option A: Click button on dashboard**
- Click "❤️ Run Flirting Cycle"
- Show the response in browser console

**Option B: Use curl command**
```bash
curl -X POST http://127.0.0.1:8000/run-engagement-cycle/ | python3 -m json.tool
```

**Expected output:**
```json
{
  "status": "Cycle complete",
  "total_users": 15,
  "messages_sent": 15,
  "segment_breakdown": {
    "dormant": 5,
    "normal": 10
  }
}
```

### **Step 4: Show Generated Messages (1 minute)**

```bash
sqlite3 flirting_agent.db "SELECT u.name, u.segment, m.content FROM message_logs m JOIN users u ON m.user_id = u.id LIMIT 10;"
```

**Point out:**
- Dormant users get playful messages: "Hey {name}, we miss you! 😉"
- Normal users get neutral messages: "Hi {name}, just checking in! 👋"

---

## Quick Commands Reference

### Reset for demo:
```bash
python3 reset_demo.py
```

### Trigger engagement:
```bash
curl -X POST http://127.0.0.1:8000/run-engagement-cycle/ | python3 -m json.tool
```

### Show messages:
```bash
sqlite3 flirting_agent.db "SELECT u.name, u.segment, m.content FROM message_logs m JOIN users u ON m.user_id = u.id;"
```

### Show user stats:
```bash
sqlite3 flirting_agent.db "SELECT name, segment, churn_risk_score, last_active_at FROM users;"
```

---

## Talking Points

### "What does it do?"
> "It's an engagement decision engine that evaluates users, segments them based on activity, and sends personalized messages with appropriate tones."

### "How does it work?"
> "It checks if users are inactive, ensures we don't spam them with frequency control, segments them into categories, and generates personalized messages."

### "What's special?"
> "Clean separation of concerns - decision logic is separate from message generation. It's type-safe, well-documented, and production-ready."

### "Show me the code"
> "Sure! The decision engine is in `engagement_agent/`, message generation is in `message_generation/`, and they integrate in the API endpoint."

---

## Files to Show

1. **`engagement_agent/decision_logic.py`** - Core decision engine (175 lines)
2. **`engagement_agent/segmentation.py`** - Segmentation rules (95 lines)
3. **`message_generation/prompt_builder.py`** - Message templates (60 lines)
4. **`backend/app.py`** (lines 68-143) - API integration

---

## Troubleshooting

### "No messages sent"?
**Solution:** Run `python3 reset_demo.py` before each demo!

### Backend not running?
```bash
source venv/bin/activate
python -m uvicorn backend.app:app --reload --port 8000
```

### Frontend not running?
```bash
cd frontend && npm run dev
```

---

## Multiple Demos Workflow

```bash
# Demo 1
python3 reset_demo.py
curl -X POST http://127.0.0.1:8000/run-engagement-cycle/

# Demo 2 (later)
python3 reset_demo.py  # ← IMPORTANT!
curl -X POST http://127.0.0.1:8000/run-engagement-cycle/

# Demo 3 (later)
python3 reset_demo.py  # ← IMPORTANT!
curl -X POST http://127.0.0.1:8000/run-engagement-cycle/
```

**Always reset between demos!** 🔄
