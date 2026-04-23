'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { getGameSounds } from '@/lib/sounds';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleStart = () => {
    const sounds = getGameSounds();
    sounds.playStart();
    setTimeout(() => onStart(), 140);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className="text-center max-w-2xl"
      >
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-5">
          Portfolio
        </p>

        <h1 className="headline font-semibold text-fg text-6xl md:text-8xl mb-5">
          Sedo-Ta.
        </h1>

        <p className="text-xl md:text-2xl text-fg-soft max-w-xl mx-auto mb-10 leading-snug">
          Software engineer and product builder.
          <br className="hidden md:block" />
          Shipping quiet, considered tools.
        </p>

        <button
          onClick={handleStart}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-fg text-white text-sm font-medium hover:bg-black transition-colors btn-press"
        >
          Enter portfolio
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
        </button>
      </motion.div>
    </motion.div>
  );
}
