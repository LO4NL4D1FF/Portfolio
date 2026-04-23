'use client';

import { ReactNode } from 'react';

interface PixelArtContainerProps {
  children: ReactNode;
  showCRT?: boolean;
}

export default function PixelArtContainer({ children, showCRT = true }: PixelArtContainerProps) {
  return (
    <div className="relative w-full min-h-screen bg-cyber-void overflow-x-hidden cyber-noise">
      {/* CRT + scanlines + sweep overlays */}
      {showCRT && (
        <>
          <div className="fixed inset-0 crt-scanlines pointer-events-none z-40" />
          <div className="fixed inset-0 crt-effect pointer-events-none z-40" />
          <div className="scan-sweep pointer-events-none" />
        </>
      )}

      {/* Content */}
      {children}
    </div>
  );
}
