'use client';

import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="w-full h-full bg-game-bg flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-8 px-6"
      >
        {/* Welcome Message */}
        <div className="bg-pixel-black border-4 border-pixel-white p-6 md:p-8 shadow-pixel-lg">
          <div className="border-2 border-pixel-gray p-4 md:p-6">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-game text-xl md:text-2xl lg:text-3xl text-pixel-yellow text-outline text-center leading-relaxed"
            >
              WELCOME TO
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-game text-2xl md:text-3xl lg:text-4xl text-pixel-cyan text-outline text-center leading-relaxed mt-4"
            >
              SEDO-TA
            </motion.h2>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="font-game text-lg md:text-xl lg:text-2xl text-pixel-pink text-outline text-center leading-relaxed mt-2"
            >
              PORTFOLIO.EXE
            </motion.h3>
          </div>
        </div>

        {/* Loading Dots - pixel style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [-8, 8, -8],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
              className="w-4 h-4 bg-pixel-cyan border-2 border-pixel-white shadow-pixel-sm"
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
