from passlib.context import CryptContext
import random
import string

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)

def generate_verification_code(length: int = 6) -> str:
    return ''.join(random.choices(string.digits, k=length))
