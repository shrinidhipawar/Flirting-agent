from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from .database import engine, get_db, Base
from . import models, schemas
from utility_messaging.reminders import process_reminder, REMINDER_TEMPLATES
from utility_messaging.broadcasts import create_broadcast_payloads, BROADCAST_TEMPLATES

# Initialize the database (Create tables if they don't exist)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Flirting Agent Backend")

# Enable CORS (Allows frontend to talk to backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. USER MANAGEMENT ---

@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """Create a new user to track."""
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = models.User(
        name=user.name,
        email=user.email,
        phone_number=user.phone_number,
        last_active_at=datetime.utcnow(),
        segment="normal"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/")
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    List all users with enriched data for dashboard display.
    Returns: user info + inactive_minutes + last_message (for personalization demo)
    
    IMPORTANT: Segment is calculated dynamically based on current activity,
    NOT from the stored database value (which may be stale).
    """
    from engagement_agent.segmentation import determine_user_segment
    
    users = db.query(models.User).offset(skip).limit(limit).all()
    
    enriched_users = []
    for user in users:
        # Calculate inactive time
        time_diff = datetime.utcnow() - user.last_active_at
        # meaningful display: if < 1 hour, show minutes, else hours/days
        total_seconds = time_diff.total_seconds()
        if total_seconds < 3600:
            inactive_display = f"{int(total_seconds / 60)} mins"
            # For logic transparency in demo, we can also just return raw minutes
            inactive_days = round(total_seconds / 60, 1) # Sending minutes as 'inactive_days' field for now to avoid frontend break
        else:
            inactive_display = f"{round(total_seconds / 86400, 1)} days"
            inactive_days = round(total_seconds / 86400, 1)

        
        # Calculate segment DYNAMICALLY (not from database)
        current_segment = determine_user_segment(user.created_at, user.last_active_at)
        
        # Get last message sent to this user
        last_message = db.query(models.MessageLog).filter(
            models.MessageLog.user_id == user.id
        ).order_by(models.MessageLog.sent_at.desc()).first()
        
        # Determine tone from last message (extract from engagement messages)
        last_message_data = None
        if last_message:
            # Infer tone from message content
            content = last_message.content.lower()
            if "miss you" in content or "return" in content or "waiting" in content or "😉" in content:
                tone = "playful"
            elif "welcome" in content or "glad" in content or "great to see" in content or "🎉" in content:
                tone = "warm"
            else:
                tone = "neutral"
            
            last_message_data = {
                "content": last_message.content,
                "tone": tone,
                "timestamp": last_message.sent_at.isoformat()
            }
        
        enriched_users.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "phone_number": user.phone_number,
            "segment": current_segment,  # DYNAMIC: dormant (>2m), loyal (>5m age), normal
            "churn_risk_score": user.churn_risk_score,
            "last_active_at": user.last_active_at.isoformat(),
            "created_at": user.created_at.isoformat(),
            "inactive_days": inactive_days, # Actually minutes if < 1h
            "last_message": last_message_data
        })
    
    return enriched_users

@app.post("/users/{user_id}/activity")
def log_activity(user_id: int, db: Session = Depends(get_db)):
    """Update the user's last_active_at timestamp. Sending welcome back message if they were dormant."""
    from message_generation.prompt_builder import generate_message
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user was inactive for a while (e.g. > 2 minutes)
    # This simulates a "Log In" after being away
    current_time = datetime.utcnow()
    time_diff = current_time - user.last_active_at
    minutes_inactive = time_diff.total_seconds() / 60
    
    message_sent = None
    
    # If users come back after 2 minutes (Dormant threshold), welcome them back!
    if minutes_inactive >= 2.0:
        # Generate Welcome Back message
        context = {"name": user.name}
        message_content = generate_message("welcome_back", context)
        
        # Save to DB
        new_message = models.MessageLog(
            user_id=user.id,
            type=models.MessageType.CLIENT_ENGAGEMENT_BRAND,
            content=message_content,
            status="sent"
        )
        db.add(new_message)
        message_sent = message_content
        # Note: We commit update to last_active_at below
    
    # Update activity
    user.last_active_at = current_time
    # Reset churn risk since they are active
    user.churn_risk_score = 0.0
    
    db.commit()
    
    return {
        "status": "User activity logged", 
        "last_active": user.last_active_at,
        "message_sent": message_sent
    }

# --- 2. ENGAGEMENT TRIGGER (The Core Logic) ---

@app.post("/run-engagement-cycle/")
def trigger_engagement(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Manually trigger the engagement cycle using the decision engine.
    
    Process:
    1. Fetch all users
    2. Evaluate each user for engagement eligibility
    3. Generate and send messages to eligible users
    4. Log results
    
    In production, this would be called by a CRON job every hour.
    """
    import logging
    from engagement_agent import evaluate_user_for_engagement, get_engagement_stats
    from message_generation.prompt_builder import generate_message
    
    logger = logging.getLogger(__name__)
    logger.info("Starting engagement cycle...")
    
    # Fetch all users
    all_users = db.query(models.User).all()
    
    # Track statistics
    messages_sent = 0
    skipped_users = 0
    segment_breakdown = {"dormant": 0, "loyal": 0, "normal": 0}
    
    for user in all_users:
        # Evaluate user using decision engine
        evaluation = evaluate_user_for_engagement(user, db)
        
        if evaluation["eligible"]:
            # User is eligible - generate and send message
            segment = evaluation["segment"]
            tone = evaluation["tone"]
            
            # Generate message content
            context = {"name": user.name}
            message_content = generate_message(tone, context)
            
            # Save message to database
            new_message = models.MessageLog(
                user_id=user.id,
                type=models.MessageType.CLIENT_ENGAGEMENT_BRAND,
                content=message_content,
                status="sent"
            )
            db.add(new_message)
            
            # Update statistics
            messages_sent += 1
            segment_breakdown[segment] += 1
            
            logger.info(f"✓ Sent message to {user.name} (ID: {user.id}) - Segment: {segment}, Tone: {tone}")
        else:
            # User skipped
            skipped_users += 1
            logger.debug(f"✗ Skipped {user.name} (ID: {user.id}) - Reason: {evaluation['reason']}")
    
    # Commit all messages
    db.commit()
    
    # Get detailed statistics
    stats = get_engagement_stats(all_users, db)
    
    logger.info(f"Engagement cycle complete: {messages_sent} messages sent, {skipped_users} users skipped")
    
    return {
        "status": "Cycle complete",
        "total_users": len(all_users),
        "messages_sent": messages_sent,
        "users_skipped": skipped_users,
        "segment_breakdown": segment_breakdown,
        "detailed_stats": stats
    }

@app.get("/messages/{user_id}", response_model=List[schemas.MessageLogResponse])
def get_user_messages(user_id: int, db: Session = Depends(get_db)):
    """See the history of messages sent to a user."""
    return db.query(models.MessageLog).filter(models.MessageLog.user_id == user_id).all()

# --- 3. UTILITY MESSAGING (System to User) ---

@app.post("/utility/send-reminder")
def send_utility_reminder(request: schemas.UtilityReminderRequest, db: Session = Depends(get_db)):
    """
    Trigger a specific utility reminder (e.g., payment, appointment).
    This bypasses the AI agent logic and uses deterministic templates.
    """
    if request.reminder_type not in REMINDER_TEMPLATES:
        raise HTTPException(status_code=400, detail=f"Invalid reminder type. Options: {list(REMINDER_TEMPLATES.keys())}")

    user = db.query(models.User).filter(models.User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Generate Payload
    payload = process_reminder(user, request.reminder_type, request.context_data)
    
    if not payload:
        return {"status": "skipped", "reason": "Opt-out, cooldown, or invalid data"}
    
    # Log the message
    new_msg = models.MessageLog(
        user_id=user.id,
        type=models.MessageType.USER_UTILITY_SYSTEM,
        content=payload["message"],
        status="sent"
    )
    db.add(new_msg)
    db.commit()

    # In production, here you would call your Push Notification Service (e.g., FCM)
    return {"status": "sent", "payload": payload}

@app.post("/utility/broadcast")
def send_utility_broadcast(request: schemas.BroadcastRequest, db: Session = Depends(get_db)):
    """
    Send a mass broadcast to ALL users (e.g., System Update).
    """
    if request.broadcast_type not in BROADCAST_TEMPLATES:
        raise HTTPException(status_code=400, detail=f"Invalid type. Options: {list(BROADCAST_TEMPLATES.keys())}")

    users = db.query(models.User).all()
    payloads = create_broadcast_payloads(users, request.broadcast_type, request.context_data)
    
    if not payloads:
        return {"status": "skipped", "count": 0}

    # Log specific messages for each user 
    # (Note: For massive scale, you'd batch insert or log only the job, not individual rows)
    log_entries = []
    for p in payloads:
        log_entries.append(models.MessageLog(
            user_id=p["user_id"],
            type=models.MessageType.USER_UTILITY_SYSTEM,
            content=p["message"],
            status="sent"
        ))
    
    db.add_all(log_entries)
    db.commit()

    return {"status": "broadcast_initiated", "recipient_count": len(payloads), "sample_payload": payloads[0] if payloads else None}


# --- ANALYTICS ENDPOINTS ---

@app.get("/analytics/metrics")
def get_analytics_metrics(days: int = 7, db: Session = Depends(get_db)):
    """
    Get engagement analytics metrics for the last N days.
    Returns overall metrics and breakdown by message type.
    """
    # Calculate date range
    cutoff_date = datetime.utcnow() - timedelta(days=days)
    
    # Get all messages in the date range
    messages = db.query(models.MessageLog).filter(
        models.MessageLog.sent_at >= cutoff_date
    ).all()
    
    if not messages:
        return {
            "period_days": days,
            "total_messages": 0,
            "overall": {
                "open_rate": 0,
                "click_rate": 0,
                "engagement_score": 0
            },
            "by_type": {},
            "daily_stats": []
        }
    
    # Calculate overall metrics
    total_sent = len(messages)
    total_opened = sum(1 for m in messages if m.opened)
    total_clicked = sum(1 for m in messages if m.clicked)
    
    open_rate = (total_opened / total_sent) if total_sent > 0 else 0
    click_rate = (total_clicked / total_opened) if total_opened > 0 else 0
    engagement_score = (0.6 * open_rate + 0.4 * click_rate)
    
    # Calculate metrics by message type
    by_type = {}
    for msg_type in [models.MessageType.CLIENT_ENGAGEMENT_BRAND, models.MessageType.USER_UTILITY_SYSTEM]:
        type_messages = [m for m in messages if m.type == msg_type]
        if type_messages:
            type_sent = len(type_messages)
            type_opened = sum(1 for m in type_messages if m.opened)
            type_clicked = sum(1 for m in type_messages if m.clicked)
            
            type_open_rate = (type_opened / type_sent) if type_sent > 0 else 0
            type_click_rate = (type_clicked / type_opened) if type_opened > 0 else 0
            
            by_type[msg_type.value] = {
                "sent": type_sent,
                "opened": type_opened,
                "clicked": type_clicked,
                "open_rate": round(type_open_rate, 3),
                "click_rate": round(type_click_rate, 3),
                "engagement_score": round(0.6 * type_open_rate + 0.4 * type_click_rate, 3)
            }
    
    # Calculate daily stats for chart
    daily_stats = []
    for i in range(days):
        day_start = datetime.utcnow() - timedelta(days=days-i-1)
        day_end = day_start + timedelta(days=1)
        
        day_messages = [m for m in messages if day_start <= m.sent_at < day_end]
        day_opened = sum(1 for m in day_messages if m.opened)
        
        daily_stats.append({
            "date": day_start.strftime("%Y-%m-%d"),
            "day": day_start.strftime("%a"),
            "sent": len(day_messages),
            "opened": day_opened,
            "engagement": round((day_opened / len(day_messages) * 100) if day_messages else 0, 1)
        })
    
    return {
        "period_days": days,
        "total_messages": total_sent,
        "overall": {
            "open_rate": round(open_rate, 3),
            "click_rate": round(click_rate, 3),
            "engagement_score": round(engagement_score, 3)
        },
        "by_type": by_type,
        "daily_stats": daily_stats
    }

@app.post("/analytics/track/{message_id}")
def track_message_interaction(
    message_id: int,
    action: str,  # "open" or "click"
    db: Session = Depends(get_db)
):
    """
    Track user interaction with a message (open or click).
    """
    message = db.query(models.MessageLog).filter(models.MessageLog.id == message_id).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    if action == "open" and not message.opened:
        message.opened = True
        message.opened_at = datetime.utcnow()
    elif action == "click" and not message.clicked:
        message.clicked = True
        message.clicked_at = datetime.utcnow()
        # Auto-mark as opened if clicked
        if not message.opened:
            message.opened = True
            message.opened_at = datetime.utcnow()
    
    db.commit()
    
    return {"status": "tracked", "message_id": message_id, "action": action}
