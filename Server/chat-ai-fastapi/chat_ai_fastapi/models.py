from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum
import uuid


class StatusEnum(str, Enum):
    active = "active"
    archived = "archived"


class ConversationSchema(BaseModel):
    id: uuid.UUID
    title: str
    user_id: str
    status: StatusEnum
    started_at: datetime
    ended_at: Optional[datetime] = None


class CreateConversation(BaseModel):
    title: str
    user_id: str
    status: StatusEnum = StatusEnum.active

class MessageStatusEnum(str, Enum):
    pending = "pending"
    processing = "processing"
    success = "success"
    failed = "failed"

class CreateMessage(BaseModel):
    conversation_id: str
    request: str
    response: str
    error: Optional[str] = None
    updated_timestamp: datetime

class MessageSchema(BaseModel):
    id: int
    conversation_id: str
    request: str
    response: str
    error: Optional[str]
    status: MessageStatusEnum
    updated_timestamp: datetime