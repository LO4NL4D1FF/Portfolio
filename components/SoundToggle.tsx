'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getGameSounds } from '@/lib/sounds';

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    getGameSounds().setEnabled(enabled);
  }, [enabled]);

  const toggle = () => {
    setEnabled(!enabled);
    if (!enabled) setTimeout(() => getGameSounds().playClick(), 80);
  };

  return (
    <button
      onClick={toggle}
      className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full glass glass-hover flex items-center justify-center text-fg safe-area-bottom btn-press"
      title={enabled ? 'Mute' : 'Unmute'}
      aria-label={enabled ? 'Mute sounds' : 'Enable sounds'}
    >
      {enabled ? (
        <Volume2 className="w-4 h-4" strokeWidth={1.75} />
      ) : (
        <VolumeX className="w-4 h-4" strokeWidth={1.75} />
      )}
    </button>
  );
}
