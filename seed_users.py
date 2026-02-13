"""
Seed script to populate the database with diverse test users
"""
import requests
from datetime import datetime, timedelta
import random

API_BASE = "http://127.0.0.1:8000"

# Define different user profiles
users_data = [
    # Active users (last active within 24 hours)
    {
        "name": "Active Alice",
        "email": "alice@example.com",
        "phone_number": "+1234567001",
        "days_inactive": 0,
        "segment": "loyal",
        "churn_risk": 0.1
    },
    {
        "name": "Daily Dan",
        "email": "dan@example.com",
        "phone_number": "+1234567002",
        "days_inactive": 0,
        "segment": "loyal",
        "churn_risk": 0.15
    },
    
    # Recently active (1-3 days ago)
    {
        "name": "Regular Rachel",
        "email": "rachel@example.com",
        "phone_number": "+1234567003",
        "days_inactive": 2,
        "segment": "loyal",
        "churn_risk": 0.25
    },
    {
        "name": "Busy Bob",
        "email": "bob@example.com",
        "phone_number": "+1234567004",
        "days_inactive": 3,
        "segment": "active",
        "churn_risk": 0.3
    },
    
    # Moderately inactive (4-7 days)
    {
        "name": "Weekend Wendy",
        "email": "wendy@example.com",
        "phone_number": "+1234567005",
        "days_inactive": 5,
        "segment": "active",
        "churn_risk": 0.45
    },
    {
        "name": "Casual Chris",
        "email": "chris@example.com",
        "phone_number": "+1234567006",
        "days_inactive": 7,
        "segment": "dormant",
        "churn_risk": 0.55
    },
    
    # Inactive (1-2 weeks)
    {
        "name": "Forgetful Frank",
        "email": "frank@example.com",
        "phone_number": "+1234567007",
        "days_inactive": 10,
        "segment": "dormant",
        "churn_risk": 0.65
    },
    {
        "name": "Distracted Diana",
        "email": "diana@example.com",
        "phone_number": "+1234567008",
        "days_inactive": 14,
        "segment": "dormant",
        "churn_risk": 0.72
    },
    
    # Very inactive (2-4 weeks)
    {
        "name": "Ghost Gary",
        "email": "gary@example.com",
        "phone_number": "+1234567009",
        "days_inactive": 21,
        "segment": "dormant",
        "churn_risk": 0.8
    },
    {
        "name": "Missing Mia",
        "email": "mia@example.com",
        "phone_number": "+1234567010",
        "days_inactive": 28,
        "segment": "dormant",
        "churn_risk": 0.85
    },
    
    # Almost churned (1-2 months)
    {
        "name": "Silent Sam",
        "email": "sam@example.com",
        "phone_number": "+1234567011",
        "days_inactive": 45,
        "segment": "dormant",
        "churn_risk": 0.9
    },
    {
        "name": "Lost Laura",
        "email": "laura@example.com",
        "phone_number": "+1234567012",
        "days_inactive": 60,
        "segment": "dormant",
        "churn_risk": 0.95
    },
]

def create_user(user_data):
    """Create a user via the API"""
    # Create user
    response = requests.post(
        f"{API_BASE}/users/",
        json={
            "name": user_data["name"],
            "email": user_data["email"],
            "phone_number": user_data["phone_number"]
        }
    )
    
    if response.status_code == 200:
        user = response.json()
        user_id = user["id"]
        print(f"✓ Created user: {user_data['name']} (ID: {user_id})")
        
        # Update last_active_at and segment via direct database manipulation
        # Since there's no update endpoint, we'll use the activity endpoint
        # and then manually update the database
        return user_id, user_data
    else:
        print(f"✗ Failed to create user: {user_data['name']} - {response.text}")
        return None, None

def update_user_in_db(user_id, user_data):
    """Update user's last_active_at, segment, and churn_risk_score in database"""
    import sqlite3
    from datetime import datetime, timedelta
    
    # Calculate last_active_at based on days_inactive
    last_active = datetime.utcnow() - timedelta(days=user_data["days_inactive"])
    
    conn = sqlite3.connect('flirting_agent.db')
    cursor = conn.cursor()
    
    cursor.execute("""
        UPDATE users 
        SET last_active_at = ?,
            segment = ?,
            churn_risk_score = ?
        WHERE id = ?
    """, (last_active.isoformat(), user_data["segment"], user_data["churn_risk"], user_id))
    
    conn.commit()
    conn.close()
    
    print(f"  → Updated: last_active={user_data['days_inactive']} days ago, segment={user_data['segment']}, churn_risk={user_data['churn_risk']}")

if __name__ == "__main__":
    print("🌱 Seeding database with diverse users...\n")
    
    created_users = []
    
    for user_data in users_data:
        user_id, data = create_user(user_data)
        if user_id:
            created_users.append((user_id, data))
    
    print(f"\n📊 Updating user activity patterns...\n")
    
    for user_id, user_data in created_users:
        update_user_in_db(user_id, user_data)
    
    print(f"\n✅ Successfully seeded {len(created_users)} users!")
    print("\n📈 User Distribution:")
    print(f"  - Active (0-3 days): {len([u for u in users_data if u['days_inactive'] <= 3])}")
    print(f"  - Moderately Inactive (4-7 days): {len([u for u in users_data if 4 <= u['days_inactive'] <= 7])}")
    print(f"  - Inactive (1-2 weeks): {len([u for u in users_data if 8 <= u['days_inactive'] <= 14])}")
    print(f"  - Very Inactive (2-4 weeks): {len([u for u in users_data if 15 <= u['days_inactive'] <= 28])}")
    print(f"  - Almost Churned (1+ months): {len([u for u in users_data if u['days_inactive'] > 28])}")
