'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getGameSounds } from '@/lib/sounds';

export default function SoundToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const sounds = getGameSounds();
    sounds.setEnabled(enabled);
  }, [enabled]);

  const toggle = () => {
    setEnabled(!enabled);
    if (!enabled) {
      const sounds = getGameSounds();
      setTimeout(() => sounds.playClick(), 80);
    }
  };

  return (
    <button
      onClick={toggle}
      className="fixed bottom-4 right-4 z-50 w-9 h-9 bg-ink-1 border border-ink-line text-bone/70 hover:text-amber hover:border-amber transition-colors flex items-center justify-center safe-area-bottom btn-press"
      title={enabled ? 'Mute' : 'Unmute'}
      aria-label={enabled ? 'Mute sounds' : 'Enable sounds'}
    >
      {enabled ? (
        <Volume2 className="w-4 h-4" strokeWidth={1.5} />
      ) : (
        <VolumeX className="w-4 h-4" strokeWidth={1.5} />
      )}
    </button>
  );
}
