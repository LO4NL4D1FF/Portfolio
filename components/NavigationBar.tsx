'use client';

import { motion } from 'framer-motion';
import { Home, X } from 'lucide-react';
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
    setTimeout(() => onBack(), 100);
  };

  const handleHome = () => {
    const sounds = getGameSounds();
    sounds.playSelect();
    setTimeout(() => onHome(), 100);
  };

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 safe-area-top"
    >
      <div
        className="relative bg-cyber-void/90 backdrop-blur-md border-b-2 border-neon-yellow"
        style={{ boxShadow: '0 4px 24px rgba(252, 238, 10, 0.25)' }}
      >
        {/* Accent scanlines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,240,255,0.2) 2px 3px)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="relative w-11 h-11 flex items-center justify-center bg-cyber-dark border-2 border-neon-magenta text-neon-magenta hover:text-cyber-void hover:bg-neon-magenta transition-all btn-press"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              boxShadow: '0 0 12px rgba(255,0,60,0.5)',
            }}
            title="Abort"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>

          {/* Title */}
          <div className="flex-1 flex items-center justify-center gap-3 min-w-0">
            <span className="hidden md:inline-block font-mono text-xs tracking-widest text-neon-cyan/70">[//</span>
            <h1
              className="font-cyber font-bold text-lg md:text-2xl tracking-[0.2em] text-neon-yellow truncate"
              style={{ textShadow: '0 0 8px #fcee0a' }}
            >
              {title}
            </h1>
            <span className="hidden md:inline-block font-mono text-xs tracking-widest text-neon-cyan/70">//]</span>
          </div>

          {/* Home button */}
          <button
            onClick={handleHome}
            className="relative w-11 h-11 flex items-center justify-center bg-cyber-dark border-2 border-neon-cyan text-neon-cyan hover:text-cyber-void hover:bg-neon-cyan transition-all btn-press"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
              boxShadow: '0 0 12px rgba(0,240,255,0.5)',
            }}
            title="Return to Main Deck"
          >
            <Home className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Bottom data strip */}
        <div className="relative bg-neon-yellow/10 border-t border-neon-yellow/30 py-1 overflow-hidden">
          <div className="flex items-center gap-8 font-mono text-[10px] tracking-widest text-neon-yellow/70 animate-pulse whitespace-nowrap px-4">
            <span>● LIVE</span>
            <span>NETWATCH: BYPASSED</span>
            <span>UPLINK: STABLE</span>
            <span>LOC: NIGHT CITY</span>
            <span>REGION: PACIFICA</span>
            <span>● LIVE</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
