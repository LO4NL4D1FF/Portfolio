'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-android-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-8xl mb-6"
        >
          ⚠️
        </motion.div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-android-text mb-4">404</h1>

        {/* Error Message */}
        <p className="text-xl text-android-text-secondary mb-2">
          App Not Found
        </p>
        <p className="text-sm text-android-text-secondary mb-8">
          The page you&apos;re looking for doesn&apos;t exist in this OS.
        </p>

        {/* Back to Home */}
        <Link href="/">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-android-accent text-white font-semibold rounded-2xl shadow-oneui mx-auto"
          >
            <Home size={18} />
            Return to Home Screen
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
