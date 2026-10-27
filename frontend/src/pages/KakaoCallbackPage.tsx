import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function KakaoCallbackPage() {
  const navigate = useNavigate();
  const handledRef = useRef(false);

  useEffect(() => {
    const handleKakaoCallback = async () => {
      if (handledRef.current) return;
      handledRef.current = true;

      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        alert("카카오 로그인 코드가 없습니다.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/auth/kakao/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(data.detail || "카카오 로그인에 실패했습니다.");
          navigate("/login");
          return;
        }

        localStorage.setItem(
          "auth-user",
          JSON.stringify({
            email: data.email || null,
            name: data.nickname || "카카오 사용자",
            provider: "kakao",
            userId: data.id,
          })
        );

        // code가 남아 있는 callback URL 대신 다른 경로로 이동
        navigate("/editor", { replace: true });
      } catch (error) {
        alert("서버 연결에 실패했습니다.");
        navigate("/login", { replace: true });
      }
    };

    handleKakaoCallback();
  }, [navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-top">
          <div>
            <p className="auth-kicker">KAKAO LOGIN</p>
            <h1>카카오 로그인 처리 중</h1>
            <p className="auth-description">잠시만 기다려주세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
