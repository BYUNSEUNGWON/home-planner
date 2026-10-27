from typing import Optional
from sqlalchemy.orm import Session
from app.models.user_oauth_account import UserOAuthAccount

def get_oauth_account(db: Session, provider: str, provider_user_id: str):
    return (
        db.query(UserOAuthAccount)
        .filter(
            UserOAuthAccount.provider == provider,
            UserOAuthAccount.provider_user_id == provider_user_id,
        )
        .first()
    )

def create_oauth_account(
    db: Session,
    user_id: int,
    provider: str,
    provider_user_id: str,
    provider_email: Optional[str],
    access_token: Optional[str],
    refresh_token: Optional[str] = None,
):
    existing = get_oauth_account(db, provider, provider_user_id)
    if existing:
        return existing

    oauth = UserOAuthAccount(
        user_id=user_id,
        provider=provider,
        provider_user_id=provider_user_id,
        provider_email=provider_email,
        access_token=access_token,
        refresh_token=refresh_token,
    )
    db.add(oauth)
    db.commit()
    db.refresh(oauth)
    return oauth
