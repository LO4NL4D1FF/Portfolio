'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export default function StartScreen({ onStart }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className="text-center max-w-2xl"
      >
        <p className="eyebrow mb-5">Portfolio</p>

        <h1 className="headline font-bold text-fg text-6xl md:text-8xl mb-5">
          Sedo-Ta.
        </h1>

        <p className="text-lg md:text-xl text-muted max-w-md mx-auto mb-10 leading-snug">
          Software engineer &amp; product builder.
          <br className="hidden md:block" />
          Quiet tools that scale loud.
        </p>

        <button
          onClick={onStart}
          className="btn-press btn-dark group inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold tracking-tight"
        >
          Enter portfolio
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2.25} />
        </button>
      </motion.div>
    </motion.div>
  );
}
