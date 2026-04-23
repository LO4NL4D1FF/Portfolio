'use client';

import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="w-full h-full bg-cyber-void flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-8 max-w-md"
      >
        <div
          className="relative cyber-panel cyber-panel-yellow cyber-corners p-6 md:p-8"
        >
          <p className="font-mono tracking-[0.4em] text-xs text-neon-cyan mb-3 text-center" style={{ textShadow: '0 0 6px #00f0ff' }}>
            // SYSTEM BOOT //
          </p>
          <h2 className="font-cyber font-black text-2xl md:text-4xl tracking-widest text-neon-yellow text-center" style={{ textShadow: '0 0 10px #fcee0a' }}>
            SEDO-TA
          </h2>
          <p className="font-mono text-sm tracking-widest text-neon-magenta text-center mt-2">
            PORTFOLIO.EXE
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-full max-w-xs">
          <div className="flex justify-between mb-2 font-mono text-xs tracking-widest text-cyber-ash">
            <span>ESTABLISHING UPLINK</span>
            <motion.span
              className="text-neon-green"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ...
            </motion.span>
          </div>
          <div className="h-2 bg-cyber-void border border-cyber-chrome overflow-hidden">
            <motion.div
              className="h-full bg-neon-yellow"
              style={{ boxShadow: '0 0 10px rgba(252,238,10,0.6)' }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>

        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [-6, 6, -6], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
              className="w-3 h-3 bg-neon-cyan"
              style={{ boxShadow: '0 0 8px #00f0ff' }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
