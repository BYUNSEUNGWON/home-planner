import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RoomData } from "../types/room";
import "../styles/create.css";

export default function RoomCreatePage() {
  const navigate = useNavigate();

  const [room, setRoom] = useState<RoomData>({
    width: 400,
    depth: 300,
    height: 240,
  });

  const handleChange = <K extends keyof RoomData>(key: K, value: RoomData[K]) => {
    setRoom((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCreate = () => {
    navigate("/editor", {
      state: room,
    });
  };

  return (
    <div className="create-page">
      <div className="create-container">
        <div className="create-header">
          <div>
            <p className="create-kicker">ROOM SETUP</p>
            <h1>방 크기를 입력해주세요</h1>
            <p className="create-description">
              가구를 배치할 방의 가로, 세로, 높이를 입력하면
              3D 공간을 생성해드릴게요.
            </p>
          </div>

          <button className="outline-button" onClick={() => navigate("/")}>
            뒤로가기
          </button>
        </div>

        <div className="create-grid single">
          <section className="form-card">
            <h2>방 정보</h2>

            <div className="form-row">
              <div className="form-group">
                <label>가로 (cm)</label>
                <input
                  type="number"
                  value={room.width}
                  onChange={(e) => handleChange("width", Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>세로 (cm)</label>
                <input
                  type="number"
                  value={room.depth}
                  onChange={(e) => handleChange("depth", Number(e.target.value))}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>높이 (cm)</label>
                <input
                  type="number"
                  value={room.height}
                  onChange={(e) => handleChange("height", Number(e.target.value))}
                />
              </div>
            </div>

            <div className="room-guide-box">
              <strong>입력 예시</strong>
              <p>가로 400cm × 세로 300cm × 높이 240cm</p>
            </div>
          </section>
        </div>

        <div className="create-footer">
          <button className="primary-button large" onClick={handleCreate}>
            3D 방 만들기
          </button>
        </div>
      </div>
    </div>
  );
}
