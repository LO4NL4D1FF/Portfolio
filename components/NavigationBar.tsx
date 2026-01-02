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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-40 safe-area-top"
    >
      <div className="bg-pixel-black border-b-4 border-pixel-white shadow-pixel">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="w-12 h-12 bg-pixel-red border-4 border-pixel-white shadow-pixel-sm
                     hover:bg-pixel-orange transition-colors btn-press flex items-center justify-center"
          >
            <X className="w-6 h-6 text-pixel-white" strokeWidth={3} />
          </button>

          {/* Title */}
          <h1 className="font-game text-lg md:text-2xl text-pixel-yellow text-outline">
            {title}
          </h1>

          {/* Home button */}
          <button
            onClick={handleHome}
            className="w-12 h-12 bg-pixel-cyan border-4 border-pixel-white shadow-pixel-sm
                     hover:bg-pixel-indigo transition-colors btn-press flex items-center justify-center"
          >
            <Home className="w-6 h-6 text-pixel-white" strokeWidth={3} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
