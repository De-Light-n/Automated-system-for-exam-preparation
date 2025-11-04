from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class LabWork(Base):
    __tablename__ = "lab_works"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    topic = Column(String)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="pending")  # pending, checked, approved
    score = Column(Float, default=0.0)
    max_score = Column(Float, default=100.0)
    
    # Analysis results
    errors_found = Column(JSON)  # List of detected errors
    correctness_percentage = Column(Float)
    
    # Relationships
    student = relationship("Student", back_populates="lab_works")
    analysis_results = relationship("AnalysisResult", back_populates="lab_work")
