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
  isOpen, onClose, title, children,
}: PixelDialogBoxProps) {
  useEffect(() => {
    if (isOpen) {
      getGameSounds().playOpen();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = () => {
    getGameSounds().playClose();
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
            className="fixed inset-0 bg-black/20 backdrop-blur-md z-40"
          />

          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="w-full max-w-2xl my-auto glass-strong rounded-3xl overflow-hidden"
              style={{ pointerEvents: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
                <h2 className="font-semibold text-base md:text-lg text-fg tracking-tight truncate">
                  {title}
                </h2>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full glass-subtle flex items-center justify-center text-muted hover:text-fg transition-colors btn-press"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>

              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="text-sm text-fg-soft leading-relaxed">
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
