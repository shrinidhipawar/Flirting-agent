from datetime import datetime, timedelta
from .database import SessionLocal, engine, Base
from . import models

# Ensure tables are created
Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Check if we already have users to avoid duplicates
    if db.query(models.User).count() > 0:
        print("Database already seeded.")
        db.close()
        return

    print("Seeding database with test users...")

    # 1. The "Ghost" (Inactive for 14 days) -> Needs heavy re-engagement
    ghost = models.User(
        name="Ghost User",
        email="ghost@example.com",
        phone_number="555-0001",
        last_active_at=datetime.utcnow() - timedelta(days=14),
        segment="dormant",
        churn_risk_score=0.9
    )

    # 2. The "Regular" (Active yesterday) -> Keep warm
    regular = models.User(
        name="Regular Ryan",
        email="ryan@example.com",
        phone_number="555-0002",
        last_active_at=datetime.utcnow() - timedelta(days=1),
        segment="loyal",
        churn_risk_score=0.1
    )

    # 3. The "Night Owl" (Active 3 days ago at 2 AM) -> Target late night
    night_owl = models.User(
        name="Night Owl Nancy",
        email="nancy@example.com",
        phone_number="555-0003",
        last_active_at=datetime.utcnow() - timedelta(days=3),
        segment="night_owl",
        churn_risk_score=0.4
    )

    db.add_all([ghost, regular, night_owl])
    db.commit()
    print("Database seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed_data()
