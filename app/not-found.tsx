'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink-0 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-sm w-full"
      >
        <p className="font-mono text-[11px] tracking-[0.4em] text-slate mb-3">
          / / SIGNAL LOST
        </p>
        <h1 className="font-sans font-light text-7xl md:text-8xl tracking-[0.15em] text-bone mb-4">
          404
        </h1>
        <p className="font-sans text-base text-bone/80 mb-2">
          Route not found.
        </p>
        <p className="font-sans text-sm text-dim mb-10">
          This address does not exist on the grid.
        </p>

        <Link href="/">
          <span className="inline-flex items-center gap-3 px-6 py-3 border border-amber text-amber font-mono text-xs tracking-[0.3em] hover:bg-amber hover:text-ink-0 transition-colors btn-press">
            ← RETURN
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
