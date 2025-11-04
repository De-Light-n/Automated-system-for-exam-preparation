from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class StudentBase(BaseModel):
    student_id_number: str
    group_name: Optional[str] = None
    faculty: Optional[str] = None
    course: Optional[int] = None

class StudentCreate(StudentBase):
    user_id: int

class StudentUpdate(BaseModel):
    group_name: Optional[str] = None
    faculty: Optional[str] = None
    course: Optional[int] = None

class Student(StudentBase):
    id: int
    user_id: int
    average_grade: float
    
    class Config:
        from_attributes = True
