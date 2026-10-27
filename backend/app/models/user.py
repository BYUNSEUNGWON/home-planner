from sqlalchemy import Column, BigInteger, String, Boolean, Text, TIMESTAMP, text
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    nickname = Column(String(100), nullable=True)
    profile_image_url = Column(Text, nullable=True)
    auth_provider = Column(String(30), nullable=False, server_default="local")
    is_email_verified = Column(Boolean, nullable=False, server_default="false")
    is_active = Column(Boolean, nullable=False, server_default="true")
    created_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
    updated_at = Column(TIMESTAMP, nullable=False, server_default=text("CURRENT_TIMESTAMP"))
