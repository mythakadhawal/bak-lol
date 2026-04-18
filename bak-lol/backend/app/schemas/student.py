from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from uuid import UUID


class StudentBase(BaseModel):
    name: str
    year: int
    department: str
    hostel: str
    email: Optional[EmailStr] = None
    ug_number: Optional[str] = None
    bio: Optional[str] = None

    @field_validator("year")
    @classmethod
    def validate_year(cls, v: int) -> int:
        if v not in (1, 2, 3, 4):
            raise ValueError("Year must be 1–4")
        return v


class StudentCreate(StudentBase):
    password: str


class StudentOut(StudentBase):
    id: UUID
    avatar_seed: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    identifier: str   # email or UG number
    password: str


class TokenResponse(BaseModel):
    token: str
    student: StudentOut
