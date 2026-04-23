'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Background from '@/components/Background';

export default function NotFound() {
  return (
    <>
      <Background />
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg rounded-4xl px-10 py-12 text-center max-w-sm w-full"
        >
          <div className="relative z-10">
            <p className="eyebrow mb-2">Not Found</p>
            <h1 className="headline font-bold text-7xl md:text-8xl text-fg mb-3">404</h1>
            <p className="text-sm text-muted mb-8">This page does not exist.</p>
            <Link href="/">
              <span className="btn-press btn-dark inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold">
                <ArrowLeft className="w-4 h-4" strokeWidth={2.25} />
                Return home
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
