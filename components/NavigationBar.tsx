'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { getGameSounds } from '@/lib/sounds';

interface NavigationBarProps {
  onBack: () => void;
  onHome: () => void;
  title: string;
}

export default function NavigationBar({ onBack, onHome, title }: NavigationBarProps) {
  const handleBack = () => {
    const sounds = getGameSounds();
    sounds.playClose();
    setTimeout(() => onBack(), 80);
  };

  const handleHome = () => {
    const sounds = getGameSounds();
    sounds.playSelect();
    setTimeout(() => onHome(), 80);
  };

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-40 safe-area-top"
    >
      <div className="glass rounded-full px-2 py-2 flex items-center gap-1">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-full flex items-center justify-center text-g-800 hover:text-white hover:bg-white/5 transition-colors btn-press"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
        </button>

        <span className="px-4 text-sm font-medium text-white tracking-tight truncate max-w-[50vw]">
          {title}
        </span>

        <button
          onClick={handleHome}
          className="w-9 h-9 rounded-full flex items-center justify-center text-g-800 hover:text-white hover:bg-white/5 transition-colors btn-press"
          aria-label="Home"
        >
          <Home className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>
    </motion.div>
  );
}
