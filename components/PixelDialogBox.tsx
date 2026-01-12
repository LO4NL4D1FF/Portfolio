'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { getGameSounds } from '@/lib/sounds';

interface PixelDialogBoxProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  showArrow?: boolean;
}

export default function PixelDialogBox({
  isOpen,
  onClose,
  title,
  children,
  showArrow = true,
}: PixelDialogBoxProps) {
  useEffect(() => {
    if (isOpen) {
      const sounds = getGameSounds();
      sounds.playOpen();
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    const sounds = getGameSounds();
    sounds.playClose();
    setTimeout(() => onClose(), 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          />

          {/* Dialog Box */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="w-full max-w-4xl my-auto"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Outer border */}
              <div className="relative bg-pixel-black border-8 border-pixel-white shadow-pixel-lg">
                {/* Inner border */}
                <div className="absolute inset-2 border-4 border-pixel-gray pointer-events-none"></div>

                {/* Content area */}
                <div className="relative bg-gradient-to-b from-game-panel to-pixel-blue p-6 md:p-8">
                  {/* Title bar */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-pixel-yellow">
                    <h2 className="font-game text-xl md:text-3xl text-pixel-yellow text-outline leading-relaxed">
                      {title}
                    </h2>
                    <button
                      onClick={handleClose}
                      className="w-12 h-12 bg-pixel-red border-4 border-pixel-white shadow-pixel-sm
                               hover:bg-pixel-orange transition-colors btn-press flex items-center justify-center flex-shrink-0"
                    >
                      <X className="w-6 h-6 text-pixel-white" strokeWidth={3} />
                    </button>
                  </div>

                  {/* Scrollable content */}
                  <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="font-pixel text-lg md:text-xl lg:text-2xl text-pixel-white leading-relaxed space-y-4">
                      {children}
                    </div>
                  </div>

                  {/* Continue arrow */}
                  {showArrow && (
                    <motion.div
                      className="mt-6 text-right"
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <span className="font-game text-2xl text-pixel-yellow">▶</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
