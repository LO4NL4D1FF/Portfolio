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
    }
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                       w-[95%] max-w-4xl max-h-[90vh]
                       z-50 flex flex-col"
          >
            {/* Outer border */}
            <div className="relative w-full h-full bg-pixel-black border-8 border-pixel-white shadow-pixel-lg">
              {/* Inner border */}
              <div className="absolute inset-2 border-4 border-pixel-gray"></div>

              {/* Content area */}
              <div className="relative h-full flex flex-col bg-gradient-to-b from-game-panel to-pixel-blue p-6 md:p-8">
                {/* Title bar */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b-4 border-pixel-yellow">
                  <h2 className="font-game text-xl md:text-3xl text-pixel-yellow text-outline leading-relaxed">
                    {title}
                  </h2>
                  <button
                    onClick={handleClose}
                    className="w-12 h-12 bg-pixel-red border-4 border-pixel-white shadow-pixel-sm
                             hover:bg-pixel-orange transition-colors btn-press flex items-center justify-center"
                  >
                    <X className="w-6 h-6 text-pixel-white" strokeWidth={3} />
                  </button>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <div className="font-pixel text-xl md:text-2xl text-pixel-white leading-relaxed space-y-4">
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
