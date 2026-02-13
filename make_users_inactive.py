#!/usr/bin/env python3
"""
Make specific users inactive for demo purposes.
This sets their last_active_at to various times in the past.
"""

from datetime import datetime, timedelta
from backend.database import SessionLocal
from backend.models import User

def make_users_inactive():
    """Make specific users inactive with different inactivity periods."""
    db = SessionLocal()
    
    try:
        # Define inactivity scenarios
        scenarios = [
            # (user_name_pattern, days_inactive, churn_risk)
            ("Forgetful", 5, 0.75),      # 5 days → dormant
            ("Distracted", 4, 0.72),     # 4 days → dormant
            ("Ghost Gary", 7, 0.85),     # 7 days → dormant
            ("Missing", 10, 0.90),       # 10 days → dormant
            ("Silent", 6, 0.80),         # 6 days → dormant
            ("Lost", 8, 0.88),           # 8 days → dormant
            ("Casual", 3.5, 0.65),       # 3.5 days → dormant (threshold is 3)
            ("Weekend", 2, 0.45),        # 2 days → normal
            ("Busy", 1.5, 0.35),         # 1.5 days → normal
        ]
        
        users_updated = 0
        
        for name_pattern, days_inactive, churn_risk in scenarios:
            user = db.query(User).filter(User.name.like(f"%{name_pattern}%")).first()
            
            if user:
                # Set last_active_at to X days ago
                user.last_active_at = datetime.utcnow() - timedelta(days=days_inactive)
                user.churn_risk_score = churn_risk
                users_updated += 1
                print(f"✓ {user.name}: Inactive for {days_inactive} days (churn risk: {churn_risk*100:.0f}%)")
        
        # Keep some users active (0-1 day inactive)
        active_patterns = ["Ghost User", "Regular Ryan", "Night Owl", "Active Alice", "Daily Dan"]
        for name_pattern in active_patterns:
            user = db.query(User).filter(User.name.like(f"%{name_pattern}%")).first()
            if user:
                # Active within last hour
                user.last_active_at = datetime.utcnow() - timedelta(minutes=30)
                user.churn_risk_score = 0.1
                users_updated += 1
                print(f"✓ {user.name}: Active (30 min ago)")
        
        db.commit()
        
        print(f"\n✅ Updated {users_updated} users with varied activity levels")
        print("\n📊 Expected Segments:")
        print("  • Dormant (≥3 days inactive): Forgetful, Distracted, Ghost Gary, Missing, Silent, Lost, Casual")
        print("  • Normal (1-3 days inactive): Weekend, Busy")
        print("  • New User (<1 day old account): Ghost User, Regular Ryan, Night Owl, Active Alice, Daily Dan")
        
    finally:
        db.close()

if __name__ == "__main__":
    print("🔄 Making users inactive for demo...\n")
    make_users_inactive()
    print("\n🎬 Ready for demo! Segments will now update dynamically based on activity.")
