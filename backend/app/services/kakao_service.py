import requests
import urllib3
from app.core.config import settings

if settings.DISABLE_SSL_VERIFY:
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def get_kakao_token(code: str):
    token_url = "https://kauth.kakao.com/oauth/token"

    data = {
        "grant_type": "authorization_code",
        "client_id": settings.KAKAO_REST_API_KEY,
        "redirect_uri": settings.KAKAO_REDIRECT_URI,
        "code": code,
        "client_secret": settings.KAKAO_CLIENT_SECRET,
    }

    headers = {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
    }

    response = requests.post(
        token_url,
        data=data,
        verify=not settings.DISABLE_SSL_VERIFY
    )

    print("[KAKAO TOKEN STATUS]", response.status_code)
    print("[KAKAO TOKEN BODY]", response.text)

    response.raise_for_status()
    return response.json()

def get_kakao_user_info(access_token: str):
    user_info_url = "https://kapi.kakao.com/v2/user/me"

    headers = {
        "Authorization": f"Bearer {access_token}",
    }

    response = requests.get(
        user_info_url,
        headers=headers,
        verify=not settings.DISABLE_SSL_VERIFY
    )

    
    print("[KAKAO TOKEN STATUS]", response.status_code)
    print("[KAKAO TOKEN BODY]", response.text)

    response.raise_for_status()
    return response.json()
