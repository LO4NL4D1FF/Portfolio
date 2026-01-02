'use client';

import { ReactNode } from 'react';

interface PixelArtContainerProps {
  children: ReactNode;
  showCRT?: boolean;
}

export default function PixelArtContainer({ children, showCRT = true }: PixelArtContainerProps) {
  return (
    <div className="relative w-full min-h-screen bg-game-bg overflow-x-hidden">
      {/* CRT effect overlay */}
      {showCRT && (
        <>
          <div className="fixed inset-0 crt-scanlines pointer-events-none z-50"></div>
          <div className="fixed inset-0 crt-effect pointer-events-none z-50"></div>
        </>
      )}

      {/* Content */}
      {children}
    </div>
  );
}
