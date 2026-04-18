from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.schemas.student import StudentOut


class ActivityCreate(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_at: datetime
    hostel: Optional[str] = None
    max_participants: Optional[int] = None


class ActivityOut(BaseModel):
    id: UUID
    creator_id: UUID
    creator: Optional[StudentOut] = None
    title: str
    description: Optional[str] = None
    scheduled_at: datetime
    hostel: Optional[str] = None
    max_participants: Optional[int] = None
    status: str
    participant_count: int = 0
    is_joined: bool = False
    created_at: datetime

    model_config = {"from_attributes": True}


class ActivityMessageCreate(BaseModel):
    content: str


class ActivityMessageOut(BaseModel):
    id: UUID
    activity_id: UUID
    sender_id: UUID
    sender: Optional[StudentOut] = None
    content: str
    sent_at: datetime

    model_config = {"from_attributes": True}
