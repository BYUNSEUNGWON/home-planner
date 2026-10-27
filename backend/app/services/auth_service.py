from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.core.security import hash_password, verify_password, generate_verification_code
from app.repositories.email_verification_repository import (
    create_verification,
    get_latest_verification,
    mark_verified,
)
from app.services.email_service import send_verification_email
from app.repositories.user_repository import get_user_by_email, create_user, create_oauth_user
from app.services.kakao_service import get_kakao_token, get_kakao_user_info
from app.repositories.user_repository import (
    get_user_by_email,
    get_user_by_id,
    create_user,
    create_oauth_user,
)
from app.repositories.user_oauth_repository import (
    get_oauth_account,
    create_oauth_account,
)


def send_email_code(db: Session, email: str):
    existing_user = get_user_by_email(db, email)
    if existing_user:
        raise ValueError("이미 가입된 이메일입니다.")

    code = generate_verification_code()
    expires_at = datetime.now() + timedelta(minutes=5)

    create_verification(db, email=email, code=code, expires_at=expires_at)
    send_verification_email(email, code)

def verify_email_code(db: Session, email: str, code: str):
    verification = get_latest_verification(db, email)

    if not verification:
        raise ValueError("인증 요청이 없습니다.")

    if verification.is_verified:
        return True

    if verification.expires_at < datetime.now():
        raise ValueError("인증번호가 만료되었습니다.")

    if verification.verification_code != code:
        raise ValueError("인증번호가 올바르지 않습니다.")

    mark_verified(db, verification)
    return True

def signup_user(db: Session, email: str, password: str, nickname: str):
    existing_user = get_user_by_email(db, email)
    if existing_user:
        raise ValueError("이미 가입된 이메일입니다.")

    verification = get_latest_verification(db, email)
    if not verification or not verification.is_verified:
        raise ValueError("이메일 인증이 완료되지 않았습니다.")

    password_hash = hash_password(password)
    return create_user(db, email=email, password_hash=password_hash, nickname=nickname)

def login_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)

    if not user:
        raise ValueError("존재하지 않는 이메일입니다.")

    if not user.password_hash:
        raise ValueError("비밀번호 로그인 계정이 아닙니다.")

    if not verify_password(password, user.password_hash):
        raise ValueError("비밀번호가 올바르지 않습니다.")

    if not user.is_active:
        raise ValueError("비활성화된 계정입니다.")

    return user

def login_with_kakao(db: Session, code: str):
    token_data = get_kakao_token(code)
    access_token = token_data.get("access_token")
    refresh_token = token_data.get("refresh_token")

    if not access_token:
        raise ValueError("카카오 access token 발급 실패")

    user_info = get_kakao_user_info(access_token)

    provider_user_id = str(user_info.get("id"))
    kakao_account = user_info.get("kakao_account", {})
    profile = kakao_account.get("profile", {})

    nickname = profile.get("nickname", "카카오 사용자")
    provider_email = kakao_account.get("email")

    # 1. 이미 연동된 카카오 계정이 있는지 먼저 확인
    oauth_account = get_oauth_account(db, "kakao", provider_user_id)
    if oauth_account:
        user = get_user_by_id(db, oauth_account.user_id)
        if user:
            return user

    # 2. 이메일이 있으면 같은 이메일 사용자 찾기
    existing_user = None
    if provider_email:
        existing_user = get_user_by_email(db, provider_email)

    if existing_user:
        # 이미 같은 이메일 계정이 있으면 oauth 연결만 추가
        oauth_account = get_oauth_account(db, "kakao", provider_user_id)
        if not oauth_account:
            create_oauth_account(
                db=db,
                user_id=existing_user.id,
                provider="kakao",
                provider_user_id=provider_user_id,
                provider_email=provider_email,
                access_token=access_token,
                refresh_token=refresh_token,
            )
        return existing_user

    # 3. 신규 사용자 생성
    user = create_oauth_user(
        db=db,
        nickname=nickname,
        provider="kakao",
        email=provider_email,
    )

    oauth_account = get_oauth_account(db, "kakao", provider_user_id)
    if not oauth_account:
        create_oauth_account(
            db=db,
            user_id=user.id,
            provider="kakao",
            provider_user_id=provider_user_id,
            provider_email=provider_email,
            access_token=access_token,
            refresh_token=refresh_token,
        )

    return user
