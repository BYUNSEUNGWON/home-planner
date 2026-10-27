from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, email: str, password_hash: str, nickname: str):
    user = User(
        email=email,
        password_hash=password_hash,
        nickname=nickname,
        auth_provider="local",
        is_email_verified=True,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def create_oauth_user(
    db: Session,
    nickname: str,
    provider: str,
    email: Optional[str] = None,
):
    user = User(
        email=email,
        password_hash=None,
        nickname=nickname,
        auth_provider=provider,
        is_email_verified=True,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
