"""
Message Generation Module

Generates engagement message content based on tone and user context.
"""

import random
from typing import Dict, Any

# Message templates by tone - App-to-User engagement messages
MESSAGE_TEMPLATES = {
    "playful": [
        "Your audience is waiting for your comeback, {name}! 🚀 Don't leave them hanging!",
        "{name}, trends move fast! 📉 Don't let your engagement drop—post something today!",
        "We miss your creative spark, {name}! ✨ Your followers need fresh content.",
        "Your followers are asking where you went, {name}! 👀 Time to say hello?",
        "Ready to break the internet again? � A new trend is waiting for your take!",
        "A new trend just started—perfect for your style, {name}! 🎵 Hop on it!"
    ],
    "warm": [
        "You're killing it with the consistency, {name}! 🔥 Keep it up!",
        "Your community is growing beautifully! 🌱 We love seeing your progress.",
        "Love seeing your daily updates, {name}! 💙 You're building a real fanbase.",
        "You're a top creator this week! 🏆 Your hard work is paying off.",
        "Your recent content is inspiring so many people! 🌟 Keep sharing your voice.",
        "Keep up the momentum, {name}! 🚀 You're on the path to monetization!"
    ],
    "neutral": [
        "Hi {name}, your weekly analytics are in. 📊 Check your dashboard for insights.",
        "Tip: Content posted at 6 PM gets +10% reach. ⏰ Try scheduling for then!",
        "Don't forget to reply to your comments, {name}! 💬 Engagement boosts visibility.",
        "Your profile views are steady this week. � Check which posts performed best.",
        "System update: New filters added to the editor. 🎨 Try them out!",
        "Reminder: Plan your content for the weekend, {name}. 🗓️ Consistency is key."
    ],
    "welcome_back": [
        "Welcome back to the Creator Hub! 🌟 We missed your content.",
        "Great to see you again! 🚀 Let's get your reach back up.",
        "Ready to jump back into the feed? 📱 Your audience is ready.",
        "Your analytics missed you! 📊 Let's make some green arrows today.",
        "Return of the Creator! � Time to film something amazing."
    ]
}


def generate_message(tone: str, context: Dict[str, Any]) -> str:
    """
    Generate an engagement message based on tone and user context.
    
    Args:
        tone: Message tone ("playful", "warm", or "neutral")
        context: Dictionary containing user information (must include "name")
        
    Returns:
        Generated message string
    """
    # Get templates for the specified tone
    templates = MESSAGE_TEMPLATES.get(tone, MESSAGE_TEMPLATES["neutral"])
    
    # Select a random template
    template = random.choice(templates)
    
    # Format with user context
    message = template.format(**context)
    
    return message
