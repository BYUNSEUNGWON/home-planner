from sqlalchemy.orm import Session
from app.models.email_verification import EmailVerification
from datetime import datetime


def create_verification(db: Session, email: str, code: str, expires_at: datetime):
    verification = EmailVerification(
        email=email,
        verification_code=code,
        is_verified=False,
        expires_at=expires_at,
    )
    db.add(verification)
    db.commit()
    db.refresh(verification)
    return verification


def get_latest_verification(db: Session, email: str):
    return (
        db.query(EmailVerification)
        .filter(EmailVerification.email == email)
        .order_by(EmailVerification.id.desc())
        .first()
    )


def mark_verified(db: Session, verification: EmailVerification):
    verification.is_verified = True
    db.commit()
    db.refresh(verification)
    return verification
