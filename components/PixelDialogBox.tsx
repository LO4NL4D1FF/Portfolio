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
    setTimeout(() => onClose(), 80);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-ink-0/85 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="w-full max-w-2xl my-auto bg-ink-1 border border-ink-line"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-ink-line">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] tracking-[0.3em] text-slate mb-0.5">
                    / / BRIEF
                  </p>
                  <h2 className="font-sans font-light text-lg md:text-xl tracking-[0.1em] text-bone truncate">
                    {title}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center text-dim hover:text-amber transition-colors btn-press"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="font-sans text-sm md:text-base text-bone/90 leading-relaxed space-y-4">
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
