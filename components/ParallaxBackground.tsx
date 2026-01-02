'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ParallaxBackground() {
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -50]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Layer 1 - Far background (slowest) */}
      <motion.div style={{ y: y1 }} className="absolute inset-0">
        {/* Mountains */}
        <div className="absolute bottom-0 left-0 right-0 h-48">
          <svg viewBox="0 0 1200 200" className="w-full h-full" preserveAspectRatio="none">
            <polygon points="0,200 0,100 300,60 600,120 900,40 1200,100 1200,200" fill="#29366f" opacity="0.3" />
          </svg>
        </div>

        {/* Stars - far */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`star-far-${i}`}
            className="absolute w-1 h-1 bg-pixel-white opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
          />
        ))}
      </motion.div>

      {/* Layer 2 - Mid background (medium speed) */}
      <motion.div style={{ y: y2 }} className="absolute inset-0">
        {/* Hills */}
        <div className="absolute bottom-0 left-0 right-0 h-32">
          <svg viewBox="0 0 1200 150" className="w-full h-full" preserveAspectRatio="none">
            <polygon points="0,150 0,80 200,40 400,90 600,30 800,70 1000,50 1200,80 1200,150" fill="#3b5dc9" opacity="0.4" />
          </svg>
        </div>

        {/* Clouds */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`cloud-${i}`}
            className="absolute"
            style={{
              left: `${i * 25}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              x: [0, 50, 0],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div className="w-16 h-8 bg-pixel-white/10 rounded-full"></div>
          </motion.div>
        ))}

        {/* Stars - mid */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`star-mid-${i}`}
            className="absolute w-1 h-1 bg-pixel-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Layer 3 - Foreground (fastest) */}
      <motion.div style={{ y: y3 }} className="absolute inset-0">
        {/* Ground/Platform elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20">
          <div className="absolute bottom-0 w-full h-4 bg-pixel-green border-t-4 border-pixel-lime opacity-20"></div>
        </div>

        {/* Floating pixels/particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-pixel-yellow opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Pixel grid overlay */}
      <div className="absolute inset-0 pixel-grid opacity-10"></div>
    </div>
  );
}
