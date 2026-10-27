import type { FurnitureItem, RoomData } from "../types/room";

export function clampFurnitureToRoom(
  item: FurnitureItem,
  room: RoomData
): FurnitureItem {
  const halfRoomW = room.width / 2;
  const halfRoomD = room.depth / 2;

  const halfW = item.width / 2;
  const halfD = item.depth / 2;

  const cos = Math.cos(item.rotationY);
  const sin = Math.sin(item.rotationY);

  // 회전된 상태에서 x축, z축으로 투영된 반폭/반깊이
  const projectedHalfW = Math.abs(halfW * cos) + Math.abs(halfD * sin);
  const projectedHalfD = Math.abs(halfW * sin) + Math.abs(halfD * cos);

  const minX = -halfRoomW + projectedHalfW;
  const maxX = halfRoomW - projectedHalfW;

  const minZ = -halfRoomD + projectedHalfD;
  const maxZ = halfRoomD - projectedHalfD;

  return {
    ...item,
    x: Math.max(minX, Math.min(item.x, maxX)),
    z: Math.max(minZ, Math.min(item.z, maxZ)),
    y: Math.max(0, item.y),
  };
}


export function isFurnitureOverlapping(a: FurnitureItem, b: FurnitureItem) {
  return !(
    a.x + a.width / 2 <= b.x - b.width / 2 ||
    a.x - a.width / 2 >= b.x + b.width / 2 ||
    a.z + a.depth / 2 <= b.z - b.depth / 2 ||
    a.z - a.depth / 2 >= b.z + b.depth / 2
  );
}

export function hasFurnitureCollision(
  target: FurnitureItem,
  items: FurnitureItem[]
) {
  return items.some((item) => {
    if (item.id === target.id) return false;
    return isFurnitureOverlapping(target, item);
  });
}
export function isOutOfRoom(item: FurnitureItem, room: RoomData) {
  const halfRoomW = room.width / 2;
  const halfRoomD = room.depth / 2;

  const halfW = item.width / 2;
  const halfD = item.depth / 2;

  const cos = Math.cos(item.rotationY);
  const sin = Math.sin(item.rotationY);

  const projectedHalfW = Math.abs(halfW * cos) + Math.abs(halfD * sin);
  const projectedHalfD = Math.abs(halfW * sin) + Math.abs(halfD * cos);

  return (
    item.x - projectedHalfW < -halfRoomW ||
    item.x + projectedHalfW > halfRoomW ||
    item.z - projectedHalfD < -halfRoomD ||
    item.z + projectedHalfD > halfRoomD
  );
}

export function isNearWall(
  item: FurnitureItem,
  room: RoomData,
  threshold = 3
) {
  const halfRoomW = room.width / 2;
  const halfRoomD = room.depth / 2;

  const halfW = item.width / 2;
  const halfD = item.depth / 2;

  const cos = Math.cos(item.rotationY);
  const sin = Math.sin(item.rotationY);

  const corners = [
    { x: -halfW, z: -halfD },
    { x: halfW, z: -halfD },
    { x: halfW, z: halfD },
    { x: -halfW, z: halfD },
  ].map((corner) => {
    const rotatedX = corner.x * cos - corner.z * sin;
    const rotatedZ = corner.x * sin + corner.z * cos;

    return {
      x: item.x + rotatedX,
      z: item.z + rotatedZ,
    };
  });

  return corners.some((corner) => {
    const leftGap = Math.abs(corner.x + halfRoomW);
    const rightGap = Math.abs(halfRoomW - corner.x);
    const backGap = Math.abs(corner.z + halfRoomD);
    const frontGap = Math.abs(halfRoomD - corner.z);

    return (
      leftGap <= threshold ||
      rightGap <= threshold ||
      backGap <= threshold ||
      frontGap <= threshold
    );
  });
}

