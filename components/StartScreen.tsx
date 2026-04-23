'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getGameSounds } from '@/lib/sounds';

interface StartScreenProps {
  onStart: () => void;
}

const BOOT_LINES = [
  '> NETWATCH KERNEL v2.077.13 BOOTING...',
  '> LOADING NEURAL INTERFACE DRIVERS [OK]',
  '> SYNCING RELIC BIOCHIP [OK]',
  '> BYPASSING ICE PROTOCOLS [OK]',
  '> UPLINK ESTABLISHED → NIGHT CITY NET',
  '> IDENTITY: V // HANDLE: SEDO-TA',
  '> WELCOME TO THE BIG LEAGUES, CHOOM',
];

export default function StartScreen({ onStart }: StartScreenProps) {
  const [mounted, setMounted] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setVisibleLines((n) => {
        if (n >= BOOT_LINES.length) {
          clearInterval(interval);
          return n;
        }
        return n + 1;
      });
    }, 280);
    return () => clearInterval(interval);
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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-cyber-void"
    >
      {/* Night City skyline glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-void via-cyber-dark to-cyber-dark pointer-events-none" />

      {/* Animated cyber grid floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none opacity-35"
        style={{
          background: `
            linear-gradient(to top, rgba(252, 238, 10, 0.18) 0%, transparent 70%),
            repeating-linear-gradient(90deg, rgba(0, 240, 255, 0.3) 0 1px, transparent 1px 80px),
            repeating-linear-gradient(0deg, rgba(0, 240, 255, 0.3) 0 1px, transparent 1px 80px)
          `,
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom',
        }}
      />

      {/* Particles / stars */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted && [...Array(60)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[2px] h-[2px]"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#fcee0a', '#00f0ff', '#e0e7ff'][Math.floor(Math.random() * 3)],
              boxShadow: '0 0 4px currentColor',
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
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
      <div className="relative z-10 text-center px-6 max-w-3xl w-full">
        {/* Terminal boot log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="cyber-panel cyber-panel-cyan cyber-corners cyber-corners-cyan p-4 mb-10 text-left font-mono text-sm md:text-base"
        >
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-neon-cyan/30">
            <span className="w-2 h-2 bg-neon-magenta animate-pulse" />
            <span className="w-2 h-2 bg-neon-yellow animate-pulse" />
            <span className="w-2 h-2 bg-neon-cyan animate-pulse" />
            <span className="ml-2 text-neon-cyan/60 tracking-widest">NETRUNNER_TERMINAL // 0x7F3A</span>
          </div>
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="text-neon-cyan" style={{ textShadow: '0 0 4px rgba(0,240,255,0.6)' }}>
              {line}
            </div>
          ))}
          {visibleLines < BOOT_LINES.length && (
            <span className="inline-block w-2 h-4 bg-neon-cyan animate-pulse ml-1" />
          )}
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-14"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="font-cyber tracking-[0.5em] text-sm md:text-base text-neon-cyan mb-4"
            style={{ textShadow: '0 0 8px #00f0ff' }}
          >
            WELCOME TO NIGHT CITY
          </motion.p>
          <h1
            className="glitch font-cyber font-black text-5xl md:text-8xl tracking-widest mb-3"
            data-text="SEDO-TA"
          >
            SEDO-TA
          </h1>
          <h2 className="font-mono text-lg md:text-2xl tracking-[0.3em] text-neon-magenta" style={{ textShadow: '0 0 8px #ff003c' }}>
            // PORTFOLIO.EXE
          </h2>
          <div className="mt-4 flex items-center justify-center gap-3 font-hud tracking-widest text-xs text-cyber-ash">
            <span className="h-px w-12 bg-neon-yellow" />
            <span>SAMURAI — WAKE THE F*** UP</span>
            <span className="h-px w-12 bg-neon-yellow" />
          </div>
        </motion.div>

        {/* Jack-in Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          onClick={handleStart}
          className="relative group no-select"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          <div className="absolute -inset-0.5 bg-neon-yellow opacity-40 blur-lg group-hover:opacity-70 transition-opacity" />
          <div
            className="relative px-10 md:px-16 py-5 md:py-6 bg-cyber-void border-2 border-neon-yellow font-cyber font-black tracking-[0.3em] text-xl md:text-2xl text-neon-yellow btn-press"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
              textShadow: '0 0 8px rgba(252, 238, 10, 0.7)',
            }}
          >
            &gt;&gt; JACK IN
          </div>
        </motion.button>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-10 font-hud tracking-widest text-sm md:text-base text-cyber-ash"
        >
          [TAP TO ESTABLISH NEURAL LINK]
        </motion.p>

        {/* Footer HUD */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-10 flex items-center justify-between font-mono text-[10px] md:text-xs text-cyber-ash/70 tracking-widest"
        >
          <span>REGION: PACIFICA</span>
          <span className="text-neon-yellow">● SECURE</span>
          <span>BUILD 2077.13.RELIC</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
