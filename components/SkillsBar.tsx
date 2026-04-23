'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Skill {
  name: string;
  level: number;
  accent: string;
  color: string;
}

const skills: Skill[] = [
  { name: 'HTML / CSS', level: 95, accent: 'bg-neon-yellow', color: '#fcee0a' },
  { name: 'JavaScript', level: 93, accent: 'bg-neon-yellow', color: '#fcee0a' },
  { name: 'React / Next.js', level: 95, accent: 'bg-neon-cyan', color: '#00f0ff' },
  { name: 'TypeScript', level: 90, accent: 'bg-neon-cyan', color: '#00f0ff' },
  { name: 'React Native', level: 92, accent: 'bg-neon-green', color: '#39ff14' },
  { name: 'AI Integration (GPT, Claude)', level: 88, accent: 'bg-neon-pink', color: '#ff00aa' },
  { name: 'C# / WinForms', level: 85, accent: 'bg-neon-purple', color: '#8b00ff' },
  { name: 'UI/UX Design', level: 87, accent: 'bg-neon-magenta', color: '#ff003c' },
  { name: 'Video Editing (Premiere Pro)', level: 82, accent: 'bg-neon-orange', color: '#ff6b00' },
  { name: 'Firebase / Supabase', level: 80, accent: 'bg-neon-green', color: '#39ff14' },
];

export default function SkillsBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const total = skills.reduce((acc, s) => acc + s.level, 0);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="cyber-panel cyber-panel-magenta cyber-corners p-5 text-center"
      >
        <p className="font-mono tracking-[0.4em] text-xs text-neon-cyan mb-1" style={{ textShadow: '0 0 6px #00f0ff' }}>
          /// RIPPERDOC.DIAGNOSTICS ///
        </p>
        <h2 className="glitch font-cyber font-black text-2xl md:text-4xl tracking-widest" data-text="CYBERWARE STATUS">
          CYBERWARE STATUS
        </h2>
        <p className="font-hud tracking-widest text-sm text-cyber-ash mt-2">
          Installed implants · Sync rate live scan
        </p>
      </motion.div>

      {/* Skills list */}
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ x: -30, opacity: 0 }}
            animate={mounted ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: index * 0.08 }}
            className="cyber-panel cyber-clip-sm p-3 md:p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs tracking-widest text-cyber-ash">
                  {String(index + 1).padStart(2, '0')}.
                </span>
                <span
                  className="font-hud font-bold tracking-wider text-base md:text-lg"
                  style={{ color: skill.color, textShadow: `0 0 4px ${skill.color}` }}
                >
                  {skill.name}
                </span>
              </div>
              <span
                className="font-mono font-bold text-sm md:text-base"
                style={{ color: skill.color, textShadow: `0 0 4px ${skill.color}` }}
              >
                {skill.level}%
              </span>
            </div>

            {/* Bar */}
            <div className="relative h-4 bg-cyber-void border border-cyber-chrome overflow-hidden">
              {/* Segmented track */}
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ background: 'repeating-linear-gradient(90deg, transparent 0 8px, rgba(255,255,255,0.08) 8px 9px)' }}
              />

              <motion.div
                initial={{ width: 0 }}
                animate={mounted ? { width: `${skill.level}%` } : {}}
                transition={{ delay: index * 0.08 + 0.3, duration: 1, ease: 'easeOut' }}
                className={`relative h-full ${skill.accent}`}
                style={{ boxShadow: `0 0 10px ${skill.color}, inset 0 0 4px rgba(255,255,255,0.5)` }}
              >
                {/* Shine */}
                <motion.div
                  className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                  animate={{ x: ['-200%', '400%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.08 + 1.2, repeatDelay: 2 }}
                />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total XP */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={mounted ? { y: 0, opacity: 1 } : {}}
        transition={{ delay: 0.8 }}
        className="cyber-panel cyber-panel-yellow cyber-corners p-5"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <span className="font-mono tracking-widest text-sm text-cyber-ash">
            [ AGGREGATE SYNC ]
          </span>
          <span className="font-cyber font-black text-xl md:text-2xl tracking-widest text-neon-yellow" style={{ textShadow: '0 0 8px #fcee0a' }}>
            {total} / 1000 NEURAL PTS
          </span>
        </div>
        <div className="mt-3 h-2 bg-cyber-void border border-cyber-chrome overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={mounted ? { width: `${total / 10}%` } : {}}
            transition={{ delay: 1, duration: 1.2 }}
            className="h-full bg-gradient-to-r from-neon-yellow via-neon-magenta to-neon-cyan"
            style={{ boxShadow: '0 0 10px #fcee0a' }}
          />
        </div>
      </motion.div>
    </div>
  );
}
