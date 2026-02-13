#!/usr/bin/env python3
"""
Engagement Engine Demo Script

This script demonstrates the engagement decision engine in action.
Run this to show how the system works!
"""

import requests
import json
import time
from datetime import datetime

API_BASE = "http://127.0.0.1:8000"

def print_header(text):
    """Print a formatted header"""
    print("\n" + "="*70)
    print(f"  {text}")
    print("="*70 + "\n")

def print_section(text):
    """Print a section header"""
    print(f"\n{'─'*70}")
    print(f"  {text}")
    print(f"{'─'*70}\n")

def get_all_users():
    """Fetch all users from the database"""
    response = requests.get(f"{API_BASE}/users/")
    return response.json()

def trigger_engagement_cycle():
    """Trigger the engagement cycle"""
    response = requests.post(f"{API_BASE}/run-engagement-cycle/")
    return response.json()

def get_user_messages(user_id):
    """Get messages for a specific user"""
    response = requests.get(f"{API_BASE}/messages/{user_id}")
    return response.json()

def demo():
    """Run the complete demo"""
    
    print_header("🚀 ENGAGEMENT DECISION ENGINE DEMO")
    
    print("This demo shows how the engagement engine:")
    print("  1. Evaluates users based on activity")
    print("  2. Segments them (dormant/new_user/normal)")
    print("  3. Assigns appropriate message tones")
    print("  4. Generates and sends personalized messages")
    
    input("\nPress ENTER to start...")
    
    # Step 1: Show current users
    print_section("📊 STEP 1: Current Users in Database")
    
    users = get_all_users()
    print(f"Total Users: {len(users)}\n")
    
    print(f"{'ID':<5} {'Name':<20} {'Segment':<12} {'Last Active':<25} {'Churn Risk':<12}")
    print("─" * 90)
    
    for user in users[:10]:  # Show first 10
        last_active = user['last_active_at'][:19] if user['last_active_at'] else 'N/A'
        print(f"{user['id']:<5} {user['name']:<20} {user['segment']:<12} {last_active:<25} {user['churn_risk_score']:<12.2f}")
    
    if len(users) > 10:
        print(f"\n... and {len(users) - 10} more users")
    
    input("\nPress ENTER to trigger engagement cycle...")
    
    # Step 2: Trigger engagement cycle
    print_section("⚙️  STEP 2: Running Engagement Decision Engine")
    
    print("Evaluating each user...")
    print("  ✓ Checking inactivity (threshold: 60 seconds)")
    print("  ✓ Checking message frequency (limit: 24 hours)")
    print("  ✓ Determining user segment")
    print("  ✓ Mapping segment to tone")
    print("  ✓ Generating personalized messages\n")
    
    result = trigger_engagement_cycle()
    
    print("✅ Engagement Cycle Complete!\n")
    print(f"📈 Results:")
    print(f"  • Total Users Evaluated: {result['total_users']}")
    print(f"  • Messages Sent: {result['messages_sent']}")
    print(f"  • Users Skipped: {result['users_skipped']}")
    
    print(f"\n📊 Segment Breakdown:")
    for segment, count in result['segment_breakdown'].items():
        tone_map = {"dormant": "playful", "new_user": "warm", "normal": "neutral"}
        tone = tone_map.get(segment, "neutral")
        if count > 0:
            print(f"  • {segment.capitalize():<12} → {tone:<10} tone: {count} users")
    
    if result['messages_sent'] == 0:
        print("\n⚠️  No messages sent!")
        print("Reasons:")
        for reason, count in result['detailed_stats']['skip_reasons'].items():
            if count > 0:
                print(f"  • {reason.replace('_', ' ').title()}: {count} users")
        print("\n💡 Tip: Users may be too active or recently messaged.")
        return
    
    input("\nPress ENTER to see sample messages...")
    
    # Step 3: Show sample messages
    print_section("💬 STEP 3: Sample Generated Messages")
    
    # Get messages for first few users who received them
    shown = 0
    for user in users:
        if shown >= 5:
            break
        
        messages = get_user_messages(user['id'])
        if messages:
            latest_msg = messages[-1]  # Get most recent message
            
            # Determine tone based on segment
            segment = user['segment']
            tone_map = {"dormant": "playful 😉", "new_user": "warm 🌟", "normal": "neutral 👋", "loyal": "neutral 👋", "active": "playful 😉"}
            tone = tone_map.get(segment, "neutral 👋")
            
            print(f"User: {user['name']}")
            print(f"  Segment: {segment}")
            print(f"  Tone: {tone}")
            print(f"  Message: \"{latest_msg['content']}\"")
            print()
            shown += 1
    
    input("\nPress ENTER to see detailed statistics...")
    
    # Step 4: Show statistics
    print_section("📊 STEP 4: Detailed Analytics")
    
    stats = result['detailed_stats']
    
    print("Eligibility Breakdown:")
    print(f"  • Eligible for Messaging: {stats['eligible']} users")
    print(f"  • Skipped: {stats['skipped']} users")
    
    print("\nSegment Distribution:")
    for segment, count in stats['by_segment'].items():
        if count > 0:
            print(f"  • {segment.capitalize()}: {count} users")
    
    print("\nSkip Reasons:")
    for reason, count in stats['skip_reasons'].items():
        if count > 0:
            print(f"  • {reason.replace('_', ' ').title()}: {count} users")
    
    # Step 5: Summary
    print_section("✅ DEMO COMPLETE!")
    
    print("The Engagement Decision Engine successfully:")
    print("  ✓ Evaluated all users based on activity patterns")
    print("  ✓ Applied rule-based segmentation")
    print("  ✓ Enforced frequency controls (no spam)")
    print("  ✓ Generated personalized messages with appropriate tones")
    print("  ✓ Logged all actions to database")
    print("  ✓ Provided detailed analytics")
    
    print("\n🎯 Key Features:")
    print("  • Clean separation of concerns (decision vs generation)")
    print("  • Configurable thresholds")
    print("  • Comprehensive logging")
    print("  • Type-safe implementation")
    print("  • Production-ready architecture")
    
    print("\n" + "="*70)
    print("  Thank you for watching the demo! 🚀")
    print("="*70 + "\n")

if __name__ == "__main__":
    try:
        demo()
    except requests.exceptions.ConnectionError:
        print("\n❌ Error: Cannot connect to backend server!")
        print("Please make sure the backend is running:")
        print("  python -m uvicorn backend.app:app --reload --port 8000")
    except KeyboardInterrupt:
        print("\n\n👋 Demo interrupted. Goodbye!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
