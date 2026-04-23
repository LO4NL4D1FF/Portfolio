'use client';

import { motion } from 'framer-motion';
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
      className="fixed top-0 left-0 right-0 z-40 safe-area-top bg-ink-0/90 backdrop-blur border-b border-ink-line"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center gap-4">
        <button
          onClick={handleBack}
          className="font-mono text-xs tracking-[0.25em] text-dim hover:text-bone transition-colors btn-press"
        >
          ← BACK
        </button>

        <span className="h-5 w-px bg-ink-line" />

        <div className="flex-1 flex items-center gap-3 min-w-0">
          <span className="font-mono text-[11px] tracking-[0.25em] text-slate">/ /</span>
          <h1 className="font-sans font-light text-base md:text-lg tracking-[0.2em] text-bone truncate uppercase">
            {title}
          </h1>
        </div>

        <button
          onClick={handleHome}
          className="font-mono text-xs tracking-[0.25em] text-dim hover:text-amber transition-colors btn-press"
        >
          INDEX
        </button>
      </div>
    </motion.div>
  );
}
