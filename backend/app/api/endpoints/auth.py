from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.auth import UserLogin, UserRegister, Token
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/register", response_model=Token)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Реєстрація нового користувача"""
    auth_service = AuthService(db)
    return await auth_service.register_user(user_data)

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Вхід в систему"""
    auth_service = AuthService(db)
    return await auth_service.login_user(credentials)

@router.post("/logout")
async def logout():
    """Вихід з системи"""
    return {"message": "Successfully logged out"}
