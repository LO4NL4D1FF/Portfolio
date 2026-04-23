'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-3xl px-10 py-12 text-center max-w-sm w-full"
      >
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted mb-2">
          Not Found
        </p>
        <h1 className="headline font-semibold text-7xl md:text-8xl text-fg mb-3">
          404
        </h1>
        <p className="text-sm text-muted mb-8">
          This page does not exist.
        </p>

        <Link href="/">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-fg text-white text-sm font-medium hover:bg-black transition-colors btn-press">
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            Return home
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
