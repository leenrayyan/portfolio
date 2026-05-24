import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { inSphere } from 'maath/random';

type Props = { count: number; radius: number; innerRadius?: number };

export default function Starfield({ count, radius, innerRadius = 60 }: Props) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    // sample inside a sphere, then push every point outward past `innerRadius`
    // so no star ends up close enough to the camera to render as a chunky quad
    const arr = new Float32Array(count * 3);
    inSphere(arr, { radius });
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = arr[i3];
      const y = arr[i3 + 1];
      const z = arr[i3 + 2];
      const d = Math.sqrt(x * x + y * y + z * z) || 1;
      if (d < innerRadius) {
        const k = innerRadius / d;
        arr[i3] = x * k;
        arr[i3 + 1] = y * k;
        arr[i3 + 2] = z * k;
      }
    }
    return arr;
  }, [count, radius, innerRadius]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.005;
      ref.current.rotation.x += delta * 0.002;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.1}
        sizeAttenuation={false}
        color="#FFFFFF"
        transparent
        opacity={0.78}
        depthWrite={false}
      />
    </points>
  );
}
