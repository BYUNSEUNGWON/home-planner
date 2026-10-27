import { isLoggedIn, logout } from "../utils/auth";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { FurnitureItem, FurnitureType, PlannerState, RoomData } from "../types/room";
import { createFurnitureItem, findAvailablePosition } from "../utils/furnitureFactory";

import {
  clearPlannerStateFromLocal,
  loadPlannerStateFromLocal,
  savePlannerStateToLocal,
} from "../utils/storage";
import {
  clampFurnitureToRoom,
  hasFurnitureCollision,
} from "../utils/collision";
import FurnitureToolbar from "../components/editor3d/FurnitureToolbar";
import FurniturePropertyPanel from "../components/editor3d/FurniturePropertyPanel";
import RoomScene3D from "../components/editor3d/RoomScene3D";
import "../styles/editor3d.css";

export default function RoomEditor3DPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const roomFromState = location.state as RoomData | undefined;

  const [room, setRoom] = useState<RoomData | null>(roomFromState ?? null);
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"front" | "top">("front");

  useEffect(() => {
    const saved = loadPlannerStateFromLocal();

    if (saved) {
      setRoom(saved.room);
      setFurniture(saved.furniture);
      return;
    }

    if (roomFromState) {
      setRoom(roomFromState);
      setFurniture([]);
    }
  }, [roomFromState]);

  useEffect(() => {
    if (!room) return;

    const state: PlannerState = {
      room,
      furniture,
    };

    savePlannerStateToLocal(state);
  }, [room, furniture]);

  const selectedFurniture = useMemo(
    () => furniture.find((item) => item.id === selectedId) ?? null,
    [furniture, selectedId]
  );

  if (!room) {
    return (
      <div className="editor3d-empty">
        <h2>방 정보가 없습니다.</h2>
        <button className="primary-button" onClick={() => navigate("/create")}>
          다시 입력하기
        </button>
      </div>
    );
  }

   const handleAddFurniture = (type: FurnitureType) => {
   const baseItem = createFurnitureItem(type);
   const placedItem = findAvailablePosition(baseItem, furniture, room);

   const next = [...furniture, placedItem];
   setFurniture(next);
   setSelectedId(placedItem.id);
  };

 const handleRotateSelected = () => {
  if (!selectedFurniture || !room) return;

  const rotated = {
    ...selectedFurniture,
    rotationY: selectedFurniture.rotationY + Math.PI / 4,
  };

  const clamped = clampFurnitureToRoom(rotated, room);

  const nextFurniture = furniture.map((item) =>
    item.id === clamped.id ? clamped : item
  );

  setFurniture(nextFurniture);
};


  const handleUpdateFurniture = (updated: FurnitureItem) => {
    if (!room) return;

    const clamped = clampFurnitureToRoom(updated, room);
    const next = furniture.map((item) =>
      item.id === clamped.id ? clamped : item
    );

    if (hasFurnitureCollision(clamped, next)) return;

    setFurniture(next);
  };


  const handleDeleteFurniture = () => {
    if (!selectedId) return;
    setFurniture((prev) => prev.filter((item) => item.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <div className="editor3d-page">
      <header className="editor3d-header">
        <div>
          <p className="editor3d-kicker">3D ROOM EDITOR</p>
          <h1>방 가구 배치 편집기</h1>
          <p className="editor3d-desc">
            가구를 추가하고 이동/회전하며 실제 배치감을 확인해보세요.
          </p>
        </div>
        <div className="editor3d-header-actions">
        <button
            className={`outline-button ${viewMode === "front" ? "active-view" : ""}`}
            onClick={() => setViewMode("front")}
        >
            정면 보기
        </button>

        <button
            className={`outline-button ${viewMode === "top" ? "active-view" : ""}`}
            onClick={() => setViewMode("top")}
        >
            위에서 보기
        </button>

        <button
            className="outline-button"
            onClick={handleRotateSelected}
            disabled={!selectedFurniture}
        >
          45도 회전
        </button>

        <button className="outline-button" onClick={() => navigate("/create")}>
            방 다시 입력
        </button>

        <button className="outline-button" onClick={() => clearPlannerStateFromLocal()}>
            로컬 저장 초기화
        </button>

        {isLoggedIn() && (
          <button
            className="outline-button"
            onClick={() => {
              logout();
              clearPlannerStateFromLocal();
              alert("로그아웃되었습니다.");
              navigate("/login");
            }}
          >
            로그아웃
          </button>
        )}

        <button
          className="primary-button"
          onClick={() => {
            /*if (!isLoggedIn()) {
              navigate("/login", {
                state: { redirectTo: "/editor" },
              });
              return;
            }*/
            alert("로그인 확인 완료. 저장 기능은 다음 단계에서 연결합니다.");
              navigate("/login", {
                state: { redirectTo: "/editor" },
              });
              return;
          }}
        >
          로컬 저장
        </button>

        </div>

      </header>

      <div className="editor3d-layout">
        <aside className="editor3d-left">
          <FurnitureToolbar onAdd={handleAddFurniture} room={room} />
        </aside>

        <main className="editor3d-center">
          <div className="scene-card">
            <RoomScene3D
              room={room}
              furniture={furniture}
              selectedId={selectedId}
              viewMode={viewMode}
              onSelect={setSelectedId}
              onUpdateFurniture={handleUpdateFurniture}
            />
          </div>
        </main>

        <aside className="editor3d-right">
          <FurniturePropertyPanel
            selectedFurniture={selectedFurniture}
            onUpdate={handleUpdateFurniture}
            onDelete={handleDeleteFurniture}
          />
        </aside>
      </div>
    </div>
  );
}
