import type { FurnitureItem, FurnitureType, RoomData } from "../types/room";

function createId() {
  return `furniture-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}


export function createFurnitureItem(type: FurnitureType): FurnitureItem {
  const common = {
    id: createId(),
    x: 0,
    y: 0,
    z: 0,
    rotationY: 0,
  };

  switch (type) {
    case "bed":
      return {
        ...common,
        type,
        name: "침대",
        width: 120,
        depth: 220,
        height: 50,
        color: "#c4b5fd",
      };
    case "desk":
      return {
        ...common,
        type,
        name: "책상",
        width: 120,
        depth: 60,
        height: 75,
        color: "#93c5fd",
      };
    case "wardrobe":
      return {
        ...common,
        type,
        name: "옷장",
        width: 120,
        depth: 60,
        height: 200,
        color: "#f9a8d4",
      };
    case "sofa":
      return {
        ...common,
        type,
        name: "소파",
        width: 180,
        depth: 90,
        height: 85,
        color: "#86efac",
      };
    case "table":
      return {
        ...common,
        type,
        name: "테이블",
        width: 140,
        depth: 80,
        height: 75,
        color: "#fdba74",
      };
    default:
      return {
        ...common,
        type: "table",
        name: "테이블",
        width: 140,
        depth: 80,
        height: 75,
        color: "#fdba74",
      };
  }
}
export function findAvailablePosition(
  item: FurnitureItem,
  existing: FurnitureItem[],
  room: RoomData
) {
  const startX = -room.width / 2 + item.width / 2 + 20;
  const startZ = -room.depth / 2 + item.depth / 2 + 20;

  const maxX = room.width / 2 - item.width / 2;
  const maxZ = room.depth / 2 - item.depth / 2;

  const step = 40;

  for (let z = startZ; z <= maxZ; z += step) {
    for (let x = startX; x <= maxX; x += step) {
      const candidate = {
        ...item,
        x,
        z,
      };

      const overlaps = existing.some((f) => {
        return !(
          candidate.x + candidate.width / 2 <= f.x - f.width / 2 ||
          candidate.x - candidate.width / 2 >= f.x + f.width / 2 ||
          candidate.z + candidate.depth / 2 <= f.z - f.depth / 2 ||
          candidate.z - candidate.depth / 2 >= f.z + f.depth / 2
        );
      });

      if (!overlaps) {
        return candidate;
      }
    }
  }

  return item;
}
