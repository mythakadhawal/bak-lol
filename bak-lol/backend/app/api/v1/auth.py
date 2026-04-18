from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token
from app.models.student import Student
from app.schemas.student import StudentCreate, LoginRequest, TokenResponse, StudentOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(payload: StudentCreate, db: Session = Depends(get_db)):
    # Validation: at least one login identifier
    if not payload.email and not payload.ug_number:
        raise HTTPException(400, "Provide email or UG number")

    # Check uniqueness
    if payload.email and db.query(Student).filter(Student.email == payload.email).first():
        raise HTTPException(409, "Email already registered")
    if payload.ug_number and db.query(Student).filter(Student.ug_number == payload.ug_number).first():
        raise HTTPException(409, "UG number already registered")

    student = Student(
        name=payload.name,
        email=payload.email,
        ug_number=payload.ug_number,
        year=payload.year,
        department=payload.department,
        hostel=payload.hostel,
        bio=payload.bio,
        password_hash=hash_password(payload.password),
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    token = create_access_token(str(student.id))
    return TokenResponse(token=token, student=StudentOut.model_validate(student))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    # Find by email or UG number
    student = None
    if "@" in payload.identifier:
        student = db.query(Student).filter(Student.email == payload.identifier).first()
    else:
        student = db.query(Student).filter(Student.ug_number == payload.identifier).first()

    if not student or not verify_password(payload.password, student.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid credentials")

    token = create_access_token(str(student.id))
    return TokenResponse(token=token, student=StudentOut.model_validate(student))
