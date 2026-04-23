'use client';

import { motion } from 'framer-motion';
import { User, FolderGit2, Briefcase, BarChart3, Mail, ArrowUpRight } from 'lucide-react';
import { getGameSounds } from '@/lib/sounds';

interface MainMenuProps {
  onMenuSelect: (menu: 'about' | 'projects' | 'services' | 'skills' | 'contact') => void;
}

const items: {
  id: 'about' | 'projects' | 'services' | 'skills' | 'contact';
  label: string;
  description: string;
  icon: typeof User;
}[] = [
  { id: 'about',    label: 'About',    description: 'Profile, timeline, stack.',  icon: User },
  { id: 'projects', label: 'Projects', description: 'Selected work.',             icon: FolderGit2 },
  { id: 'services', label: 'Services', description: 'Engagements and rates.',     icon: Briefcase },
  { id: 'skills',   label: 'Skills',   description: 'Technical proficiency.',     icon: BarChart3 },
  { id: 'contact',  label: 'Contact',  description: 'Direct channels.',           icon: Mail },
];

export default function MainMenu({ onMenuSelect }: MainMenuProps) {
  const handleSelect = (id: typeof items[number]['id']) => {
    const sounds = getGameSounds();
    sounds.playSelect();
    setTimeout(() => onMenuSelect(id), 80);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 md:px-8 py-20">
      <div className="w-full max-w-3xl">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-3">
            Overview
          </p>
          <h1 className="headline font-semibold text-4xl md:text-5xl text-fg">
            Explore the work.
          </h1>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                onClick={() => handleSelect(item.id)}
                className="group glass glass-hover rounded-2xl p-4 text-left flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-fg" strokeWidth={1.75} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-fg tracking-tight leading-tight">
                    {item.label}
                  </h3>
                  <p className="text-sm text-muted leading-tight mt-0.5">
                    {item.description}
                  </p>
                </div>

                <ArrowUpRight
                  className="w-4 h-4 text-muted shrink-0 transition-all group-hover:text-fg group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.75}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
