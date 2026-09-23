type Tone = 'dark' | 'sun' | 'light';

interface LogoMarkProps {
  size?: number;
  tone?: Tone;
  className?: string;
}

const TONES: Record<Tone, { tile: string; letters: string; cursor: string }> = {
  dark: { tile: '#000000', letters: '#FFFFFF', cursor: '#F5B82E' },
  sun: { tile: '#F5B82E', letters: '#000000', cursor: '#FFFFFF' },
  light: { tile: '#FFFFFF', letters: '#000000', cursor: '#F5B82E' },
};

/**
 * "LS" monogram: an L and an S drawn as single strokes, with an accent
 * cursor block. Strokes draw themselves in on load (see .logo-stroke in globals.css).
 */
export default function LogoMark({ size = 36, tone = 'dark', className = '' }: LogoMarkProps) {
  const { tile, letters, cursor } = TONES[tone];

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="LS monogram" className={className}>
      <rect width="48" height="48" rx="12" fill={tile} />
      <g fill="none" stroke={letters} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">
        <path className="logo-stroke" pathLength={1} d="M11 11 V35 H21" />
        <path
          className="logo-stroke logo-stroke-late"
          pathLength={1}
          d="M36 14 C31 10 24 12 25.5 18 C27 23 36 22 36 29 C36 35.5 28.5 37 24.5 33.5"
        />
      </g>
      <rect x="33" y="36" width="7" height="3.5" rx="1" fill={cursor} />
    </svg>
  );
}
