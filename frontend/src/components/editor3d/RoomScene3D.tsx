import BedModel from "./models/BedModel";
import DeskModel from "./models/DeskModel";
import WardrobeModel from "./models/WardrobeModel";
import SofaModel from "./models/SofaModel";
import TableModel from "./models/TableModel";
import { Canvas, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Grid, Html } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { FurnitureItem, RoomData } from "../../types/room";
import {
  clampFurnitureToRoom,
  hasFurnitureCollision,
  isNearWall,
  isOutOfRoom,
} from "../../utils/collision";

interface RoomScene3DProps {
  room: RoomData;
  furniture: FurnitureItem[];
  selectedId: string | null;
  viewMode: "front" | "top";
  onSelect: (id: string | null) => void;
  onUpdateFurniture: (item: FurnitureItem) => void;
}

function CameraPreset({
  viewMode,
  room,
}: {
  viewMode: "front" | "top";
  room: RoomData;
}) {
  const { camera } = useThree();

  useEffect(() => {
    const roomWidthM = room.width / 100;
    const roomDepthM = room.depth / 100;
    const roomHeightM = room.height / 100;

    if (viewMode === "top") {
      camera.position.set(0, Math.max(roomHeightM * 3.2, 12), 0.01);
      camera.lookAt(0, 0, 0);
    } /*else {
      camera.position.set(roomWidthM * 0.5, roomHeightM * 0.9, roomDepthM * 2.1);
      camera.lookAt(0, roomHeightM * 0.4, 0);
    }*/
    else {
      camera.position.set(0, roomHeightM * 1.2, roomDepthM * 2.3);
      camera.lookAt(0, roomHeightM * 0.4, 0);
    }


    camera.updateProjectionMatrix();
  }, [camera, viewMode, room]);

  return null;
}

function RoomBox({ room }: { room: RoomData }) {
  const width = room.width / 100;
  const depth = room.depth / 100;
  const height = room.height / 100;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#eef2f7" />
      </mesh>

      <mesh position={[0, height / 2, -depth / 2]}>
        <boxGeometry args={[width, height, 0.04]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[0.04, height, depth]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[0.04, height, depth]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
    </group>
  );
}
function FurnitureBody({
  item,
  selected,
  statusColor,
}: {
  item: FurnitureItem;
  selected: boolean;
  statusColor: string;
}) {
  const width = item.width / 100;
  const depth = item.depth / 100;
  const height = item.height / 100;

  const renderByType = () => {
    switch (item.type) {
      case "bed":
        return (
          <BedModel
            width={width}
            depth={depth}
            height={height}
            color={selected ? "#4f46e5" : statusColor}
          />
        );
      case "desk":
        return (
          <DeskModel
            width={width}
            depth={depth}
            height={height}
            color={selected ? "#4f46e5" : statusColor}
          />
        );
      case "wardrobe":
        return (
          <WardrobeModel
            width={width}
            depth={depth}
            height={height}
            color={selected ? "#4f46e5" : statusColor}
          />
        );
      case "sofa":
        return (
          <SofaModel
            width={width}
            depth={depth}
            height={height}
            color={selected ? "#4f46e5" : statusColor}
          />
        );
      case "table":
        return (
          <TableModel
            width={width}
            depth={depth}
            height={height}
            color={selected ? "#4f46e5" : statusColor}
          />
        );
      default:
        return (
          <mesh castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={selected ? "#4f46e5" : statusColor} />
          </mesh>
        );
    }
  };

  return <group>{renderByType()}</group>;
}

