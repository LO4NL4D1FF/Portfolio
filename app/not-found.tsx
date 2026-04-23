'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-g-0 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-3xl px-10 py-12 text-center max-w-sm w-full"
      >
        <p className="text-xs tracking-[0.3em] text-g-700 uppercase mb-3">
          Not Found
        </p>
        <h1 className="font-sans font-light text-7xl md:text-8xl tracking-tight text-white mb-4">
          404
        </h1>
        <p className="text-sm text-g-800 mb-10">
          This page does not exist.
        </p>

        <Link href="/">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass glass-hover text-white text-sm font-medium btn-press">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
            Return home
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
