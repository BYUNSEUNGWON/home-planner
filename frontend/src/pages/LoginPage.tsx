import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginSocial } from "../utils/auth";
import { FcGoogle } from "react-icons/fc";
import { SiNaver, SiKakaotalk } from "react-icons/si";
import "../styles/auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    (location.state as { redirectTo?: string } | null)?.redirectTo || "/editor";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_BASE = "http://127.0.0.1:8000/api/v1";

  const handleKakaoLogin = () => {
        const kakaoRestApiKey = import.meta.env.VITE_KAKAO_REST_API_KEY;
        const kakaoRedirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

        const kakaoAuthUrl =
            `https://kauth.kakao.com/oauth/authorize` +
            `?client_id=${kakaoRestApiKey}` +
            `&redirect_uri=${encodeURIComponent(kakaoRedirectUri)}` +
            `&response_type=code`;

        window.location.href = kakaoAuthUrl;
  };

  const Regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;

  const handleLocalLogin = async () => {

    if(!Regex.test(email)){
      alert("이메일 형태를 입력해주세요.");
      return;
    }

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "로그인에 실패했습니다.");
        return;
      }

      localStorage.setItem(
        "auth-user",
        JSON.stringify({
          email: data.email,
          name: data.nickname || data.email,
          provider: "local",
        })
      );

      alert("로그인되었습니다.");
      navigate(redirectTo);
    } catch (error) {
      alert("서버 연결에 실패했습니다.");
    }
  };

  const handleSocialLogin = (provider: "google" | "kakao" | "naver") => {
    loginSocial(provider);
    navigate(redirectTo);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-top">
          <div>
            <p className="auth-kicker">ACCOUNT LOGIN</p>
            <h1>로그인</h1>
            <p className="auth-description">
              저장 기능을 사용하려면 로그인이 필요합니다.
            </p>
          </div>

          <button className="outline-button" onClick={() => navigate(-1)}>
            뒤로가기
          </button>
        </div>

        <div className="auth-form">
          <div className="auth-field">
            <label>아이디(이메일)</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="primary-button auth-main-button" onClick={handleLocalLogin}>
            로그인
          </button>

          <div className="auth-bottom-row">
            <span>아직 계정이 없으신가요?</span>
            <button className="text-link-button" onClick={() => navigate("/signup")}>
              회원가입
            </button>
          </div>
        </div>

        <div className="auth-divider">
          <span>또는 간편 로그인</span>
        </div>

        <div className="social-login-list">
          <button
            className="social-button naver"
            onClick={() => handleSocialLogin("naver")}
          >
            <span className="social-icon-box">
              <SiNaver />
            </span>
            <span className="social-label">네이버로 시작하기</span>
          </button>

            <button
            className="social-button kakao"
            onClick={handleKakaoLogin}
            >
            <span className="social-icon-box">
                <SiKakaotalk />
            </span>
            <span className="social-label">카카오로 시작하기</span>
            </button>

          <button
            className="social-button google"
            onClick={() => handleSocialLogin("google")}
          >
            <span className="social-icon-box">
              <FcGoogle />
            </span>
            <span className="social-label">구글로 시작하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
