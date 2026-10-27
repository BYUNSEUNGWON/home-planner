interface TableModelProps {
  width: number;
  depth: number;
  height: number;
  color: string;
}

export default function TableModel({
  width,
  depth,
  height,
  color,
}: TableModelProps) {
  const topHeight = height * 0.08;
  const legWidth = Math.max(width * 0.05, 0.04);
  const legDepth = Math.max(depth * 0.05, 0.04);
  const legHeight = height - topHeight;

  const offsetX = width / 2 - legWidth / 2 - 0.04;
  const offsetZ = depth / 2 - legDepth / 2 - 0.04;

  return (
    <group>
      {/* top */}
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
          <meshStandardMaterial color="#64748b" />
        </mesh>
      ))}
    </group>
  );
}
