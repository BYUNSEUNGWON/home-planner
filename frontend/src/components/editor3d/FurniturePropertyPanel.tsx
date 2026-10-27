import type { FurnitureItem } from "../../types/room";

interface FurniturePropertyPanelProps {
  selectedFurniture: FurnitureItem | null;
  onUpdate: (item: FurnitureItem) => void;
  onDelete: () => void;
}

export default function FurniturePropertyPanel({
  selectedFurniture,
  onUpdate,
  onDelete,
}: FurniturePropertyPanelProps) {
  if (!selectedFurniture) {
    return (
      <div className="panel-card">
        <h3>속성</h3>
        <div className="panel-sub-card">
          <p>가구를 선택하면 이름, 크기, 위치, 회전을 수정할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-card">
      <h3>선택된 가구</h3>

      <div className="property-field">
        <label>이름</label>
        <input
          value={selectedFurniture.name}
          onChange={(e) =>
            onUpdate({
              ...selectedFurniture,
              name: e.target.value,
            })
          }
        />
      </div>

      <div className="property-grid">
        <div className="property-field">
          <label>가로</label>
          <input
            type="number"
            value={selectedFurniture.width}
            onChange={(e) =>
              onUpdate({
                ...selectedFurniture,
                width: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="property-field">
          <label>세로</label>
          <input
            type="number"
            value={selectedFurniture.depth}
            onChange={(e) =>
              onUpdate({
                ...selectedFurniture,
                depth: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      <div className="property-grid">
        <div className="property-field">
          <label>높이</label>
          <input
            type="number"
            value={selectedFurniture.height}
            onChange={(e) =>
              onUpdate({
                ...selectedFurniture,
                height: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="property-field">
          <label>회전 (도)</label>
          <input
            type="number"
            value={Math.round((selectedFurniture.rotationY * 180) / Math.PI)}
            onChange={(e) =>
              onUpdate({
                ...selectedFurniture,
                rotationY: (Number(e.target.value) * Math.PI) / 180,
              })
            }
          />
        </div>
      </div>

      <div className="property-grid">
        <div className="property-field">
          <label>X</label>
          <input
            type="number"
            value={Math.round(selectedFurniture.x)}
            onChange={(e) =>
              onUpdate({
                ...selectedFurniture,
                x: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="property-field">
          <label>Z</label>
          <input
            type="number"
            value={Math.round(selectedFurniture.z)}
            onChange={(e) =>
              onUpdate({
                ...selectedFurniture,
                z: Number(e.target.value),
              })
            }
          />
        </div>
      </div>

      <button className="danger-button" onClick={onDelete}>
        가구 삭제
      </button>
    </div>
  );
}
