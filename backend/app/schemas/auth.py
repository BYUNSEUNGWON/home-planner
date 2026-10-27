from pydantic import BaseModel, EmailStr


class SendCodeRequest(BaseModel):
    email: EmailStr


class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    nickname: str


class MessageResponse(BaseModel):
    message: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    
class KakaoLoginRequest(BaseModel):
    code: str
