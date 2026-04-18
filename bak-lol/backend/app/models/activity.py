import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Text, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    scheduled_at = Column(DateTime, nullable=False)
    hostel = Column(String(100), nullable=True)
    max_participants = Column(Integer, nullable=True)
    status = Column(String(20), default="upcoming", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    creator = relationship("Student", back_populates="created_activities", foreign_keys=[creator_id])
    participants = relationship("ActivityParticipant", back_populates="activity", cascade="all, delete-orphan")
    messages = relationship("ActivityMessage", back_populates="activity", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint("status IN ('upcoming','ongoing','completed','cancelled')", name="ck_activity_status"),
    )


class ActivityParticipant(Base):
    __tablename__ = "activity_participants"

    activity_id = Column(UUID(as_uuid=True), ForeignKey("activities.id", ondelete="CASCADE"), primary_key=True)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), primary_key=True)
    joined_at = Column(DateTime, default=datetime.utcnow)

    activity = relationship("Activity", back_populates="participants")
    student = relationship("Student", back_populates="activity_participations")


class ActivityMessage(Base):
    __tablename__ = "activity_messages"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    activity_id = Column(UUID(as_uuid=True), ForeignKey("activities.id", ondelete="CASCADE"), nullable=False)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    sent_at = Column(DateTime, default=datetime.utcnow)

    activity = relationship("Activity", back_populates="messages")
    sender = relationship("Student")
