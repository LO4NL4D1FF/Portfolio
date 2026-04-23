'use client';

import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="w-full h-full min-h-screen bg-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-3xl px-10 py-10 text-center max-w-sm w-full"
      >
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted mb-2">
          Loading
        </p>
        <h1 className="headline font-semibold text-2xl text-fg mb-6">
          Sedo-Ta.
        </h1>

        <div className="relative w-40 h-1 rounded-full bg-black/5 mx-auto overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 w-12 rounded-full bg-fg"
            animate={{ x: ['-100%', '320%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
