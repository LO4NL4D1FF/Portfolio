'use client';

import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="w-full h-full min-h-screen bg-ink-0 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <p className="font-mono text-[11px] tracking-[0.4em] text-slate mb-3">
          / / LOADING
        </p>
        <h1 className="font-sans font-light text-4xl tracking-[0.2em] text-bone mb-8">
          SEDO-TA
        </h1>

        <div className="relative w-48 h-px bg-ink-line mx-auto">
          <motion.div
            className="absolute inset-y-0 left-0 bg-amber w-12"
            style={{ height: '1px' }}
            animate={{ x: ['-100%', '400%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
