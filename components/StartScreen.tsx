'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getGameSounds } from '@/lib/sounds';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStart = () => {
    const sounds = getGameSounds();
    sounds.playStart();
    setTimeout(() => onStart(), 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-game-bg overflow-hidden"
    >
      {/* Starfield background */}
      <div className="absolute inset-0">
        {mounted && [...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-pixel-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6">
        {/* Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-game text-xl md:text-2xl text-pixel-lime text-outline mb-6 leading-relaxed"
          >
            WELCOME TO
          </motion.p>
          <h1 className="font-game text-3xl md:text-5xl text-pixel-yellow text-outline mb-4 leading-relaxed">
            SEDO-TA
          </h1>
          <h2 className="font-game text-lg md:text-2xl text-pixel-cyan text-outline leading-relaxed">
            PORTFOLIO.EXE
          </h2>
        </motion.div>

        {/* Press Start Button */}
        <motion.button
          onClick={handleStart}
          className="relative font-game text-xl md:text-3xl text-pixel-white text-outline
                     bg-gradient-to-b from-pixel-pink to-pixel-red
                     px-12 py-6
                     shadow-pixel hover:shadow-pixel-sm
                     transition-all duration-100
                     btn-press no-select
                     border-4 border-pixel-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: [
              '4px 4px 0px rgba(13, 13, 13, 0.8)',
              '6px 6px 0px rgba(13, 13, 13, 0.8)',
              '4px 4px 0px rgba(13, 13, 13, 0.8)',
            ],
          }}
          transition={{
            boxShadow: {
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            PRESS START
          </motion.span>
        </motion.button>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12 font-pixel text-2xl text-pixel-light"
        >
          Click or tap to begin your adventure
        </motion.p>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-pixel-blue/30 to-transparent"></div>
    </motion.div>
  );
}
