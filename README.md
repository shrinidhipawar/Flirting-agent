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

## Folder Structure Explanation

The project is organized into modular components to separate the "creative" agent logic from standard utility functions.

- **`backend/`**: The core server infrastructure.
    - `app.py`: Entry point for the application.
    - `routes/`: API endpoints for the frontend or external triggers.
    - `models/`: Database schemas (User profiles, Message logs).

- **`engagement_agent/`**: **[YOUR MAIN RESPONSIBILITY]**
    - `decision_logic.py`: The "Brain" of the agent. Decides *if* and *when* to engage a specific user.
    - `segmentation.py`: Groups users into categories (e.g., "Dormant", "High Value", "Night Owl") to tailor the approach.

- **`message_generation/`**:
    - `templates.json`: A library of pre-written messages with placeholders.
    - `prompt_builder.py`: Tools to construct dynamic prompts if an LLM is used for variation.

- **`utility_messaging/`**:
    - `reminders.py`: Logic for standard, non-playful reminders.
    - `broadcasts.py`: Logic for sending mass system notifications.

- **`analytics/`**:
    - `metrics.py`: Calculation of Open Rates, Click-Through Rates (CTR), and Retention impact.
    - `feedback_loop.py`: Logic to adjust the agent's strategy based on what works (e.g., "Stop teasing User X, they respond better to offers").

- **`docs/`**: Documentation files (Architecture, Workflows).

## Your Role: Engagement / Flirting Agent Logic

You are responsible to build the logic inside **`engagement_agent/`**.

Your key responsibilities include:
1.  **Inactivity Detection:** Define and implement rules to spot users who are drifting away (e.g., "No login in 14 days").
2.  **Engagement Eligibility:** Logic to prevent spam. Ensure users aren't messaged too often or at inappropriate times.
3.  **User Segmentation:** Classify users so the agent knows who it's talking to (e.g., witty banter for younger users, polite nudges for older demographics).
4.  **Tone Selection:** dynamically choose between Playful, Neutral, or Incentive-based tones based on the user's history.
5.  **Strategy:** Deciding the overall "Campaign" for a user (e.g., "The 'Miss You' sequence").
