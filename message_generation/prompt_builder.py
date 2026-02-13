"""
Message Generation Module

Generates engagement message content based on tone and user context.
"""

import random
from typing import Dict, Any

# Message templates by tone - App-to-User engagement messages
MESSAGE_TEMPLATES = {
    "playful": [
        "Hey {name}! 👋 You've got 3 new matches waiting. Don't leave them hanging! 💕",
        "{name}, someone's been checking out your profile! 👀 Come see who it is!",
        "We miss you, {name}! 😢 Your connections have been asking about you. Jump back in!",
        "{name}! 🎉 You have 5 unread messages. Your admirers are waiting!",
        "Hey {name}, the party's not the same without you! 🎊 Come catch up on what you've missed!",
        "{name}, you're missing out! 🔥 New people in your area are looking to connect!"
    ],
    "warm": [
        "Welcome to the community, {name}! 🌟 Let's help you get started on your journey.",
        "Hi {name}! 👋 We're excited to have you here. Ready to make some connections?",
        "Hey {name}! ✨ Your profile is looking great! Let's find your perfect match.",
        "{name}, welcome aboard! 🚀 We've found 10 people you might really click with!",
        "Great to see you, {name}! 💙 Let's make today the start of something special!",
        "{name}, you're all set! 🎉 Time to explore and meet amazing people!"
    ],
    "neutral": [
        "Hi {name}, just a quick reminder to check your messages! 📬 You have 2 new notifications.",
        "Hey {name}! 👋 Your weekly activity summary is ready. See who viewed your profile!",
        "{name}, don't forget to complete your profile! 📝 It increases your match rate by 3x.",
        "Hi {name}! 💬 You have pending connection requests. Take a look when you can!",
        "Hey {name}, hope you're doing well! 😊 Check out today's featured profiles just for you.",
        "{name}, your feed has been updated! 🌈 New posts from your connections are waiting."
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
