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
  { id: 'about',    label: 'About',    description: 'Profile, timeline, stack', icon: User },
  { id: 'projects', label: 'Projects', description: 'Selected work',            icon: FolderGit2 },
  { id: 'services', label: 'Services', description: 'Engagements and rates',    icon: Briefcase },
  { id: 'skills',   label: 'Skills',   description: 'Technical proficiency',    icon: BarChart3 },
  { id: 'contact',  label: 'Contact',  description: 'Direct channels',          icon: Mail },
];

export default function MainMenu({ onMenuSelect }: MainMenuProps) {
  const handleSelect = (id: typeof items[number]['id']) => {
    const sounds = getGameSounds();
    sounds.playSelect();
    setTimeout(() => onMenuSelect(id), 80);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs tracking-[0.3em] text-g-700 uppercase mb-3">
            Index
          </p>
          <h1 className="font-sans font-light text-4xl md:text-5xl tracking-tight text-white">
            Sedo-Ta
          </h1>
          <p className="mt-3 text-base text-g-800">
            Choose a section to explore
          </p>
        </motion.header>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                onClick={() => handleSelect(item.id)}
                className="group glass glass-hover rounded-2xl p-5 text-left flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-xl glass-subtle flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-lg text-white tracking-tight">
                    {item.label}
                  </h3>
                  <p className="text-sm text-g-700">
                    {item.description}
                  </p>
                </div>

                <ArrowUpRight
                  className="w-4 h-4 text-g-700 shrink-0 transition-all group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
