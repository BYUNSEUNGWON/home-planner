import type { FurnitureType, RoomData } from "../../types/room";

interface FurnitureToolbarProps {
  onAdd: (type: FurnitureType) => void;
  room: RoomData;
}

export default function FurnitureToolbar({
  onAdd,
  room,
}: FurnitureToolbarProps) {
  return (
    <div className="panel-card">
      <h3>가구 추가</h3>

      <div className="toolbar-grid">
        <button className="tool-button" onClick={() => onAdd("bed")}>
          침대
        </button>
        <button className="tool-button" onClick={() => onAdd("desk")}>
          책상
        </button>
        <button className="tool-button" onClick={() => onAdd("wardrobe")}>
          옷장
        </button>
        <button className="tool-button" onClick={() => onAdd("sofa")}>
          소파
        </button>
        <button className="tool-button" onClick={() => onAdd("table")}>
          테이블
        </button>
      </div>

      <div className="panel-sub-card">
        <strong>현재 방 크기</strong>
        <p>가로 {room.width}cm</p>
        <p>세로 {room.depth}cm</p>
        <p>높이 {room.height}cm</p>
      </div>

      <div className="panel-sub-card">
        <strong>사용 방법</strong>
        <p>가구를 클릭해 선택하고, 드래그로 이동하세요.</p>
        <p>마우스로 회전/확대는 화면을 자유롭게 보는 용도입니다.</p>
      </div>
    </div>
  );
}
