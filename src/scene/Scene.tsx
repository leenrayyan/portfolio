import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { KernelSize, BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useMemo } from 'react';
import Sun from './Sun';
import Planet from './Planet';
import Starfield from './Starfield';
import CameraRig from './CameraRig';
import SunLabel from './SunLabel';
import type { FocusTarget } from './types';

type Props = {
  focus: FocusTarget | null;
  onFocus: (target: FocusTarget | null) => void;
};

export default function Scene({ focus, onFocus }: Props) {
  const planets = useMemo(
    () => [
      {
        id: 'reactivation',
        name: 'Reactivation Pipeline',
        color: '#1ABC9C',
        emissive: '#0E7C7B',
        radius: 1.2,
        orbitRadius: 6,
        orbitSpeed: 0.05,
        orbitPhase: 0,
      },
      {
        id: 'cubesat',
        name: 'CubeSat Deorbit',
        color: '#D35400',
        emissive: '#6E1F0A',
        radius: 1.0,
        orbitRadius: 10,
        orbitSpeed: 0.03,
        orbitPhase: Math.PI,
      },
    ],
    []
  );

  return (
    <>
      {/* Sun is the only light source — the metaphor */}
      <pointLight
        position={[0, 0, 0]}
        intensity={120}
        distance={80}
        decay={1.6}
        color="#FFE7B0"
      />
      <ambientLight intensity={0.04} />

      <Starfield count={2500} radius={400} />

      <Sun />
      <SunLabel name="Leen" tagline="Building ML systems from orbit to enterprise" />

      {planets.map((p) => (
        <Planet
          key={p.id}
          {...p}
          onSelect={(pos, radius) => onFocus({ id: p.id, position: pos, radius })}
          dimmed={focus !== null && focus.id !== p.id}
        />
      ))}

      <CameraRig focus={focus} />

      <EffectComposer multisampling={0} frameBufferType={THREE.HalfFloatType}>
        <Bloom
          intensity={0.9}
          kernelSize={KernelSize.LARGE}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.4}
          mipmapBlur
        />
        <Vignette
          eskil={false}
          offset={0.2}
          darkness={0.85}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
}
