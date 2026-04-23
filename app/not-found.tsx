'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cyber-void flex items-center justify-center p-6 cyber-noise">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md w-full"
      >
        <div className="cyber-panel cyber-panel-magenta cyber-corners p-8">
          <motion.h1
            className="glitch font-cyber font-black text-7xl md:text-8xl tracking-widest mb-4"
            data-text="404"
          >
            404
          </motion.h1>

          <p className="font-mono text-xs tracking-[0.4em] text-neon-cyan mb-3" style={{ textShadow: '0 0 6px #00f0ff' }}>
            /// SIGNAL LOST ///
          </p>

          <p className="font-cyber font-bold text-lg md:text-xl tracking-widest text-neon-magenta mb-2" style={{ textShadow: '0 0 6px #ff003c' }}>
            CONSTRUCT NOT FOUND
          </p>

          <p className="font-hud text-sm text-cyber-ash mb-8">
            This sector has been flatlined or never existed in the net.
          </p>

          <Link href="/">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-cyber-dark border-2 border-neon-yellow text-neon-yellow font-cyber font-bold tracking-widest btn-press"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                boxShadow: '0 0 12px rgba(252,238,10,0.5)',
                textShadow: '0 0 6px #fcee0a',
              }}
            >
              <Home size={18} strokeWidth={2} />
              RETURN TO DECK
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
