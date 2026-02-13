# Backend Implementation Plan

## 1. Tech Stack
- **Language:** Python 3.x
- **Framework:** FastAPI (Recommended) or Flask. 
  - *Why FastAPI?* It's faster, has built-in documentation (Swagger UI), and handles asynchronous tasks (like sending emails/notifications) better.
- **Database:** SQLite (for development) -> PostgreSQL (production).
- **ORM:** SQLAlchemy (for managing database tables).

## 2. Database Schema Design (The Foundation)
You need to store user data and message history to make smart decisions.

### Table: `Users`
| Field | Type | Purpose |
| :--- | :--- | :--- |
| `id` | Integer | Unique ID |
| `name` | String | For personalization ("Hey *Shrinidhi*...") |
| `phone_number` | String | Delivery destination |
| `last_active_at` | DateTime | **CRITICAL**. Used to calculate "Days Inactive". |
| `segment` | String | E.g., "Frequent Buyer", "Night Owl" (calculated by `engagement_agent`). |
| `churn_risk_score` | Float | 0.0 to 1.0. How likely are they to leave? |

### Table: `MessageLogs`
| Field | Type | Purpose |
| :--- | :--- | :--- |
| `id` | Integer | Unique ID |
| `user_id` | Integer | Who got the message? |
| `type` | Enum | `CLIENT_ENGAGEMENT` (Flirt) or `USER_UTILITY` (Info) |
| `content` | Text | What was said? |
| `sent_at` | DateTime | To prevent spamming (Frequency Capping). |
| `status` | String | `sent`, `delivered`, `clicked`. |

## 3. API Architecture
The backend will expose endpoints for the frontend/app to report activity and for the scheduler to trigger checks.

### A. Activity Tracking (The "Sensors")
- `POST /api/v1/activity/login`: Updates `User.last_active_at`.
- `POST /api/v1/activity/event`: Log specific actions (e.g., "viewed_menu").

### B. The Engagement Trigger (The "Brain")
- `POST /api/v1/cron/run-engagement`: 
  - This is the endpoint a scheduler (like Cron or Celery) hits every hour.
  - **Logic:**
    1. Query `Users` where `last_active_at` > 7 days.
    2. Filter out users messaged in the last 24 hours (check `MessageLogs`).
    3. Loop through remaining users -> Call `engagement_agent/decision_logic.py`.
    4. Save result to `MessageLogs`.

### C. Utility Messaging (The "Tool")
- `POST /api/v1/send-utility`:
  - **Payload:** `{ "user_id": 123, "type": "appointment_reminder", "data": { "time": "10am" } }`
  - **Logic:** Directly calls `utility_messaging/reminders.py`. No AI, no probability checks. Just send.

## 4. Implementation Steps

### Step 1: Setup & Models
- Initialize FastAPI project in `backend/`.
- Create `backend/database.py` (connection).
- Create `backend/models.py` (User, MessageLog classes).

### Step 2: Ingest Data
- Create endpoints to create users and update their `last_active_at` timestamp.
- *Test:* Create a user, wait 5 mins, checks database.

### Step 3: The "Flirting" Logic Integration
- Write a function in `backend/app.py` that queries "dormant" users.
- Import your logic: `from engagement_agent.decision_logic import assess_user`.
- Pass the user object to `assess_user`.
- If it returns a message, save to DB and print "NOTIFICATION SENT: [Message]".

### Step 4: Utility Messaging
- Implement the "boring" endpoints that skip the AI logic and just trigger `utility_messaging` functions.

## 5. Directory Refinement
```
backend/
├── app.py              # Main FastAPI app
├── database.py         # DB connection
├── models.py           # SQLAlchemy tables
├── schemas.py          # Pydantic models (validation)
├── routes/
│   ├── engagement.py   # Checks & "Flirting" endpoints
│   └── utility.py      # Standard notifications
```
