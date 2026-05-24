import { Html } from '@react-three/drei';

type Props = { name: string; tagline: string };

export default function SunLabel({ name, tagline }: Props) {
  return (
    <Html
      position={[0, -2.6, 0]}
      center
      transform={false}
      style={{
        pointerEvents: 'none',
        userSelect: 'none',
        color: '#FFE7B0',
        textShadow: '0 0 20px rgba(255, 231, 176, 0.4)',
        textAlign: 'center',
        width: 'min(80vw, 520px)',
      }}
    >
      <div style={{ fontSize: '1.7rem', fontWeight: 300, letterSpacing: '0.12em' }}>{name}</div>
      <div
        style={{
          fontSize: '0.68rem',
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          opacity: 0.65,
          marginTop: '0.5rem',
          whiteSpace: 'nowrap',
        }}
      >
        {tagline}
      </div>
    </Html>
  );
}
