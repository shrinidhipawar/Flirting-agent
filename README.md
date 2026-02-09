# Flirting Agent (Brand Engagement System)

## Project Overview
This project is an AI-powered "Flirting Agent" designed to increase user engagement and re-activation for a brand, similar to notification systems used by consumer apps like Swiggy or Zomato. The goal is to build a playful, brand-aligned personality that interacts with inactive users to bring them back to the app.

**Important:** This is **NOT** a dating app or personal flirting tool. It is a marketing engagement system leveraging a distinct persona.

## Message Types

### 1. Client Messages (Brand → User)
- **Role:** The "Flirting Agent".
- **Purpose:** Re-engage inactive users, build brand recall, and humanize the app.
- **Tone:** Playful, casual, teasing, conversational.
- **Nature:** One-way, short, emotion-based.
- **Trigger:** Automatic, based on user inactivity or specific behavioral triggers.
- **Generation:** 
    - **Logic:** Agent decides *when* and *how*.
    - **Content:** Templates with variations or optional short-form LLM (LLaMA/Flash).
- **Delivery:** Simulated Push Notifications or In-App/WhatsApp-like feed.

### 2. User Messages (System → User)
- **Role:** Utility Bot.
- **Purpose:** Informational updates, reminders, system notifications.
- **Tone:** Clear, neutral, professional, non-playful.
- **Nature:** Utility-focused.
- **Trigger:** Event-driven (e.g., flight delay) or scheduled (e.g., payment due).
- **Generation:** Deterministic templates; no LLM required.
