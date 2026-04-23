'use client';

import { useEffect, useState } from 'react';

/**
 * Soft, drifting tinted blobs sitting behind the UI.
 * They give the liquid glass surfaces something colorful to refract,
 * which is what makes translucent panels feel alive.
 */
export default function Background() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-white">
      {/* Blob 1 — warm peach / rose */}
      <div
        className="absolute rounded-full animate-drift1"
        style={{
          width: '60vmax',
          height: '60vmax',
          top: '-20vmax',
          left: '-15vmax',
          background:
            'radial-gradient(circle at 50% 50%, rgba(255, 180, 200, 0.55) 0%, rgba(255, 180, 200, 0) 60%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Blob 2 — cool periwinkle / lavender */}
      <div
        className="absolute rounded-full animate-drift2"
        style={{
          width: '55vmax',
          height: '55vmax',
          top: '10vh',
          right: '-20vmax',
          background:
            'radial-gradient(circle at 50% 50%, rgba(170, 190, 255, 0.55) 0%, rgba(170, 190, 255, 0) 60%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Blob 3 — soft mint */}
      <div
        className="absolute rounded-full animate-drift3"
        style={{
          width: '65vmax',
          height: '65vmax',
          bottom: '-30vmax',
          left: '15vw',
          background:
            'radial-gradient(circle at 50% 50%, rgba(180, 230, 215, 0.50) 0%, rgba(180, 230, 215, 0) 60%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Subtle grain to keep gradients from banding */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}
