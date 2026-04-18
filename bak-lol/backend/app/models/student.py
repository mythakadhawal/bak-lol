import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=True)
    ug_number = Column(String(50), unique=True, nullable=True)
    year = Column(Integer, nullable=False)
    department = Column(String(100), nullable=False)
    hostel = Column(String(100), nullable=False)
    password_hash = Column(Text, nullable=False)
    avatar_seed = Column(String(50), nullable=True)
    bio = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    created_activities = relationship("Activity", back_populates="creator", foreign_keys="Activity.creator_id")
    activity_participations = relationship("ActivityParticipant", back_populates="student")
    help_requests = relationship("HelpRequest", back_populates="poster")
    help_responses = relationship("HelpResponse", back_populates="responder")
    posts = relationship("Post", back_populates="author")
    sent_messages = relationship("DirectMessage", back_populates="sender", foreign_keys="DirectMessage.sender_id")

    __table_args__ = (
        CheckConstraint("year BETWEEN 1 AND 4", name="ck_student_year"),
        CheckConstraint("email IS NOT NULL OR ug_number IS NOT NULL", name="ck_student_login"),
    )
