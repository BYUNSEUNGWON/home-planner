from sqlalchemy import Column, BigInteger, String, Boolean, TIMESTAMP, text
from app.core.database import Base


class EmailVerification(Base):
    __tablename__ = "email_verifications"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False)
    verification_code = Column(String(20), nullable=False)
    is_verified = Column(Boolean, nullable=False, server_default="false")
    expires_at = Column(TIMESTAMP, nullable=False)
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
