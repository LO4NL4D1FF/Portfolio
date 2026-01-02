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
      // Play a test sound when enabling
      const sounds = getGameSounds();
      setTimeout(() => sounds.playClick(), 100);
    }
  };

  return (
    <motion.button
      onClick={toggleSound}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-pixel-yellow border-4 border-pixel-white shadow-pixel
                 hover:bg-pixel-orange transition-colors btn-press flex items-center justify-center
                 safe-area-bottom"
      title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
    >
      {soundEnabled ? (
        <Volume2 className="w-7 h-7 text-pixel-black" strokeWidth={3} />
      ) : (
        <VolumeX className="w-7 h-7 text-pixel-black" strokeWidth={3} />
      )}
    </motion.button>
  );
}
