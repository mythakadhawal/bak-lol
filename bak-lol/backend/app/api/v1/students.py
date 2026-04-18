from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional

from app.core.database import get_db
from app.models.student import Student
from app.schemas.student import StudentOut
from app.api.deps import get_current_student

router = APIRouter(prefix="/students", tags=["students"])


@router.get("/", response_model=list[StudentOut])
def list_students(
    hostel: Optional[str] = None,
    year: Optional[int] = None,
    department: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=100),
    db: Session = Depends(get_db),
    _: Student = Depends(get_current_student),
):
    q = db.query(Student).filter(Student.is_active == True)
    if hostel:
        q = q.filter(Student.hostel == hostel)
    if year:
        q = q.filter(Student.year == year)
    if department:
        q = q.filter(Student.department == department)
    if search:
        q = q.filter(Student.name.ilike(f"%{search}%"))
    return q.offset(skip).limit(limit).all()


@router.get("/{student_id}", response_model=StudentOut)
def get_student(
    student_id: UUID,
    db: Session = Depends(get_db),
    _: Student = Depends(get_current_student),
):
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(404, "Student not found")
    return student
