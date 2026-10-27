import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f9fc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        fontFamily: "Pretendard, Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 40,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: 999,
              background: "#e0e7ff",
              color: "#4338ca",
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            3D ROOM PLANNER
          </div>

          <h1
            style={{
              fontSize: 58,
              lineHeight: 1.08,
              margin: "0 0 20px",
              color: "#111827",
            }}
          >
            방 크기를 입력하고
            <br />
            가구를 3D로 배치해보세요
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.8,
              color: "#6b7280",
              maxWidth: 620,
              marginBottom: 28,
            }}
          >
            방의 가로, 세로, 높이를 입력해 3D 공간을 만들고
            침대, 책상, 옷장 같은 가구를 추가해 실제 크기감과 배치를
            미리 확인할 수 있습니다.
          </p>

          <button
            onClick={() => navigate("/create")}
            style={{
              height: 54,
              padding: "0 24px",
              borderRadius: 16,
              border: "none",
              background: "linear-gradient(135deg, #4f46e5, #6366f1)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 14px 30px rgba(79, 70, 229, 0.25)",
            }}
          >
            내 방 만들기
          </button>
        </div>

        <div
          style={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: 24,
            padding: 24,
            boxShadow: "0 16px 40px rgba(15, 23, 42, 0.05)",
          }}
        >
          <div style={{ marginBottom: 16, fontWeight: 700, fontSize: 22 }}>
            3D 배치 미리보기
          </div>
          <div
            style={{
              height: 360,
              borderRadius: 20,
              background:
                "linear-gradient(180deg, #eef2ff 0%, #ffffff 55%, #f3f4f6 100%)",
              border: "1px solid #e5e7eb",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "18% 12% 16% 12%",
                border: "2px solid #94a3b8",
                background: "rgba(255,255,255,0.65)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "28%",
                top: "42%",
                width: 110,
                height: 70,
                background: "#c4b5fd",
                borderRadius: 12,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "54%",
                top: "48%",
                width: 80,
                height: 48,
                background: "#93c5fd",
                borderRadius: 12,
              }}
            />
            <div
              style={{
                position: "absolute",
                right: "18%",
                top: "30%",
                width: 64,
                height: 110,
                background: "#f9a8d4",
                borderRadius: 12,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
