import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const API_BASE = "http://127.0.0.1:8000/api/v1";

  const handleSendCode = async () => {
    if (!email) {
      alert("이메일을 먼저 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/email/send-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "인증번호 발송에 실패했습니다.");
        return;
      }

      setIsCodeSent(true);
      setIsVerified(false);
      alert("인증번호가 발송되었습니다. (현재는 백엔드 콘솔에서 확인)");
    } catch (error) {
      alert("서버 연결에 실패했습니다.");
    }
  };

  const handleVerifyCode = async () => {
    if (!isCodeSent) {
      alert("먼저 인증번호를 발송해주세요.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/email/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "인증번호 확인에 실패했습니다.");
        return;
      }

      setIsVerified(true);
      alert("이메일 인증이 완료되었습니다.");
    } catch (error) {
      alert("서버 연결에 실패했습니다.");
    }
  };

  const handleSignup = async () => {
    if (!email || !name || !password || !passwordConfirm) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (!isVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          nickname: name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "회원가입에 실패했습니다.");
        return;
      }

      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      alert("서버 연결에 실패했습니다.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-top">
          <div>
            <p className="auth-kicker">ACCOUNT SIGNUP</p>
            <h1>회원가입</h1>
            <p className="auth-description">
              저장 목록과 프로젝트 관리를 위해 계정을 만들어주세요.
            </p>
          </div>

          <button className="outline-button" onClick={() => navigate(-1)}>
            뒤로가기
          </button>
        </div>

        <div className="auth-form">
          <div className="auth-field">
            <label>이름</label>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label>아이디(이메일)</label>
            <div className="inline-field-row">
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="outline-button small" onClick={handleSendCode}>
                인증번호 발송
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label>이메일 인증번호</label>
            <div className="inline-field-row">
              <input
                type="text"
                placeholder="인증번호 6자리 입력"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button className="outline-button small" onClick={handleVerifyCode}>
                인증확인
              </button>
            </div>

            {isCodeSent && !isVerified && (
              <div className="auth-status pending">인증번호를 입력하고 확인해주세요.</div>
            )}

            {isVerified && (
              <div className="auth-status success">이메일 인증이 완료되었습니다.</div>
            )}
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

          <div className="auth-field">
            <label>비밀번호 확인</label>
            <input
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          <button className="primary-button auth-main-button" onClick={handleSignup}>
            회원가입
          </button>

          <div className="auth-bottom-row">
            <span>이미 계정이 있으신가요?</span>
            <button className="text-link-button" onClick={() => navigate("/login")}>
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
