import { Canvas } from '@react-three/fiber';
import { Suspense, useState, useEffect } from 'react';
import Scene from './scene/Scene';
import type { FocusTarget } from './scene/types';

export default function App() {
  const [focus, setFocus] = useState<FocusTarget | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocus(null);
    };
    window.addEventListener('keydown', onKey);
    if (import.meta.env.DEV) {
      (window as unknown as { __setFocus?: typeof setFocus }).__setFocus = setFocus;
    }
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 2, 14], fov: 55, near: 0.1, far: 2000 }}
        onPointerMissed={() => setFocus(null)}
      >
        <color attach="background" args={['#000008']} />
        <Suspense fallback={null}>
          <Scene focus={focus} onFocus={setFocus} />
        </Suspense>
      </Canvas>

      <div className="hud">
        <div className="hud-corner tl">Leen Rayyan · Portfolio</div>
        <div className="hud-corner br">drift · click to explore</div>
      </div>

      {focus && (
        <div className="hint" style={{ opacity: 1 }}>
          press esc to return
        </div>
      )}
    </>
  );
}
