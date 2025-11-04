from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.student import Student, StudentCreate, StudentUpdate

router = APIRouter()

@router.get("/", response_model=List[Student])
async def get_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Отримати список студентів"""
    # TODO: Implement service
    return []

@router.get("/{student_id}", response_model=Student)
async def get_student(student_id: int, db: Session = Depends(get_db)):
    """Отримати інформацію про студента"""
    # TODO: Implement service
    return {}

@router.post("/", response_model=Student)
async def create_student(student: StudentCreate, db: Session = Depends(get_db)):
    """Створити нового студента"""
    # TODO: Implement service
    return {}

@router.put("/{student_id}", response_model=Student)
async def update_student(student_id: int, student: StudentUpdate, db: Session = Depends(get_db)):
    """Оновити дані студента"""
    # TODO: Implement service
    return {}
