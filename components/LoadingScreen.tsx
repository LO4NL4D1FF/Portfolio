'use client';

import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="w-full h-full min-h-screen bg-g-0 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-3xl px-10 py-12 text-center max-w-sm w-full"
      >
        <p className="text-xs tracking-[0.3em] text-g-700 uppercase mb-3">
          Loading
        </p>
        <h1 className="font-sans font-light text-3xl tracking-tight text-white mb-8">
          Sedo-Ta
        </h1>

        <div className="relative w-48 h-1 rounded-full bg-white/5 mx-auto overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 w-16 rounded-full bg-white/70"
            animate={{ x: ['-100%', '320%'] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
