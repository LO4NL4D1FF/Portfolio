'use client';

import { motion } from 'framer-motion';
import { User, FolderGit2, Briefcase, BarChart3, Mail, ArrowUpRight } from 'lucide-react';
import type { ScreenId } from '@/components/types';

interface Props {
  onMenuSelect: (id: ScreenId) => void;
}

const items: { id: ScreenId; label: string; description: string; icon: typeof User }[] = [
  { id: 'about',    label: 'About',    description: 'Profile, timeline, stack.',  icon: User },
  { id: 'projects', label: 'Projects', description: 'Selected case notes.',       icon: FolderGit2 },
  { id: 'services', label: 'Services', description: 'Engagements and rates.',     icon: Briefcase },
  { id: 'skills',   label: 'Skills',   description: 'Technical proficiency.',     icon: BarChart3 },
  { id: 'contact',  label: 'Contact',  description: 'Direct channels.',           icon: Mail },
];

export default function MainMenu({ onMenuSelect }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-20">
      <div className="w-full max-w-3xl">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <p className="eyebrow mb-3">Overview</p>
          <h1 className="headline font-bold text-4xl md:text-5xl text-fg">
            Choose a section.
          </h1>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                onClick={() => onMenuSelect(item.id)}
                className="lg lg-hover rounded-3xl p-4 text-left group flex items-center gap-4"
              >
                <div className="lg-sm w-11 h-11 rounded-2xl flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-fg relative z-10" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0 relative z-10">
                  <h3 className="font-semibold text-base text-fg tracking-tight leading-tight">
                    {item.label}
                  </h3>
                  <p className="text-sm text-muted leading-tight mt-0.5">
                    {item.description}
                  </p>
                </div>
                <ArrowUpRight
                  className="w-4 h-4 text-muted shrink-0 transition-all group-hover:text-fg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 relative z-10"
                  strokeWidth={2}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
