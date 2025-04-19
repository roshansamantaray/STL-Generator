from pydantic import UUID4, BaseModel
from typing import Optional
from datetime import datetime
import uuid
from enum import Enum

class StatusEnum(str, Enum):
    active = "active"
    archived = "archived"

class CreateConversation(BaseModel):
    title: str
    user_id: str
    status: StatusEnum = StatusEnum.active

class ConversationSchema(BaseModel):
    id: str
    title: str
    user_id: str
    status: StatusEnum
    started_at: datetime
    ended_at: Optional[datetime] = None
    
class MessageStatusEnum(str, Enum):
    pending = "pending"
    processing = "processing"
    success = "success"
    failed = "failed"

class CreateMessage(BaseModel):
    conversation_id: UUID4
    request: str
    response: str
    error: Optional[str] = None
    status: MessageStatusEnum  # Restrict to enum values
    updated_timestamp: datetime

class MessageSchema(BaseModel):
    id: int
    conversation_id: str
    request: str
    response: str
    stl_url: Optional[str]
    error: Optional[str]
    status: MessageStatusEnum
    updated_timestamp: datetime
