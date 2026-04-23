'use client';

import { ReactNode } from 'react';

interface PixelArtContainerProps {
  children: ReactNode;
  showCRT?: boolean;
}

export default function PixelArtContainer({ children }: PixelArtContainerProps) {
  return (
    <div className="relative w-full min-h-screen bg-g-0 overflow-x-hidden">
      {children}
    </div>
  );
}
