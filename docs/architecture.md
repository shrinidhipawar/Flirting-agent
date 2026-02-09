# System Architecture & Workflow

## High-Level Architecture
The system operates as a data-driven engagement platform that monitors user behavior and triggers personalized communication. It is designed to be scalable and modular, separating the "creative" engagement logic from the utilitarian messaging infrastructure.

**Flow:**
1.  **User Activity Data:** The system ingests data on user actions (or lack thereof), such as app opens, purchases, or last login timestamps.
2.  **Engine (Background Service):** A scheduled job (or event listener) runs periodically to evaluate user segments.
3.  **Engagement Logic (`engagement_agent`):**
    - The core logic identifies "at-risk" users (e.g., 7 days inactive).
    - It checks eligibility rules (frequency caps, opt-outs).
    - It determines the best strategy (playful nudge vs. serious offer).
4.  **Message Generation (`message_generation`):**
    - Based on the strategy, a template is selected or an LLM prompt is constructed.
    - Context (e.g., user name, favorite category) is injected.
5.  **Delivery (`utility_messaging` / External Service):** The message is dispatched via Push Notification or In-App Feed.
6.  **Analytics:** User interaction (open, dismiss, conversion) is tracked to refine future engagement logic.

## Workflow Example: The "Late Night Snack" Scenario

1.  **Trigger:** It's 10:00 PM on a Friday. The system scans active users who haven't ordered in 2 weeks.
2.  **Detection:** `engagement_agent/decision_logic.py` flags User A as a "Late Night Heavy Eater".
3.  **Check:** The `eligibility` check confirms User A hasn't received a notification in 3 days.
4.  **Selection:** The logic decides on a "Playful" tone to tempt the user.
5.  **Generation:** `message_generation` selects a template: "Hey {Name}, the fridge is looking kind of empty... 😉 Pizza?"
6.  **Delivery:** Notification sent.
7.  **Feedback:** User clicks notification -> opens app -> marks as "Engaged".

## Module Responsibilities

### 1. Backend (`backend/`)
- Manages API endpoints for frontend interaction.
- Handles user authentication and data storage.
- Connects to the database.

### 2. Engagement Agent (`engagement_agent/`) - **[YOUR FOCUS]**
- **Inactivity Detection:** Logic to identify users who need a nudge.
- **Segmentation:** Logic to categorize users based on behavior.
- **Tone Selection:** Logic to decide the "personality" of the message.
- **Eligibility:** Logic to ensure compliance and good UX (frequency caps).

### 3. Message Generation (`message_generation/`)
- Content creation layer.
- Manages templates and dynamic text generation.
- Interfaces with LLMs if required.

### 4. Analytics (`analytics/`)
- Tracks performance metrics.
- Provides feedback to the Engagement Agent to improve future targeting.
