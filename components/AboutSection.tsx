'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Download, Zap, Activity, Shield } from 'lucide-react';

export default function AboutSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const characterStats = [
    { label: 'HANDLE', value: 'Loan Ladiff Sedo-Ta', accent: 'text-neon-yellow' },
    { label: 'ALIASES', value: 'Diff · Link · Mr. Badboi', accent: 'text-neon-cyan' },
    { label: 'STREET CRED', value: String(new Date().getFullYear() - 2004), accent: 'text-neon-yellow' },
    { label: 'ORIGIN', value: 'Cameroonian', accent: 'text-neon-cyan' },
    { label: 'HIDEOUT', value: 'Monrovia, Liberia', accent: 'text-neon-yellow' },
    { label: 'CLASS', value: 'Software Engineer // Netrunner', accent: 'text-neon-magenta' },
    { label: 'YEARS JACKED-IN', value: '3+ Cycles', accent: 'text-neon-cyan' },
    { label: 'TRAJECTORY', value: 'Founder / CEO Protocol', accent: 'text-neon-magenta' },
  ];

  const levels = [
    {
      level: 1,
      title: 'THE INITIATE',
      description: 'HTML, CSS discovered → First static pages → Understanding structure, color, balance',
      accent: 'border-cyber-chrome text-cyber-bone',
    },
    {
      level: 2,
      title: 'LOGIC UNLOCKED',
      description: 'C++, C#, Python → Console games → Student Record Management System → Control flow mastered',
      accent: 'border-neon-cyan text-neon-cyan',
    },
    {
      level: 3,
      title: 'INTERFACE CRAFTER',
      description: 'React enters → Personal portfolio → Component thinking → UI responsiveness obsession begins',
      accent: 'border-neon-cyan text-neon-cyan',
    },
    {
      level: 4,
      title: 'SYSTEM BUILDER',
      description: 'Smart Save → Web + Desktop budgeting tool → Real users, real constraints → Backend matters',
      accent: 'border-neon-yellow text-neon-yellow',
    },
    {
      level: 5,
      title: 'THE ARCHITECT',
      description: 'Zenix/CORELM/Audify → AI-powered learning → Subscription logic, gamification → Founder mindset awakens',
      accent: 'border-neon-yellow text-neon-yellow',
    },
    {
      level: 6,
      title: 'THE STRATEGIST',
      description: 'Current Level → Rebuilding backends → Optimizing AI cost vs power → Preparing for scale',
      accent: 'border-neon-magenta text-neon-magenta',
      current: true,
    },
  ];

  const techStack = {
    primary: ['HTML/CSS', 'JavaScript', 'React', 'React Native', 'TypeScript', 'Next.js', 'C# WinForms', 'Supabase', 'Firebase', 'AI Integration (GPT, Claude)'],
    secondary: ['C++', 'Python', 'Java', 'SQL', 'Linux', 'Node.js'],
    tools: ['VS Code', 'Claude Code CLI', 'Windsurf', 'Expo', 'GitHub', 'CapCut', 'Adobe Premiere Pro'],
  };

  const education = [
    { title: 'BSc Software Engineering', institution: 'BlueCrest University College, Liberia', status: 'IN PROGRESS · Mid 2026', icon: Shield },
    { title: 'WASSCE', institution: 'Science Major', status: 'COMPLETE', icon: Activity },
    { title: 'FSLC', institution: 'First School Leaving Certificate', status: 'COMPLETE', icon: Zap },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 pb-24">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="cyber-panel cyber-panel-yellow cyber-corners p-6 text-center"
        >
          <p className="font-mono tracking-[0.4em] text-xs md:text-sm text-neon-cyan mb-2" style={{ textShadow: '0 0 6px #00f0ff' }}>
            // CLASSIFIED DOSSIER · CLEARANCE LEVEL 5
          </p>
          <h1 className="glitch font-cyber font-black text-3xl md:text-5xl tracking-widest" data-text="OPERATIVE FILE">
            OPERATIVE FILE
          </h1>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="cyber-panel cyber-panel-cyan p-6 md:p-8 relative"
        >
          <div className="absolute top-3 right-4 font-mono text-[10px] tracking-widest text-neon-cyan/60">
            /// BIO.LOG ///
          </div>
          <div className="border-l-2 border-neon-cyan pl-4 space-y-4">
            <p className="font-hud text-base md:text-lg text-cyber-bone leading-relaxed">
              I am a builder in motion — a fast-learning software engineer shaped by curiosity, restraint, and ambition. I design not just applications, but systems: systems that teach, systems that save, systems that listen.
            </p>
            <p className="font-hud text-base md:text-lg text-cyber-bone leading-relaxed">
              My work lives at the intersection of education, AI, design, and human behavior. I am drawn to tools that simplify chaos, teach with joy, and scale quietly until they cannot be ignored.
            </p>
            <p className="font-hud text-base md:text-lg text-neon-cyan leading-relaxed" style={{ textShadow: '0 0 6px rgba(0,240,255,0.4)' }}>
              &gt; I learn by building. I grow by breaking things — then rebuilding them better.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {characterStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
              animate={mounted ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="cyber-panel cyber-clip-sm border-l-4 border-neon-yellow p-3 md:p-4 flex justify-between items-center"
            >
              <span className="font-mono text-xs md:text-sm tracking-widest text-cyber-ash">
                [{stat.label}]
              </span>
              <span className={`font-cyber font-bold text-sm md:text-lg ${stat.accent}`} style={{ textShadow: '0 0 6px currentColor' }}>
                {stat.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Career Timeline */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            className="cyber-panel cyber-panel-magenta p-4 mb-6 text-center"
          >
            <h2 className="font-cyber font-black text-2xl md:text-3xl tracking-widest text-neon-magenta" style={{ textShadow: '0 0 8px #ff003c' }}>
              ▸ CAREER PATH.EXE ◂
            </h2>
          </motion.div>

          <div className="relative space-y-4 pl-6 before:content-[''] before:absolute before:left-2 before:top-0 before:bottom-0 before:w-[2px] before:bg-neon-yellow/60">
            {levels.map((level, index) => (
              <motion.div
                key={level.level}
                initial={{ x: -30, opacity: 0 }}
                animate={mounted ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 0.5 + index * 0.08 }}
                className={`relative cyber-panel cyber-clip-sm border ${level.accent.split(' ')[0]} p-4 md:p-6 ${
                  level.current ? 'ring-2 ring-neon-yellow' : ''
                }`}
              >
                {/* Node on the timeline */}
                <span
                  className={`absolute -left-[34px] top-5 w-4 h-4 rounded-full ${
                    level.current ? 'bg-neon-yellow animate-pulse' : 'bg-cyber-dark border-2'
                  } ${level.accent.split(' ')[0]}`}
                  style={{ boxShadow: level.current ? '0 0 10px #fcee0a' : 'none' }}
                />

                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 md:w-16 md:h-16 border-2 ${level.accent.split(' ')[0]} flex items-center justify-center bg-cyber-void font-cyber font-black text-xl md:text-2xl ${level.accent.split(' ')[1]}`}
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                      textShadow: '0 0 6px currentColor',
                    }}
                  >
                    {String(level.level).padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-cyber font-bold text-lg md:text-xl tracking-widest ${level.accent.split(' ')[1]} mb-1`} style={{ textShadow: '0 0 6px currentColor' }}>
                      {level.title}
                      {level.current && <span className="ml-3 text-neon-yellow animate-blink">◆ ACTIVE</span>}
                    </h3>
                    <p className="font-hud text-sm md:text-base text-cyber-bone leading-relaxed">
                      {level.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            className="cyber-panel cyber-panel-cyan p-4 mb-6 text-center"
          >
            <h2 className="font-cyber font-black text-2xl md:text-3xl tracking-widest text-neon-cyan" style={{ textShadow: '0 0 8px #00f0ff' }}>
              ▸ CYBERWARE LOADOUT ◂
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'CORE', accent: 'neon-yellow', items: techStack.primary },
              { label: 'SECONDARY', accent: 'neon-cyan', items: techStack.secondary },
              { label: 'UTILITIES', accent: 'neon-magenta', items: techStack.tools },
            ].map((group) => (
              <div
                key={group.label}
                className="cyber-panel cyber-clip p-5"
                style={{
                  borderColor: `var(--${group.accent})`,
                  borderWidth: '1px',
                  boxShadow: `0 0 20px rgba(0,0,0,0.4), inset 0 0 20px rgba(255,255,255,0.02)`,
                }}
              >
                <h3 className={`font-cyber font-black text-lg tracking-widest text-${group.accent} mb-4 text-center`} style={{ textShadow: '0 0 6px currentColor' }}>
                  [ {group.label} ]
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ scale: 0 }}
                      animate={mounted ? { scale: 1 } : {}}
                      transition={{ delay: 0.7 + i * 0.04 }}
                      className={`font-mono text-[11px] md:text-xs tracking-widest px-3 py-1 bg-cyber-dark border border-${group.accent}/60 text-${group.accent}`}
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                      }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education / Achievements */}
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={mounted ? { opacity: 1 } : {}}
            className="cyber-panel cyber-panel-yellow p-4 mb-6 text-center"
          >
            <h2 className="font-cyber font-black text-2xl md:text-3xl tracking-widest text-neon-yellow" style={{ textShadow: '0 0 8px #fcee0a' }}>
              ▸ DATA SHARDS UNLOCKED ◂
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {education.map((edu, index) => {
              const Icon = edu.icon;
              return (
                <motion.div
                  key={edu.title}
                  initial={{ y: 30, opacity: 0 }}
                  animate={mounted ? { y: 0, opacity: 1 } : {}}
                  transition={{ delay: 1.3 + index * 0.1 }}
                  className="cyber-panel cyber-clip border border-neon-cyan p-5"
                  style={{ boxShadow: 'inset 0 0 20px rgba(0, 240, 255, 0.05), 0 0 14px rgba(0, 240, 255, 0.15)' }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 border-2 border-neon-cyan flex items-center justify-center bg-cyber-void"
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                        boxShadow: '0 0 12px rgba(0, 240, 255, 0.6)',
                      }}
                    >
                      <Icon className="w-8 h-8 text-neon-cyan" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="font-cyber font-bold text-base md:text-lg tracking-widest text-neon-cyan text-center mb-1" style={{ textShadow: '0 0 6px rgba(0,240,255,0.7)' }}>
                    {edu.title}
                  </h3>
                  <p className="font-hud text-sm text-cyber-bone text-center mb-3">
                    {edu.institution}
                  </p>
                  <div className="bg-cyber-void/80 border-t border-neon-cyan/40 text-center py-1.5">
                    <span className="font-mono text-xs tracking-widest text-neon-cyan">
                      {edu.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Request CV */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={mounted ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 1.6 }}
          className="text-center"
        >
          <a
            href="mailto:difflad@gmail.com?subject=CV%20Request%20-%20Sedo-Ta%20Portfolio&body=Hi%20Sedo-Ta%2C%0A%0AI'd%20like%20to%20request%20your%20CV%2FResume.%0A%0AThank%20you!"
            className="inline-block relative group"
          >
            <div className="absolute -inset-0.5 bg-neon-yellow opacity-30 group-hover:opacity-60 blur-lg transition-opacity" />
            <div
              className="relative bg-cyber-void border-2 border-neon-yellow px-8 md:px-10 py-5 md:py-6 btn-press"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
              }}
            >
              <div className="flex items-center gap-4 justify-center">
                <Download className="w-8 h-8 md:w-10 md:h-10 text-neon-yellow" strokeWidth={1.5} style={{ filter: 'drop-shadow(0 0 6px #fcee0a)' }} />
                <div className="text-left">
                  <h3 className="font-cyber font-black text-xl md:text-2xl tracking-widest text-neon-yellow" style={{ textShadow: '0 0 8px #fcee0a' }}>
                    DOWNLOAD DOSSIER
                  </h3>
                  <p className="font-hud text-sm tracking-widest text-cyber-ash">
                    Request my CV · Secure channel
                  </p>
                </div>
              </div>
            </div>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
