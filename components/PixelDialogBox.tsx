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
            className="fixed inset-0 bg-cyber-void/80 backdrop-blur-md z-40"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="w-full max-w-4xl my-auto"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Outer glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-yellow via-neon-magenta to-neon-cyan opacity-50 blur-lg animate-pulse" />

                {/* Dialog body */}
                <div
                  className="relative bg-cyber-dark border-2 border-neon-yellow cyber-clip-lg"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(18,18,31,0.97), rgba(5,5,10,0.97))',
                    boxShadow: '0 0 40px rgba(252, 238, 10, 0.4)',
                  }}
                >
                  {/* Scanline overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-15"
                    style={{ background: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,240,255,0.3) 2px 3px)' }}
                  />

                  <div className="relative p-6 md:p-8">
                    {/* Title bar */}
                    <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-neon-yellow/40">
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-[10px] md:text-xs tracking-widest text-neon-cyan/80">
                          /// CONTRACT BRIEF · OPEN FILE
                        </p>
                        <h2
                          className="font-cyber font-black text-lg md:text-2xl tracking-widest text-neon-yellow truncate"
                          style={{ textShadow: '0 0 8px #fcee0a' }}
                        >
                          {title}
                        </h2>
                      </div>
                      <button
                        onClick={handleClose}
                        className="w-10 h-10 flex items-center justify-center border-2 border-neon-magenta text-neon-magenta hover:bg-neon-magenta hover:text-cyber-void transition-all btn-press flex-shrink-0"
                        style={{
                          clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                          boxShadow: '0 0 10px rgba(255,0,60,0.5)',
                        }}
                      >
                        <X className="w-5 h-5" strokeWidth={2.5} />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="font-hud text-sm md:text-base text-cyber-bone leading-relaxed space-y-4">
                        {children}
                      </div>
                    </div>

                    {showArrow && (
                      <motion.div
                        className="mt-5 text-right"
                        animate={{ x: [0, 6, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <span className="font-cyber font-bold text-neon-yellow" style={{ textShadow: '0 0 6px #fcee0a' }}>▶▶▶</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
