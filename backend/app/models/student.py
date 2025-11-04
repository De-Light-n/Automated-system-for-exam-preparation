from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    student_id_number = Column(String, unique=True, index=True)
    group_name = Column(String)
    faculty = Column(String)
    course = Column(Integer)
    average_grade = Column(Float, default=0.0)
    
    # Relationships
    user = relationship("User", back_populates="student_profile")
    lab_works = relationship("LabWork", back_populates="student")
    exam_sessions = relationship("ExamSession", back_populates="student")
