import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Sun() {
  const ref = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Sprite>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // gentle heartbeat — every ~3.5s
    const pulse = 1 + Math.sin(t * 1.8) * 0.015 + Math.sin(t * 0.4) * 0.01;
    if (ref.current) ref.current.scale.setScalar(pulse);
    if (haloRef.current) {
      const s = 7 * (1 + Math.sin(t * 0.7) * 0.04);
      haloRef.current.scale.set(s, s, 1);
    }
  });

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshBasicMaterial color="#FFE7B0" toneMapped={false} />
      </mesh>
      {/* outer corona — billboard sprite with radial falloff so bloom blooms a gradient, not a ring */}
      <sprite ref={haloRef} scale={[7, 7, 1]}>
        <spriteMaterial
          map={makeGlowTexture()}
          color="#FFC97A"
          transparent
          opacity={0.55}
          toneMapped={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}

// procedural radial gradient — no asset to ship
let cached: THREE.CanvasTexture | null = null;
function makeGlowTexture(): THREE.CanvasTexture {
  if (cached) return cached;
  const size = 256;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255, 231, 176, 1)');
  g.addColorStop(0.25, 'rgba(255, 201, 122, 0.55)');
  g.addColorStop(0.55, 'rgba(255, 158, 80, 0.18)');
  g.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  cached = new THREE.CanvasTexture(c);
  cached.needsUpdate = true;
  return cached;
}
