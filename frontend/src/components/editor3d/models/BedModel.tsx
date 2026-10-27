interface BedModelProps {
  width: number;
  depth: number;
  height: number;
  color: string;
}

export default function BedModel({
  width,
  depth,
  height,
  color,
}: BedModelProps) {
  const frameHeight = height * 0.35;
  const mattressHeight = height * 0.28;
  const headboardHeight = height * 0.8;

  return (
    <group>
      {/* bed frame */}
      <mesh position={[0, frameHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, frameHeight, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* mattress */}
      <mesh
        position={[0, frameHeight + mattressHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width * 0.96, mattressHeight, depth * 0.96]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* headboard */}
      <mesh
        position={[0, headboardHeight / 2, -depth / 2 + 0.04]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, headboardHeight, 0.08]} />
        <meshStandardMaterial color="#6d28d9" />
      </mesh>
    </group>
  );
}
