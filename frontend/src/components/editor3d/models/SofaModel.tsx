interface SofaModelProps {
  width: number;
  depth: number;
  height: number;
  color: string;
}

export default function SofaModel({
  width,
  depth,
  height,
  color,
}: SofaModelProps) {
  const seatHeight = height * 0.42;
  const backHeight = height * 0.58;
  const armWidth = width * 0.12;

  return (
    <group>
      {/* seat */}
      <mesh position={[0, seatHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, seatHeight, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* back */}
      <mesh
        position={[0, seatHeight + backHeight / 2 - 0.03, -depth / 2 + 0.08]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, backHeight, 0.16]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>

      {/* left arm */}
      <mesh
        position={[-width / 2 + armWidth / 2, seatHeight + backHeight * 0.2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[armWidth, backHeight * 0.7, depth]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>

      {/* right arm */}
      <mesh
        position={[width / 2 - armWidth / 2, seatHeight + backHeight * 0.2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[armWidth, backHeight * 0.7, depth]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
    </group>
  );
}
