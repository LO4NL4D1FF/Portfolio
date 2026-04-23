'use client';

import { useEffect, useState } from 'react';

export default function ParallaxBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-0">
      {/* Three soft gray blobs — give glass something to frost */}
      <div
        className="absolute rounded-full"
        style={{
          width: '60vmax',
          height: '60vmax',
          top: '-20vmax',
          left: '-20vmax',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '55vmax',
          height: '55vmax',
          top: '20vh',
          right: '-20vmax',
          background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '70vmax',
          height: '70vmax',
          bottom: '-30vmax',
          left: '10vw',
          background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Deep vignette at edges */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
}
