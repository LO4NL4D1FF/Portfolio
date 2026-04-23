'use client';

import { useEffect, useState } from 'react';

export default function ParallaxBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-0">
      {/* Very faint grid */}
      <div className="absolute inset-0 cyber-grid opacity-60" />

      {/* Soft amber wash at top */}
      <div
        className="absolute inset-x-0 top-0 h-[40vh]"
        style={{
          background: 'radial-gradient(ellipse at 50% -20%, rgba(217, 166, 95, 0.06) 0%, transparent 70%)',
        }}
      />

      {/* Soft slate wash at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-[40vh]"
        style={{
          background: 'radial-gradient(ellipse at 50% 120%, rgba(107, 142, 145, 0.05) 0%, transparent 70%)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
    </div>
  );
}
