'use client';

import { useEffect, useRef } from 'react';

interface UseSwipeBackOptions {
  onSwipeBack: () => void;
  threshold?: number;
}

export function useSwipeBack({ onSwipeBack, threshold = 100 }: UseSwipeBackOptions) {
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const isSwipingRef = useRef<boolean>(false);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only trigger from left edge (first 50px)
      if (e.touches[0].clientX > 50) return;

      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      isSwipingRef.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwipingRef.current) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - startX.current;
      const diffY = currentY - startY.current;

      // Only horizontal swipes (not vertical scrolling)
      if (Math.abs(diffY) > Math.abs(diffX)) {
        isSwipingRef.current = false;
        return;
      }

      // Prevent default to avoid page refresh on mobile
      if (diffX > 20) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isSwipingRef.current) return;

      const endX = e.changedTouches[0].clientX;
      const diffX = endX - startX.current;

      // Swipe right (back gesture)
      if (diffX > threshold) {
        onSwipeBack();
      }

      isSwipingRef.current = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeBack, threshold]);
}
