# Flirting Agent - Project Summary

## 🎯 Project Overview
A sophisticated AI-powered user engagement and retention system that uses intelligent messaging to re-engage dormant users and prevent churn. The system includes utility messaging (reminders, broadcasts) and a comprehensive notification system with real-time updates.

---

## 🏗️ Architecture

### **Backend (FastAPI + SQLAlchemy)**
- RESTful API for user management and messaging
- SQLite database for user tracking and message logs
- Intelligent engagement algorithms based on user segments and churn risk

### **Frontend (React + Vite + TypeScript + Shadcn UI)**
- Modern, responsive dark-mode UI
- Real-time notification system with toast popups and notification center
- Dashboard for monitoring users and triggering notifications

---

## 📂 Key Files and What You Built

### **Backend Files**

#### 1. **`backend/app.py`** (295 lines)
**What it does:**
- Main FastAPI application with all API endpoints
- User management (create, read, update activity)
- Engagement cycle logic for sending flirting messages
- Utility messaging endpoints (reminders, broadcasts)
- Message polling endpoint for frontend

**Key Features:**
- `/users/` - Create and list users
- `/users/{user_id}/activity` - Log user activity
- `/engagement/run-cycle` - Trigger AI engagement messages
- `/utility/send-reminder` - Send personalized reminders
- `/utility/broadcast` - Send mass broadcasts
- `/messages/poll` - Poll for new messages

#### 2. **`backend/models.py`** (50+ lines)
**What it does:**
- SQLAlchemy ORM models for database tables
- User model with churn risk tracking
- MessageLog model for all sent messages

**Key Fields:**
- User: name, email, phone, segment, churn_risk_score, last_active_at
- MessageLog: user_id, type, content, channel, timestamp

#### 3. **`backend/schemas.py`** (50+ lines)
**What it does:**
- Pydantic schemas for request/response validation
- Type-safe API contracts

**Key Schemas:**
- UserCreate, UserResponse
- MessageLog
- UtilityReminderRequest
- BroadcastRequest

#### 4. **`backend/database.py`**
**What it does:**
- Database connection and session management
- SQLite setup with SQLAlchemy

#### 5. **`utility_messaging/reminders.py`** (143 lines)
**What it does:**
- Smart reminder system with templates
- User opt-out checking
- Cooldown period management
- Channel selection (SMS, email, push)

**Reminder Types:**
- Appointment reminders
- Payment due notifications
- Subscription expiry alerts
- Cart abandonment reminders

#### 6. **`utility_messaging/broadcasts.py`** (128 lines)
**What it does:**
- Mass broadcast system for all users
- Priority-based message templates
- Multi-channel delivery

**Broadcast Types:**
- System updates
- Policy changes
- Maintenance alerts
- Feature releases

#### 7. **`client_engagement/brand_voice.py`** (100+ lines)
**What it does:**
- AI-powered flirting message generation
- Segment-specific messaging strategies
- Personalized content based on user behavior

**Engagement Strategies:**
- Dormant users: Re-engagement messages
- Loyal users: Appreciation messages
- Active users: Feature highlights

---

### **Frontend Files**

#### 8. **`frontend/src/pages/FlirtingAgentMockup.tsx`** (260+ lines)
**What it does:**
- Main dashboard for monitoring users
- User cards showing segment, churn risk, last active time
- Notification testing center with buttons to trigger all notification types
- Dark mode UI matching the homepage

**Key Features:**
- Display all users with their activity status
- "High Risk" badges for users with churn_risk > 0.7
- Buttons to simulate user login
- Buttons to send utility reminders
- Notification Testing Center with 8 different notification types:
  - 4 Broadcast types (System Update, Policy Update, Maintenance, Feature Release)
  - 4 Reminder types (Appointment, Payment Due, Subscription, Cart Reminder)

#### 9. **`frontend/src/components/NotificationFeed.tsx`** (103 lines)
**What it does:**
- Polls backend every 3 seconds for new messages
- Triggers toast notifications for new messages
- Adds notifications to the notification center (bell icon)
- Handles different message types (engagement, utility, broadcast)

**Key Features:**
- Automatic polling with cleanup
- Different styling for different notification types
- Integration with useNotifications hook

#### 10. **`frontend/src/components/notifications/NotificationCenter.tsx`** (182 lines)
**What it does:**
- Bell icon with unread count badge
- Dropdown panel showing all notifications
- Sound toggle, mark all as read, clear all buttons
- Scrollable notification list

**Key Features:**
- Larger panel size (384px wide, 400px tall)
- Text wrapping to prevent truncation
- Different icons for different notification types
- Timestamps with relative time ("2 minutes ago")

#### 11. **`frontend/src/hooks/useNotifications.tsx`** (176 lines)
**What it does:**
- Global notification state management
- Sound effects for different notification types
- Toast integration
- Notification persistence (keeps last 50)

**Key Features:**
- Add, read, clear notifications
- Unread count tracking
- Sound toggle
- Type-safe notification handling

#### 12. **`frontend/src/components/ui/toast.tsx`** (112 lines)
**What it does:**
- Toast notification component with proper styling
- Visible text colors for dark backgrounds
- Animations for show/hide

**Improvements Made:**
- Added explicit text colors (text-purple-900, text-blue-900, etc.)
- Border styling with colored left border
- Text inheritance for better visibility

