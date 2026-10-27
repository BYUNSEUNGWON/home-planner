interface WardrobeModelProps {
  width: number;
  depth: number;
  height: number;
  color: string;
}

export default function WardrobeModel({
  width,
  depth,
  height,
  color,
}: WardrobeModelProps) {
  return (
    <group>
      {/* main body */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* door line */}
      <mesh position={[0, height / 2, depth / 2 + 0.001]}>
        <boxGeometry args={[0.01, height * 0.9, 0.01]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* handles */}
      <mesh position={[-width * 0.12, height * 0.55, depth / 2 + 0.01]}>
        <boxGeometry args={[0.02, height * 0.18, 0.02]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      <mesh position={[width * 0.12, height * 0.55, depth / 2 + 0.01]}>
        <boxGeometry args={[0.02, height * 0.18, 0.02]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}
