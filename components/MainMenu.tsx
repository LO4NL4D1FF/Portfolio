'use client';

import { motion } from 'framer-motion';
import { getGameSounds } from '@/lib/sounds';
import { useState } from 'react';

interface MainMenuProps {
  onMenuSelect: (menu: 'about' | 'projects' | 'services' | 'skills' | 'contact') => void;
}

const items: {
  id: 'about' | 'projects' | 'services' | 'skills' | 'contact';
  label: string;
  subtitle: string;
}[] = [
  { id: 'about',    label: 'About',    subtitle: 'Profile, timeline, stack' },
  { id: 'projects', label: 'Projects', subtitle: 'Selected work and case notes' },
  { id: 'services', label: 'Services', subtitle: 'Engagements and rates' },
  { id: 'skills',   label: 'Skills',   subtitle: 'Technical proficiency' },
  { id: 'contact',  label: 'Contact',  subtitle: 'Direct channels' },
];

export default function MainMenu({ onMenuSelect }: MainMenuProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const handleSelect = (id: typeof items[number]['id']) => {
    const sounds = getGameSounds();
    sounds.playSelect();
    setTimeout(() => onMenuSelect(id), 80);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        {/* Header */}
        <header className="mb-12 md:mb-16">
          <p className="font-mono text-[11px] tracking-[0.3em] text-slate mb-3">
            / / INDEX
          </p>
          <h1 className="font-sans font-light text-3xl md:text-4xl tracking-[0.15em] text-bone">
            Sections
          </h1>
          <div className="mt-5 h-px bg-ink-line" />
        </header>

        {/* List */}
        <ul>
          {items.map((item, i) => {
            const isHovered = hovered === i;
            return (
              <li key={item.id} className="border-b border-ink-line">
                <button
                  onClick={() => handleSelect(item.id)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="group w-full text-left flex items-center gap-6 py-5 md:py-6 transition-colors"
                >
                  <span className="font-mono text-[11px] tracking-[0.2em] text-dim w-8 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span className="flex-1 min-w-0">
                    <span
                      className={`block font-sans font-light text-2xl md:text-3xl tracking-[0.1em] transition-colors ${
                        isHovered ? 'text-amber' : 'text-bone'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="block mt-1 font-mono text-xs tracking-[0.15em] text-dim">
                      {item.subtitle}
                    </span>
                  </span>

                  <span
                    className={`font-mono text-sm tracking-[0.3em] transition-all ${
                      isHovered ? 'text-amber translate-x-1' : 'text-dim'
                    }`}
                  >
                    →
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Footer */}
        <footer className="mt-12 flex items-center justify-between font-mono text-[10px] tracking-[0.3em] text-dim">
          <span>NODE · 001</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-slate" />
            ONLINE
          </span>
        </footer>
      </motion.div>
    </div>
  );
}
