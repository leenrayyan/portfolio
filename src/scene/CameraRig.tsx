import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import type { FocusTarget } from './types';

type Props = { focus: FocusTarget | null };

const DRIFT_POSITION = new THREE.Vector3(0, 2, 14);
const DRIFT_LOOKAT = new THREE.Vector3(0, 0, 0);

export default function CameraRig({ focus }: Props) {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const tweenRef = useRef<gsap.core.Timeline | null>(null);
  const driftEnabled = useRef(true);

  useEffect(() => {
    tweenRef.current?.kill();

    if (focus) {
      // Fly toward planet, framed so the sun-lit hemisphere faces the camera.
      // Camera sits between sun and planet, offset upward + tangentially so we
      // don't stare into the sun's bloom.
      const target = new THREE.Vector3(...focus.position);
      const toSun = target.clone().negate().normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const tangent = new THREE.Vector3().crossVectors(toSun, up).normalize();
      const camOffset = toSun
        .clone()
        .multiplyScalar(0.55)
        .add(up.clone().multiplyScalar(0.35))
        .add(tangent.multiplyScalar(0.6))
        .normalize()
        .multiplyScalar(focus.radius * 4.2);
      const camTarget = target.clone().add(camOffset);

      driftEnabled.current = false;
      const tl = gsap.timeline();
      tl.to(camera.position, {
        x: camTarget.x,
        y: camTarget.y,
        z: camTarget.z,
        duration: 1.6,
        ease: 'power3.inOut',
      });
      tl.to(
        lookAtTarget.current,
        {
          x: target.x,
          y: target.y,
          z: target.z,
          duration: 1.6,
          ease: 'power3.inOut',
        },
        '<'
      );
      tweenRef.current = tl;
    } else {
      // Return to drift
      const tl = gsap.timeline({
        onComplete: () => {
          driftEnabled.current = true;
        },
      });
      tl.to(camera.position, {
        x: DRIFT_POSITION.x,
        y: DRIFT_POSITION.y,
        z: DRIFT_POSITION.z,
        duration: 1.8,
        ease: 'power3.inOut',
      });
      tl.to(
        lookAtTarget.current,
        {
          x: DRIFT_LOOKAT.x,
          y: DRIFT_LOOKAT.y,
          z: DRIFT_LOOKAT.z,
          duration: 1.8,
          ease: 'power3.inOut',
        },
        '<'
      );
      tweenRef.current = tl;
    }

    return () => {
      tweenRef.current?.kill();
    };
  }, [focus, camera]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (driftEnabled.current && !focus) {
      // gentle ambient drift — never goes far
      camera.position.x = DRIFT_POSITION.x + Math.sin(t * 0.08) * 0.6;
      camera.position.y = DRIFT_POSITION.y + Math.sin(t * 0.06) * 0.3;
      camera.position.z = DRIFT_POSITION.z + Math.cos(t * 0.05) * 0.4;
    }
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
