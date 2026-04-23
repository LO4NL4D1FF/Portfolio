'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

export default function ParallaxBackground() {
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -40]);

  // Pre-computed random values so server/client don't mismatch
  const stars = useMemo(
    () =>
      [...Array(60)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 70,
        color: ['#fcee0a', '#00f0ff', '#ff00aa', '#e0e7ff'][Math.floor(Math.random() * 4)],
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2,
      })),
    []
  );

  const buildings = useMemo(
    () =>
      [...Array(12)].map((_, i) => ({
        id: i,
        left: i * 9 + Math.random() * 3,
        width: Math.random() * 4 + 4,
        height: Math.random() * 35 + 30,
      })),
    []
  );

  const dataColumns = useMemo(
    () =>
      [...Array(10)].map((_, i) => ({
        id: i,
        left: (i * 10) + Math.random() * 5,
        duration: Math.random() * 10 + 12,
        delay: Math.random() * 5,
      })),
    []
  );

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-0">
      {/* Base ambient haze */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(139, 0, 255, 0.18) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 60%, rgba(255, 0, 60, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 100%, rgba(0, 240, 255, 0.12) 0%, transparent 60%)
          `,
        }}
      />

      {/* Far layer: stars + far skyline */}
      <motion.div style={{ y: y1 }} className="absolute inset-0">
        {stars.map((s) => (
          <motion.div
            key={`star-${s.id}`}
            className="absolute w-[2px] h-[2px]"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              backgroundColor: s.color,
              boxShadow: `0 0 4px ${s.color}`,
            }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: s.duration, repeat: Infinity, delay: s.delay }}
          />
        ))}

        {/* Far skyline silhouette */}
        <svg viewBox="0 0 1200 300" className="absolute bottom-0 left-0 right-0 w-full h-64 opacity-60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="farSkyline" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#8b00ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0a0a14" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <polygon
            points="0,300 0,200 60,180 90,150 140,150 180,120 220,120 260,90 320,90 360,140 420,140 460,100 520,100 560,160 620,160 660,130 720,130 760,90 820,90 860,140 920,140 960,160 1020,160 1060,120 1120,120 1160,170 1200,170 1200,300"
            fill="url(#farSkyline)"
          />
        </svg>
      </motion.div>

      {/* Mid layer: skyline buildings with lit windows */}
      <motion.div style={{ y: y2 }} className="absolute inset-0">
        {buildings.map((b) => (
          <div
            key={`bld-${b.id}`}
            className="absolute bottom-0"
            style={{
              left: `${b.left}%`,
              width: `${b.width}%`,
              height: `${b.height}%`,
              background: 'linear-gradient(180deg, #1a0033 0%, #000 100%)',
              borderTop: '1px solid rgba(252, 238, 10, 0.3)',
              boxShadow: '0 0 20px rgba(139, 0, 255, 0.3)',
            }}
          >
            {/* Windows */}
            <div
              className="absolute inset-x-1 top-2 bottom-2 opacity-70"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent 0 6px, rgba(252, 238, 10, 0.5) 6px 8px),
                  repeating-linear-gradient(90deg, transparent 0 4px, transparent 4px 6px)
                `,
              }}
            />
            {/* Neon sign tip */}
            <div
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-3"
              style={{
                background: ['#fcee0a', '#ff003c', '#00f0ff', '#ff00aa'][b.id % 4],
                boxShadow: `0 0 8px ${['#fcee0a', '#ff003c', '#00f0ff', '#ff00aa'][b.id % 4]}`,
              }}
            />
          </div>
        ))}

        {/* Horizontal neon line */}
        <div
          className="absolute left-0 right-0"
          style={{
            bottom: '22%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #ff003c, #fcee0a, #00f0ff, transparent)',
            boxShadow: '0 0 8px #ff003c',
          }}
        />
      </motion.div>

      {/* Foreground: perspective grid floor + data streams */}
      <motion.div style={{ y: y3 }} className="absolute inset-0">
        {/* Grid floor */}
        <div
          className="absolute inset-x-0 bottom-0 h-[35vh] opacity-50"
          style={{
            background: `
              linear-gradient(to top, rgba(255, 0, 60, 0.3) 0%, transparent 70%),
              repeating-linear-gradient(90deg, rgba(0, 240, 255, 0.35) 0 1px, transparent 1px 60px),
              repeating-linear-gradient(0deg, rgba(0, 240, 255, 0.35) 0 1px, transparent 1px 60px)
            `,
            transform: 'perspective(500px) rotateX(55deg)',
            transformOrigin: 'bottom',
          }}
        />

        {/* Falling data columns */}
        {dataColumns.map((c) => (
          <motion.div
            key={`col-${c.id}`}
            className="absolute top-0 w-[1px] h-40"
            style={{
              left: `${c.left}%`,
              background: 'linear-gradient(180deg, transparent, #39ff14, transparent)',
              boxShadow: '0 0 6px #39ff14',
            }}
            animate={{ y: ['-20vh', '120vh'] }}
            transition={{ duration: c.duration, repeat: Infinity, delay: c.delay, ease: 'linear' }}
          />
        ))}
      </motion.div>

      {/* Cyber grid overlay (faint) */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.6) 100%)' }}
      />
    </div>
  );
}
