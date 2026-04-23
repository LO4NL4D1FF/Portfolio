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
    setTimeout(() => onStart(), 160);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="glass rounded-3xl px-10 md:px-14 py-12 md:py-16 max-w-md w-full text-center"
      >
        <p className="text-xs tracking-[0.3em] text-g-700 uppercase mb-6">
          Portfolio
        </p>

        <h1 className="font-sans font-light text-5xl md:text-6xl tracking-tight text-white mb-3">
          Sedo-Ta
        </h1>

        <p className="text-base text-g-800 mb-10">
          Software engineer &amp; product builder
        </p>

        <button
          onClick={handleStart}
          className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-full glass glass-hover text-white font-medium text-sm"
        >
          Enter
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} />
        </button>
      </motion.div>
    </motion.div>
  );
}
