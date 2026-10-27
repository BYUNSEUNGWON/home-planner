from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.auth import (
    SendCodeRequest,
    VerifyCodeRequest,
    SignupRequest,
    LoginRequest,
    KakaoLoginRequest,
    MessageResponse,
)
from app.schemas.user import UserResponse
from app.services.auth_service import (
    send_email_code,
    verify_email_code,
    signup_user,
    login_user,
    login_with_kakao,
)

router = APIRouter()

@router.post("/email/send-code", response_model=MessageResponse)
def send_code(request: SendCodeRequest, db: Session = Depends(get_db)):
    try:
        send_email_code(db, request.email)
        return {"message": "verification code sent"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/email/verify-code", response_model=MessageResponse)
def verify_code(request: VerifyCodeRequest, db: Session = Depends(get_db)):
    try:
        verify_email_code(db, request.email, request.code)
        return {"message": "email verified"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/signup", response_model=UserResponse)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    try:
        user = signup_user(
            db,
            email=request.email,
            password=request.password,
            nickname=request.nickname,
        )
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.post("/login", response_model=UserResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    try:
        user = login_user(db, request.email, request.password)
        return user
    except Exception as e:
        print("[LOGIN ERROR]", str(e))
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/kakao/login", response_model=UserResponse)
def kakao_login(request: KakaoLoginRequest, db: Session = Depends(get_db)):
    try:
        user = login_with_kakao(db, request.code)
        return user
    except Exception as e:
        print("[KAKAO LOGIN ERROR]", str(e))
        raise HTTPException(status_code=400, detail=str(e))
