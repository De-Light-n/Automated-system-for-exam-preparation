from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    
    id = Column(Integer, primary_key=True, index=True)
    lab_work_id = Column(Integer, ForeignKey("lab_works.id"))
    analysis_date = Column(DateTime, default=datetime.utcnow)
    
    # Analysis metrics
    correctness_score = Column(Float)
    common_errors = Column(JSON)  # List of error types and counts
    topic_mastery_level = Column(String)  # weak, medium, strong
    suggestions = Column(JSON)  # List of improvement suggestions
    
    # Relationships
    lab_work = relationship("LabWork", back_populates="analysis_results")

class ExamSession(Base):
    __tablename__ = "exam_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime)
    duration_minutes = Column(Integer)
    status = Column(String, default="active")  # active, completed, expired
    
    # Results
    total_questions = Column(Integer)
    correct_answers = Column(Integer)
    score = Column(Float)
    readiness_level = Column(String)  # low, medium, high
    
    # Relationships
    student = relationship("Student", back_populates="exam_sessions")
    answers = relationship("ExamAnswer", back_populates="session")

class ExamAnswer(Base):
    __tablename__ = "exam_answers"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("exam_sessions.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    answer_text = Column(Text)
    is_correct = Column(Integer)  # NULL - not checked, 0 - wrong, 1 - correct
    answered_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    session = relationship("ExamSession", back_populates="answers")
    question = relationship("Question", back_populates="answers")

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String)
    difficulty = Column(String)  # easy, medium, hard
    question_text = Column(Text, nullable=False)
    correct_answer = Column(Text)
    options = Column(JSON)  # For multiple choice questions
    explanation = Column(Text)
    
    # Relationships
    answers = relationship("ExamAnswer", back_populates="question")
