from fastapi import APIRouter
from app.api.endpoints import (
    auth,
    students,
    lab_works,
    analytics,
    recommendations,
    exam_trainer,
    statistics
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(lab_works.router, prefix="/lab-works", tags=["lab-works"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
api_router.include_router(exam_trainer.router, prefix="/exam-trainer", tags=["exam-trainer"])
api_router.include_router(statistics.router, prefix="/statistics", tags=["statistics"])
