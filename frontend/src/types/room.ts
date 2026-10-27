export interface RoomData {
  width: number;   // cm
  depth: number;   // cm
  height: number;  // cm
}

export type FurnitureType = "bed" | "desk" | "wardrobe" | "sofa" | "table";

export interface FurnitureItem {
  id: string;
  type: FurnitureType;
  name: string;
  width: number;   // cm
  depth: number;   // cm
  height: number;  // cm
  x: number;       // cm
  y: number;       // cm
  z: number;       // cm
  rotationY: number;
  color: string;
}

export interface PlannerState {
  room: RoomData;
  furniture: FurnitureItem[];
}
