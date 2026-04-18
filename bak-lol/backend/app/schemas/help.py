from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime
from uuid import UUID
from app.schemas.student import StudentOut


class HelpRequestCreate(BaseModel):
    category: Literal["item", "help", "other"]
    title: str
    description: Optional[str] = None


class HelpRequestOut(BaseModel):
    id: UUID
    poster_id: UUID
    poster: Optional[StudentOut] = None
    category: str
    title: str
    description: Optional[str] = None
    is_resolved: bool
    response_count: int = 0
    created_at: datetime

    model_config = {"from_attributes": True}


class HelpResponseCreate(BaseModel):
    content: str


class HelpResponseOut(BaseModel):
    id: UUID
    request_id: UUID
    responder_id: UUID
    responder: Optional[StudentOut] = None
    content: str
    is_accepted: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class PostCreate(BaseModel):
    title: str
    body: Optional[str] = None
    tag: Optional[Literal["study-group", "project", "collaboration", "announcement", "other"]] = None


class PostOut(BaseModel):
    id: UUID
    author_id: UUID
    author: Optional[StudentOut] = None
    title: str
    body: Optional[str] = None
    tag: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
