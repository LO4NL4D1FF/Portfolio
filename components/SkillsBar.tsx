'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Skill {
  name: string;
  level: number;
}

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

  const total = skills.reduce((acc, s) => acc + s.level, 0);
  const avg = Math.round(total / skills.length);

  return (
    <div className="w-full max-w-3xl mx-auto px-5 md:px-8 py-6 pb-24 space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-3xl p-8 md:p-10"
      >
        <p className="text-xs tracking-[0.3em] text-g-700 uppercase mb-3">
          Capacity
        </p>
        <h1 className="font-sans font-light text-3xl md:text-4xl tracking-tight text-white">
          Skills
        </h1>
        <p className="mt-3 text-sm md:text-base text-g-800">
          Technical proficiency by domain.
        </p>
      </motion.header>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass rounded-2xl p-6">
          <p className="text-[10px] tracking-[0.3em] text-g-700 uppercase mb-2">Average</p>
          <p className="font-light text-3xl text-white">
            {avg}<span className="text-lg text-g-700">%</span>
          </p>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-[10px] tracking-[0.3em] text-g-700 uppercase mb-2">Tracked</p>
          <p className="font-light text-3xl text-white">{skills.length}</p>
        </div>
      </div>

      {/* Skills */}
      <div className="glass rounded-3xl p-6 md:p-8 space-y-4">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -8 }}
            animate={mounted ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.04 }}
            className="space-y-2"
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm md:text-base text-white truncate">
                {skill.name}
              </span>
              <span className="text-sm text-g-800 shrink-0 tabular-nums">
                {skill.level}%
              </span>
            </div>
            <div className="relative h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={mounted ? { width: `${skill.level}%` } : {}}
                transition={{ delay: i * 0.04 + 0.15, duration: 0.9, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0 rounded-full bg-white/70"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