function FurnitureLabel({
  item,
  message,
  messageColor,
}: {
  item: FurnitureItem;
  message?: string;
  messageColor?: string;
}) {
  const height = item.height / 100;

  return (
    <Html center position={[0, height / 2 + 0.18, 0]} distanceFactor={14}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.92)",
            border: "1px solid #e5e7eb",
            borderRadius: 999,
            padding: "4px 8px",
            fontSize: 10,
            lineHeight: 1,
            fontWeight: 700,
            whiteSpace: "nowrap",
            color: "#111827",
            boxShadow: "0 2px 8px rgba(15, 23, 42, 0.08)",
          }}
        >
          {item.name}
        </div>

        {message && (
          <div
            style={{
              background: messageColor === "red" ? "#fee2e2" : "#dcfce7",
              color: messageColor === "red" ? "#b91c1c" : "#166534",
              border: `1px solid ${
                messageColor === "red" ? "#fecaca" : "#bbf7d0"
              }`,
              borderRadius: 999,
              padding: "3px 7px",
              fontSize: 9,
              lineHeight: 1,
              fontWeight: 600,
              whiteSpace: "nowrap",
              boxShadow: "0 2px 6px rgba(15, 23, 42, 0.06)",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </Html>
  );
}



function FurnitureMesh({
  item,
  room,
  furniture,
  selected,
  onSelect,
  onUpdate,
}: {
  item: FurnitureItem;
  room: RoomData;
  furniture: FurnitureItem[];
  selected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (item: FurnitureItem) => void;
}) {
  const { camera, gl } = useThree();

  const [draftPosition, setDraftPosition] = useState({
    x: item.x,
    z: item.z,
  });
  const [dragging, setDragging] = useState(false);

  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    []
  );
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useMemo(() => new THREE.Vector2(), []);
  const intersection = useMemo(() => new THREE.Vector3(), []);

  const dragOffset = useRef({ x: 0, z: 0 });

  useEffect(() => {
    if (!dragging) {
      setDraftPosition({
        x: item.x,
        z: item.z,
      });
    }
  }, [item.x, item.z, dragging]);

  const currentX = draftPosition.x / 100;
  const currentZ = draftPosition.z / 100;

  const getFloorPoint = (clientX: number, clientY: number) => {
    const rect = gl.domElement.getBoundingClientRect();

    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersection);

    return intersection.clone();
  };

 const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
  e.stopPropagation();
  onSelect(item.id);

  const floorPoint = getFloorPoint(e.clientX, e.clientY);

  dragOffset.current = {
    x: floorPoint.x * 100 - draftPosition.x,
    z: floorPoint.z * 100 - draftPosition.z,
  };

  setDragging(true);
};


  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      const floorPoint = getFloorPoint(e.clientX, e.clientY);

      const nextDraft = clampFurnitureToRoom(
        {
          ...item,
          x: floorPoint.x * 100 - dragOffset.current.x,
          z: floorPoint.z * 100 - dragOffset.current.z,
        },
        room
      );

      setDraftPosition({
        x: nextDraft.x,
        z: nextDraft.z,
      });
    };

    const handlePointerUp = () => {
      setDragging(false);

      const finalItem = clampFurnitureToRoom(
        {
          ...item,
          x: draftPosition.x,
          z: draftPosition.z,
        },
        room
      );

      const nextItems = furniture.map((f) =>
        f.id === finalItem.id ? finalItem : f
      );

      if (hasFurnitureCollision(finalItem, nextItems)) {
        setDraftPosition({
          x: item.x,
          z: item.z,
        });
        return;
      }

      onUpdate(finalItem);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [
    dragging,
    camera,
    gl,
    plane,
    raycaster,
    mouse,
    intersection,
    item,
    room,
    furniture,
    draftPosition,
    onUpdate,
  ]);

  const previewItem = {
  ...item,
  x: draftPosition.x,
  z: draftPosition.z,
};

const nextItems = furniture.map((f) =>
  f.id === previewItem.id ? previewItem : f
);

const colliding = hasFurnitureCollision(previewItem, nextItems);
const outOfRoom = isOutOfRoom(previewItem, room);
const nearWall = !colliding && !outOfRoom && isNearWall(previewItem, room, 2);


let statusColor = item.color;
let statusMessage = "";
let statusMessageColor: "red" | "green" | undefined = undefined;

if (outOfRoom) {
  statusColor = "#ef4444";
  statusMessage = "방 밖으로 벗어났어요";
  statusMessageColor = "red";
} else if (colliding) {
  statusColor = "#ef4444";
  statusMessage = "가구가 겹치고 있어요";
  statusMessageColor = "red";
} else if (nearWall) {
  statusColor = "#22c55e";
  statusMessage = "벽면에 딱 붙었어요";
  statusMessageColor = "green";
}
  return (
    <group
      position={[currentX, 0, currentZ]}
      rotation={[0, item.rotationY, 0]}
      onPointerDown={handlePointerDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item.id);
      }}
    >
    <FurnitureBody
        item={previewItem}
        selected={selected}
        statusColor={statusColor}
      />
      <FurnitureLabel
        item={previewItem}
        message={selected ? statusMessage : ""}
        messageColor={statusMessageColor}
      />
    </group>
  );
}

export default function RoomScene3D({
  room,
  furniture,
  selectedId,
  viewMode,
  onSelect,
  onUpdateFurniture,
}: RoomScene3DProps) {
  return (
    <div className="room3d-canvas">
      <Canvas
        shadows
        camera={{ position: [5.5, 4.8, 6.8], fov: 45 }}
        onPointerMissed={() => onSelect(null)}
      >
        <CameraPreset viewMode={viewMode} room={room} />
        <color attach="background" args={["#f8fafc"]} />

        <ambientLight intensity={1.2} />
        <directionalLight
          position={[6, 10, 8]}
          intensity={1.4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <RoomBox room={room} />

        {furniture.map((item) => (
          <FurnitureMesh
            key={`${item.id}-${item.width}-${item.depth}-${item.rotationY}`}
            item={item}
            room={room}
            furniture={furniture}
            selected={selectedId === item.id}
            onSelect={onSelect}
            onUpdate={onUpdateFurniture}
          />
        ))}

        <Grid
          position={[0, 0.01, 0]}
          args={[20, 20]}
          cellSize={0.5}
          cellThickness={0.5}
          sectionSize={2}
          sectionThickness={1}
          fadeDistance={30}
          fadeStrength={1}
          infiniteGrid
        />

        <OrbitControls
          makeDefault
          enableRotate={false}
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={24}
        />
      </Canvas>
    </div>
  );
}
