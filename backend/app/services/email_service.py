def send_verification_email(email: str, code: str):
    # 실제 SMTP/메일 서비스 연결 전 임시 출력
    print(f"[EMAIL] send verification code to {email}: {code}")
