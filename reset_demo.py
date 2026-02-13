#!/usr/bin/env python3
"""
Reset Demo Script

Run this before each demo to ensure messages will be sent!
This clears old messages and makes users inactive.
"""

import sqlite3
from datetime import datetime, timedelta

DB_PATH = "flirting_agent.db"

def reset_for_demo():
    """Reset the database for a fresh demo"""
    
    print("🔄 Resetting database for demo...\n")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Step 1: Clear ALL messages (to reset frequency control)
    cursor.execute("DELETE FROM message_logs;")
    deleted_messages = cursor.rowcount
    print(f"✓ Cleared {deleted_messages} old messages")
    
    # Step 2: Make all users inactive (2 minutes ago)
    # This ensures they pass the 60-second inactivity threshold
    cursor.execute("""
        UPDATE users 
        SET last_active_at = datetime('now', '-2 minutes')
        WHERE id > 0;
    """)
    updated_users = cursor.rowcount
    print(f"✓ Made {updated_users} users inactive (2 minutes ago)")
    
    # Step 3: Ensure all users have created_at timestamps
    cursor.execute("""
        UPDATE users 
        SET created_at = datetime('now', '-' || (id * 2) || ' days')
        WHERE created_at IS NULL;
    """)
    
    conn.commit()
    
    # Show current state
    cursor.execute("SELECT COUNT(*) FROM users;")
    total_users = cursor.fetchone()[0]
    
    cursor.execute("SELECT COUNT(*) FROM message_logs WHERE type = 'client_engagement_brand';")
    remaining_messages = cursor.fetchone()[0]
    
    conn.close()
    
    print(f"\n📊 Current State:")
    print(f"  • Total Users: {total_users}")
    print(f"  • Engagement Messages: {remaining_messages}")
    print(f"  • All users are now INACTIVE (ready for engagement)")
    
    print(f"\n✅ Demo reset complete!")
    print(f"\n🎬 You can now run the engagement cycle and it will send messages!")
    print(f"\nNext steps:")
    print(f"  1. Click '❤️ Run Flirting Cycle' on dashboard")
    print(f"  2. Or run: curl -X POST http://127.0.0.1:8000/run-engagement-cycle/")
    print(f"  3. Messages will be sent to all {total_users} users!\n")

if __name__ == "__main__":
    try:
        reset_for_demo()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Make sure the database file exists and is accessible.")
