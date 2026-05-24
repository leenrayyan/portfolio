import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Vector3Tuple } from 'three';

type Props = {
  id: string;
  name: string;
  color: string;
  emissive: string;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  dimmed: boolean;
  onSelect: (position: Vector3Tuple, radius: number) => void;
};

export default function Planet({
  name,
  color,
  emissive,
  radius,
  orbitRadius,
  orbitSpeed,
  orbitPhase,
  dimmed,
  onSelect,
}: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      const angle = orbitPhase + t * orbitSpeed;
      groupRef.current.position.x = Math.cos(angle) * orbitRadius;
      groupRef.current.position.z = Math.sin(angle) * orbitRadius;
      groupRef.current.position.y = Math.sin(angle * 0.5) * 0.3;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          if (groupRef.current) {
            const p = groupRef.current.position;
            onSelect([p.x, p.y, p.z], radius);
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        scale={hovered ? 1.08 : 1}
      >
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={hovered ? 0.45 : 0.22}
          roughness={0.55}
          metalness={0.15}
          opacity={dimmed ? 0.35 : 1}
          transparent={dimmed}
        />
      </mesh>
      {/* subtle rim ring to make it readable against dark space */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 1.04, radius * 1.06, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} toneMapped={false} />
      </mesh>
      {/* invisible name placeholder — wire this up later */}
      <group visible={false} data-name={name} />
    </group>
  );
}
