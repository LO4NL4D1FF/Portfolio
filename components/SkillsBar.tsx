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
    <div className="w-full max-w-3xl mx-auto px-6 py-10 space-y-10">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="font-mono text-[11px] tracking-[0.3em] text-slate mb-3">
          / / CAPACITY
        </p>
        <h1 className="font-sans font-light text-3xl md:text-4xl tracking-[0.15em] text-bone uppercase">
          Skills
        </h1>
        <div className="mt-5 h-px bg-ink-line" />
      </motion.header>

      {/* Summary */}
      <div className="grid grid-cols-2 border-y border-ink-line divide-x divide-ink-line">
        <div className="py-4 px-4">
          <p className="font-mono text-[10px] tracking-[0.3em] text-dim mb-1">AVERAGE</p>
          <p className="font-sans font-light text-3xl text-amber">{avg}<span className="text-lg text-bone/60">%</span></p>
        </div>
        <div className="py-4 px-4">
          <p className="font-mono text-[10px] tracking-[0.3em] text-dim mb-1">SKILLS TRACKED</p>
          <p className="font-sans font-light text-3xl text-bone">{skills.length}</p>
        </div>
      </div>

      {/* Skills list */}
      <ul className="space-y-4">
        {skills.map((skill, i) => (
          <motion.li
            key={skill.name}
            initial={{ opacity: 0, x: -8 }}
            animate={mounted ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: i * 0.04 }}
            className="space-y-2"
          >
            <div className="flex items-baseline justify-between gap-3">
              <div className="flex items-baseline gap-3 min-w-0">
                <span className="font-mono text-[11px] tracking-[0.2em] text-dim shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-sans text-base md:text-lg text-bone truncate">
                  {skill.name}
                </span>
              </div>
              <span className="font-mono text-sm text-amber shrink-0">
                {skill.level}
              </span>
            </div>
            <div className="relative h-px bg-ink-line">
              <motion.div
                initial={{ width: 0 }}
                animate={mounted ? { width: `${skill.level}%` } : {}}
                transition={{ delay: i * 0.04 + 0.1, duration: 0.8, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0 bg-amber"
                style={{ height: '1px' }}
              />
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
