interface DeskModelProps {
  width: number;
  depth: number;
  height: number;
  color: string;
}

export default function DeskModel({
  width,
  depth,
  height,
  color,
}: DeskModelProps) {
  const topHeight = height * 0.08;
  const legWidth = Math.max(width * 0.05, 0.04);
  const legDepth = Math.max(depth * 0.08, 0.04);
  const legHeight = height - topHeight;

  const offsetX = width / 2 - legWidth / 2 - 0.04;
  const offsetZ = depth / 2 - legDepth / 2 - 0.04;

  return (
    <group>
      {/* desktop */}
      <mesh position={[0, height - topHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, topHeight, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* legs */}
      {[
        [-offsetX, legHeight / 2, -offsetZ],
        [offsetX, legHeight / 2, -offsetZ],
        [-offsetX, legHeight / 2, offsetZ],
        [offsetX, legHeight / 2, offsetZ],
      ].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[legWidth, legHeight, legDepth]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      ))}
    </group>
  );
}
