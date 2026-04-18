from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from uuid import UUID
from typing import Optional
from datetime import datetime

from app.core.database import get_db
from app.models.activity import Activity, ActivityParticipant, ActivityMessage
from app.schemas.activity import ActivityCreate, ActivityOut, ActivityMessageCreate, ActivityMessageOut
from app.api.deps import get_current_student
from app.models.student import Student

router = APIRouter(prefix="/activities", tags=["activities"])


def _enrich(activity: Activity, current_student: Student) -> dict:
    participant_count = len(activity.participants)
    is_joined = any(p.student_id == current_student.id for p in activity.participants)
    return {
        **ActivityOut.model_validate(activity).model_dump(),
        "participant_count": participant_count,
        "is_joined": is_joined,
    }


@router.get("/", response_model=list[ActivityOut])
def list_activities(
    status: Optional[str] = None,
    hostel: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student),
):
    q = db.query(Activity).options(joinedload(Activity.creator), joinedload(Activity.participants))
    if status:
        q = q.filter(Activity.status == status)
    if hostel:
        q = q.filter(Activity.hostel == hostel)
    activities = q.order_by(Activity.scheduled_at).offset(skip).limit(limit).all()
    return [_enrich(a, current) for a in activities]


@router.post("/", response_model=ActivityOut, status_code=status.HTTP_201_CREATED)
def create_activity(
    payload: ActivityCreate,
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student),
):
    activity = Activity(**payload.model_dump(), creator_id=current.id)
    db.add(activity)
    db.flush()
    # Auto-join creator
    db.add(ActivityParticipant(activity_id=activity.id, student_id=current.id))
    db.commit()
    db.refresh(activity)
    return _enrich(activity, current)


@router.get("/{activity_id}", response_model=ActivityOut)
def get_activity(
    activity_id: UUID,
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student),
):
    activity = db.query(Activity).options(
        joinedload(Activity.creator), joinedload(Activity.participants)
    ).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(404, "Activity not found")
    return _enrich(activity, current)


@router.post("/{activity_id}/join", status_code=status.HTTP_204_NO_CONTENT)
def join_activity(
    activity_id: UUID,
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student),
):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(404, "Not found")
    if activity.status != "upcoming":
        raise HTTPException(400, "Cannot join this activity")
    if activity.max_participants and len(activity.participants) >= activity.max_participants:
        raise HTTPException(400, "Activity is full")
    existing = db.query(ActivityParticipant).filter_by(activity_id=activity_id, student_id=current.id).first()
    if existing:
        raise HTTPException(409, "Already joined")
    db.add(ActivityParticipant(activity_id=activity_id, student_id=current.id))
    db.commit()


@router.delete("/{activity_id}/leave", status_code=status.HTTP_204_NO_CONTENT)
def leave_activity(
    activity_id: UUID,
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student),
):
    participant = db.query(ActivityParticipant).filter_by(
        activity_id=activity_id, student_id=current.id
    ).first()
    if not participant:
        raise HTTPException(404, "Not a participant")
    db.delete(participant)
    db.commit()


@router.get("/{activity_id}/messages", response_model=list[ActivityMessageOut])
def get_messages(
    activity_id: UUID,
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student),
):
    # Only participants can read
    part = db.query(ActivityParticipant).filter_by(activity_id=activity_id, student_id=current.id).first()
    if not part:
        raise HTTPException(403, "Join the activity to view chat")
    return db.query(ActivityMessage).options(joinedload(ActivityMessage.sender)).filter(
        ActivityMessage.activity_id == activity_id
    ).order_by(ActivityMessage.sent_at).all()


@router.post("/{activity_id}/messages", response_model=ActivityMessageOut, status_code=status.HTTP_201_CREATED)
def send_message(
    activity_id: UUID,
    payload: ActivityMessageCreate,
    db: Session = Depends(get_db),
    current: Student = Depends(get_current_student),
):
    part = db.query(ActivityParticipant).filter_by(activity_id=activity_id, student_id=current.id).first()
    if not part:
        raise HTTPException(403, "Join the activity first")
    msg = ActivityMessage(activity_id=activity_id, sender_id=current.id, content=payload.content)
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
