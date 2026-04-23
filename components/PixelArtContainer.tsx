'use client';

import { ReactNode } from 'react';

interface PixelArtContainerProps {
  children: ReactNode;
  showCRT?: boolean;
}

export default function PixelArtContainer({ children, showCRT = true }: PixelArtContainerProps) {
  return (
    <div className="relative w-full min-h-screen bg-ink-0 overflow-x-hidden">
      {showCRT && (
        <div className="fixed inset-0 scanlines pointer-events-none z-40" />
      )}
      {children}
    </div>
  );
}
