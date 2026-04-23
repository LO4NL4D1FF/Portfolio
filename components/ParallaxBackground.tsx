'use client';

import { useEffect, useState } from 'react';

export default function ParallaxBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-0">
      {/* Soft tinted blobs — give the glass something to frost against */}
      <div
        className="absolute rounded-full"
        style={{
          width: '55vmax',
          height: '55vmax',
          top: '-15vmax',
          left: '-15vmax',
          background: 'radial-gradient(circle, rgba(180, 190, 210, 0.5) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '50vmax',
          height: '50vmax',
          top: '15vh',
          right: '-20vmax',
          background: 'radial-gradient(circle, rgba(210, 200, 215, 0.45) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '65vmax',
          height: '65vmax',
          bottom: '-25vmax',
          left: '20vw',
          background: 'radial-gradient(circle, rgba(200, 210, 225, 0.4) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
}
