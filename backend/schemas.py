from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class MessageType(str, Enum):
    CLIENT_ENGAGEMENT_BRAND = "client_engagement_brand"
    USER_UTILITY_SYSTEM = "user_utility_system"

# User Schemas
class UserBase(BaseModel):
    name: str
    email: str
    phone_number: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int
    last_active_at: datetime
    segment: str
    churn_risk_score: float

    # Pydantic v2 configuration (if using strictly v2, change to ConfigDict)
    # For compatibility with most setups:
    class Config:
        from_attributes = True 

# Message Schemas
class MessageLogBase(BaseModel):
    content: str
    type: MessageType
    status: str = "sent"

class MessageLogCreate(MessageLogBase):
    user_id: int

class MessageLogResponse(MessageLogBase):
    id: int
    sent_at: datetime

    class Config:
        from_attributes = True

class UtilityReminderRequest(BaseModel):
    user_id: int
    reminder_type: str
    context_data: dict

class BroadcastRequest(BaseModel):
    broadcast_type: str
    context_data: Optional[dict] = None
