'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Skill {
  name: string;
  level: number;
  color: string;
}

const skills: Skill[] = [
  { name: 'React / Next.js', level: 95, color: 'pixel-cyan' },
  { name: 'TypeScript', level: 90, color: 'pixel-indigo' },
  { name: 'React Native', level: 92, color: 'pixel-lime' },
  { name: 'AI Integration (Gemini)', level: 88, color: 'pixel-pink' },
  { name: 'C# / WinForms', level: 85, color: 'pixel-purple' },
  { name: 'UI/UX Design', level: 87, color: 'pixel-orange' },
  { name: 'Video Editing (Premiere Pro)', level: 82, color: 'pixel-red' },
  { name: 'Firebase / Supabase', level: 80, color: 'pixel-yellow' },
];

export default function SkillsBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Title */}
      <div className="bg-pixel-black border-4 border-pixel-white p-4 shadow-pixel mb-8">
        <h2 className="font-game text-2xl md:text-3xl text-pixel-yellow text-center text-outline leading-relaxed">
          SKILL STATS
        </h2>
      </div>

      {/* Skills list */}
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ x: -100, opacity: 0 }}
            animate={mounted ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="space-y-2"
          >
            {/* Skill name and level */}
            <div className="flex justify-between items-center">
              <span className="font-pixel text-xl md:text-2xl text-pixel-white">
                {skill.name}
              </span>
              <span className="font-game text-sm md:text-lg text-pixel-yellow">
                LV.{skill.level}
              </span>
            </div>

            {/* XP Bar */}
            <div className="relative h-8 bg-pixel-black border-4 border-pixel-white shadow-pixel-sm">
              {/* Inner border */}
              <div className="absolute inset-1 border-2 border-pixel-gray"></div>

              {/* Fill bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={mounted ? { width: `${skill.level}%` } : {}}
                transition={{ delay: index * 0.1 + 0.3, duration: 1, ease: 'easeOut' }}
                className={`absolute inset-1 bg-${skill.color} border-2 border-${skill.color}`}
                style={{
                  background: `linear-gradient(to right, var(--tw-gradient-stops))`,
                  '--tw-gradient-from': `var(--pixel-${skill.color.split('-')[1]})`,
                  '--tw-gradient-to': 'transparent',
                  '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
                } as any}
              >
                {/* Shine effect */}
                <motion.div
                  className="h-full w-full bg-gradient-to-r from-transparent via-pixel-white/30 to-transparent"
                  animate={{
                    x: ['-100%', '200%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.1 + 1.5,
                    repeatDelay: 3,
                  }}
                />
              </motion.div>

              {/* Percentage text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={mounted ? { opacity: 1 } : {}}
                  transition={{ delay: index * 0.1 + 1 }}
                  className="font-game text-xs md:text-sm text-pixel-white text-outline z-10"
                >
                  {skill.level}%
                </motion.span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total XP */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={mounted ? { y: 0, opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        className="mt-8 bg-gradient-to-r from-pixel-yellow to-pixel-orange border-4 border-pixel-white p-4 shadow-pixel"
      >
        <div className="flex justify-between items-center">
          <span className="font-game text-lg md:text-xl text-pixel-black">
            TOTAL XP
          </span>
          <span className="font-game text-xl md:text-2xl text-pixel-black">
            {skills.reduce((acc, skill) => acc + skill.level, 0)} / 800
          </span>
        </div>
      </motion.div>
    </div>
  );
}