#### 13. **`frontend/src/lib/api.ts`** (35 lines)
**What it does:**
- API client configuration
- Endpoint definitions
- Fetch wrappers for GET/POST requests

**Endpoints:**
- User management
- Engagement cycle
- Utility messaging (reminders, broadcasts)
- Message polling

---

### **Database & Seed Scripts**

#### 14. **`seed_users.py`** (150+ lines)
**What it does:**
- Populates database with 12 diverse test users
- Different activity patterns (active to 60 days inactive)
- Different segments (loyal, active, dormant)
- Different churn risk scores (0.1 to 0.95)

**User Categories:**
- Active users (0-3 days inactive): 4 users
- Moderately inactive (4-7 days): 2 users
- Inactive (1-2 weeks): 2 users
- Very inactive (2-4 weeks): 2 users
- Almost churned (1+ months): 2 users

#### 15. **`flirting_agent.db`** (SQLite Database)
**What it contains:**
- 15 users with realistic data
- Message logs for all sent notifications
- Tracks user segments and churn risk

---

## 🎨 UI/UX Features You Built

### **Dark Mode Dashboard**
- Consistent dark theme (slate-900 background)
- Light text for readability
- Color-coded notification buttons
- Glassmorphism effects

### **Notification System**
- **Toast Notifications**: Bottom-right popup with colored backgrounds
  - Purple for flirting messages
  - Blue for system updates
  - Green for reminders
- **Notification Center**: Bell icon with badge
  - Larger panel (384px × 400px)
  - Full text visibility (no truncation)
  - Scrollable list
  - Sound toggle, mark all read, clear all

### **User Cards**
- Display user name, segment, last active time
- "High Risk" badge for churn risk > 0.7
- Action buttons (Simulate Login, Send Utility)
- Hover effects and transitions

---

## 🔧 Technical Implementation Highlights

### **1. Real-time Polling System**
- Frontend polls backend every 3 seconds
- Tracks last seen message ID to avoid duplicates
- Automatic cleanup on component unmount

### **2. Multi-channel Messaging**
- SMS, Email, Push notification support
- Channel selection based on user preferences and message urgency

### **3. Intelligent Engagement**
- Segment-based targeting (loyal, active, dormant)
- Churn risk scoring (0.0 to 1.0)
- Cooldown periods to prevent spam

### **4. Type Safety**
- TypeScript on frontend
- Pydantic schemas on backend
- Full type checking across the stack

### **5. Responsive Design**
- Mobile-friendly grid layouts
- Responsive notification panel
- Adaptive button sizing

---

## 📊 Testing & Demonstration

### **How to Demo the Project:**

1. **Start the servers:**
   ```bash
   # Backend
   source venv/bin/activate && python -m uvicorn backend.app:app --reload --port 8000
   
   # Frontend
   cd frontend && npm run dev
   ```

2. **View the Dashboard:**
   - Go to http://localhost:8082/dashboard
   - See all 15 users with different activity levels
   - Notice "High Risk" badges on dormant users

3. **Test Notifications:**
   - Click any button in the "Notification Testing Center"
   - Go to http://localhost:8082/ (homepage)
   - Wait 3 seconds for polling
   - See toast notification appear in bottom-right
   - Click bell icon to see notification in panel

4. **Test User Activity:**
   - Click "Simulate Login" on any user
   - Watch their last active time update
   - See their churn risk decrease

5. **Test Engagement Cycle:**
   - Click "❤️ Run Flirting Cycle" button
   - System sends personalized messages to dormant users
   - Check notifications on homepage

---

## 🎯 Key Achievements

✅ **Full-stack application** with FastAPI backend and React frontend  
✅ **Real-time notification system** with polling and toast popups  
✅ **Intelligent user segmentation** based on activity and churn risk  
✅ **Multi-type messaging system** (engagement, reminders, broadcasts)  
✅ **Dark mode UI** with modern design aesthetics  
✅ **Type-safe architecture** with TypeScript and Pydantic  
✅ **Database persistence** with SQLAlchemy ORM  
✅ **Scalable notification center** with sound effects and controls  
✅ **Comprehensive testing interface** for all notification types  
✅ **Diverse test data** with 15 realistic user profiles  

---

## 📈 Potential Extensions

- Add email/SMS integration with Twilio/SendGrid
- Implement A/B testing for message templates
- Add analytics dashboard for engagement metrics
- Create scheduled jobs for automated engagement cycles
- Add user preferences for notification channels
- Implement machine learning for churn prediction

---

## 🛠️ Technologies Used

**Backend:**
- Python 3.11
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite

**Frontend:**
- React 18
- TypeScript
- Vite
- Shadcn UI
- Tailwind CSS
- Lucide Icons
- date-fns

**Tools:**
- Git for version control
- npm for package management
- uvicorn for ASGI server

---

## 📝 Summary

This project demonstrates a complete user engagement and retention system with:
- **15 key files** across backend and frontend
- **2000+ lines of code** written
- **Full-stack integration** with REST API
- **Real-time features** with polling and notifications
- **Modern UI/UX** with dark mode and animations
- **Production-ready architecture** with proper separation of concerns

The system successfully tracks user activity, identifies churn risk, and sends targeted messages to re-engage users through multiple channels.
