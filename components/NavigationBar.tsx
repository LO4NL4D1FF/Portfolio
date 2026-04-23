'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';

interface Props {
  onBack: () => void;
  onHome: () => void;
  title: string;
}

export default function NavigationBar({ onBack, onHome, title }: Props) {
  return (
    <motion.div
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-40 safe-area-top"
    >
      <div className="lg-pill rounded-full p-1.5 flex items-center gap-1">
        <button
          onClick={onBack}
          aria-label="Back"
          className="btn-press w-9 h-9 rounded-full flex items-center justify-center text-muted hover:text-fg hover:bg-black/5 transition-colors relative z-10"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={2.25} />
        </button>

        <span className="px-3 text-sm font-semibold text-fg tracking-tight truncate max-w-[50vw] relative z-10">
          {title}
        </span>

        <button
          onClick={onHome}
          aria-label="Home"
          className="btn-press w-9 h-9 rounded-full flex items-center justify-center text-muted hover:text-fg hover:bg-black/5 transition-colors relative z-10"
        >
          <Home className="w-4 h-4" strokeWidth={2.25} />
        </button>
      </div>
    </motion.div>
  );
}
