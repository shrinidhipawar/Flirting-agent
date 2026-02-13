from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class MessageType(str, enum.Enum):
    CLIENT_ENGAGEMENT_BRAND = "client_engagement_brand"
    USER_UTILITY_SYSTEM = "user_utility_system"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)  # Account creation timestamp
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone_number = Column(String)
    
    # Engagement Logic Fields
    last_active_at = Column(DateTime, default=datetime.utcnow)
    churn_risk_score = Column(Float, default=0.0) # 0.0 to 1.0 (Higher is riskier)
    segment = Column(String, default="new_user") # e.g., "dormant", "power_user"
    
    # Relationship to messages
    messages = relationship("MessageLog", back_populates="user")

class MessageLog(Base):
    __tablename__ = "message_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(Enum(MessageType))
    content = Column(String)
    sent_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="sent") # 'sent', 'delivered', 'read'

    user = relationship("User", back_populates="messages")
