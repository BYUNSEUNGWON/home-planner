from typing import Optional
from pydantic import BaseModel, EmailStr

class UserResponse(BaseModel):
    id: int
    email: Optional[EmailStr] = None
    nickname: Optional[str] = None

    class Config:
        from_attributes = True
