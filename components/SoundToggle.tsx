'use client';

import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getGameSounds } from '@/lib/sounds';

export default function SoundToggle() {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const sounds = getGameSounds();
    sounds.setEnabled(soundEnabled);
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      const sounds = getGameSounds();
      setTimeout(() => sounds.playClick(), 100);
    }
  };

  return (
    <motion.button
      onClick={toggleSound}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-4 right-4 z-50 w-12 h-12 bg-cyber-dark border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-cyber-void transition-all btn-press flex items-center justify-center safe-area-bottom"
      style={{
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
        boxShadow: '0 0 12px rgba(0,240,255,0.5)',
      }}
      title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
    >
      {soundEnabled ? (
        <Volume2 className="w-5 h-5" strokeWidth={2} />
      ) : (
        <VolumeX className="w-5 h-5" strokeWidth={2} />
      )}
    </motion.button>
  );
}
