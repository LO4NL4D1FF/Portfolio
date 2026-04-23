'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getGameSounds } from '@/lib/sounds';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStart = () => {
    const sounds = getGameSounds();
    sounds.playStart();
    setTimeout(() => onStart(), 180);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-0"
    >
      {/* Top meta bar */}
      <div className="absolute top-0 inset-x-0 border-b border-ink-line">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-dim">
          <span>SEDO-TA / TERMINAL</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber" />
            READY
          </span>
        </div>
      </div>

      {/* Bottom meta bar */}
      <div className="absolute bottom-0 inset-x-0 border-t border-ink-line">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between font-mono text-[11px] tracking-[0.2em] text-dim">
          <span>v2.0.77</span>
          <span>UTC · 02:47</span>
        </div>
      </div>

      {/* Centered content */}
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={mounted ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center px-8 max-w-xl"
      >
        <p className="font-mono text-[11px] tracking-[0.4em] text-slate mb-8">
          / / PORTFOLIO
        </p>

        <h1 className="font-sans font-light text-5xl md:text-7xl tracking-[0.2em] text-bone mb-4">
          SEDO-TA
        </h1>

        <div className="flex items-center justify-center gap-3 mb-12">
          <span className="h-px w-10 bg-ink-line" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-dim">
            SOFTWARE · ENGINEER
          </span>
          <span className="h-px w-10 bg-ink-line" />
        </div>

        <button
          onClick={handleStart}
          className="group inline-flex items-center gap-3 px-8 py-3 border border-amber text-amber font-mono text-sm tracking-[0.3em] hover:bg-amber hover:text-ink-0 transition-colors duration-200 btn-press"
        >
          <span className="w-1.5 h-1.5 bg-amber group-hover:bg-ink-0 transition-colors" />
          ENTER
        </button>

        <p className="mt-10 font-mono text-[10px] tracking-[0.3em] text-dim">
          press enter to establish connection
        </p>
      </motion.div>

      {/* Corner ticks */}
      <div className="absolute top-12 left-6 w-3 h-px bg-ink-line" />
      <div className="absolute top-12 left-6 w-px h-3 bg-ink-line" />
      <div className="absolute bottom-12 right-6 w-3 h-px bg-ink-line" />
      <div className="absolute bottom-12 right-6 w-px h-3 bg-ink-line -translate-y-full" />
    </motion.div>
  );
}
