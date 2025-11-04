from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class LabWorkBase(BaseModel):
    title: str
    description: Optional[str] = None
    topic: Optional[str] = None

class LabWorkCreate(LabWorkBase):
    student_id: int

class LabWorkSubmission(BaseModel):
    code: str
    files: Optional[Dict[str, str]] = None

class LabWork(LabWorkBase):
    id: int
    student_id: int
    submitted_at: datetime
    status: str
    score: float
    max_score: float
    errors_found: Optional[List[Dict[str, Any]]] = None
    correctness_percentage: Optional[float] = None
    
    class Config:
        from_attributes = True
