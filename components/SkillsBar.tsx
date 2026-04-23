'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Skill { name: string; level: number; }

const skills: Skill[] = [
  { name: 'HTML / CSS',                   level: 95 },
  { name: 'JavaScript',                   level: 93 },
  { name: 'React / Next.js',              level: 95 },
  { name: 'TypeScript',                   level: 90 },
  { name: 'React Native',                 level: 92 },
  { name: 'AI Integration (GPT, Claude)', level: 88 },
  { name: 'C# / WinForms',                level: 85 },
  { name: 'UI / UX Design',               level: 87 },
  { name: 'Video Editing (Premiere Pro)', level: 82 },
  { name: 'Firebase / Supabase',          level: 80 },
];

export default function SkillsBar() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const avg = Math.round(skills.reduce((a, s) => a + s.level, 0) / skills.length);
  const topLevel = Math.max(...skills.map(s => s.level));

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 py-6 pb-20 space-y-4">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-3xl p-6 md:p-8"
      >
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-2">Capacity</p>
        <h1 className="headline font-semibold text-3xl md:text-4xl text-fg">
          Skills.
        </h1>
        <p className="mt-2 text-sm md:text-base text-muted">
          Technical proficiency by domain.
        </p>
      </motion.header>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-2xl p-4 md:p-5">
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted">Average</p>
          <p className="text-2xl md:text-3xl font-semibold text-fg mt-1">{avg}<span className="text-base text-muted">%</span></p>
        </div>
        <div className="glass rounded-2xl p-4 md:p-5">
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted">Top</p>
          <p className="text-2xl md:text-3xl font-semibold text-fg mt-1">{topLevel}<span className="text-base text-muted">%</span></p>
        </div>
        <div className="glass rounded-2xl p-4 md:p-5">
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted">Tracked</p>
          <p className="text-2xl md:text-3xl font-semibold text-fg mt-1">{skills.length}</p>
        </div>
      </div>

      {/* Skills — 2 columns, compact */}
      <div className="glass rounded-3xl p-5 md:p-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -6 }}
              animate={mounted ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.03 }}
              className="space-y-1.5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-fg truncate">{skill.name}</span>
                <span className="text-xs text-muted shrink-0 tabular-nums">{skill.level}%</span>
              </div>
              <div className="relative h-1 rounded-full bg-black/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={mounted ? { width: `${skill.level}%` } : {}}
                  transition={{ delay: i * 0.03 + 0.1, duration: 0.8, ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 rounded-full bg-fg"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
