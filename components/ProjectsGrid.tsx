'use client';

import { motion } from 'framer-motion';
import { Project } from '@/lib/projects';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface ProjectsGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const categoryTheme = (category: string) => {
  switch (category) {
    case 'app':
      return {
        border: 'border-neon-cyan',
        text: 'text-neon-cyan',
        glow: 'rgba(0,240,255,0.45)',
        accent: '#00f0ff',
        tag: 'CONSTRUCT',
      };
    case 'service':
      return {
        border: 'border-neon-yellow',
        text: 'text-neon-yellow',
        glow: 'rgba(252,238,10,0.45)',
        accent: '#fcee0a',
        tag: 'FIXER.JOB',
      };
    case 'creative':
      return {
        border: 'border-neon-magenta',
        text: 'text-neon-magenta',
        glow: 'rgba(255,0,60,0.45)',
        accent: '#ff003c',
        tag: 'BRAIN-DANCE',
      };
    default:
      return {
        border: 'border-neon-yellow',
        text: 'text-neon-yellow',
        glow: 'rgba(252,238,10,0.45)',
        accent: '#fcee0a',
        tag: 'GIG',
      };
  }
};

export default function ProjectsGrid({ projects, onProjectClick }: ProjectsGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="cyber-panel cyber-panel-cyan cyber-corners cyber-corners-cyan p-5 text-center"
      >
        <p className="font-mono tracking-[0.4em] text-xs text-neon-yellow mb-1" style={{ textShadow: '0 0 6px #fcee0a' }}>
          /// CONTRACT ARCHIVE ///
        </p>
        <h2 className="glitch font-cyber font-black text-2xl md:text-4xl tracking-widest" data-text="GIGS COMPLETED">
          GIGS COMPLETED
        </h2>
        <p className="font-hud tracking-widest text-sm text-cyber-ash mt-2">
          Select a contract to view the full brief
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => {
          const IconComponent = project.icon as LucideIcon;
          const isLucideIcon = typeof project.icon !== 'string';
          const isHovered = hoveredIndex === index;
          const theme = categoryTheme(project.category);

          return (
            <motion.div
              key={project.id}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onProjectClick(project)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer no-select relative group"
            >
              {/* Glow */}
              <div
                className={`absolute -inset-0.5 opacity-40 group-hover:opacity-90 blur-md transition-opacity duration-300 ${isHovered ? 'animate-pulse' : ''}`}
                style={{ background: `linear-gradient(135deg, ${theme.accent}, transparent 70%)` }}
              />

              {/* Card */}
              <div
                className={`relative cyber-clip bg-cyber-dark border-2 ${theme.border} p-5 md:p-6 h-full flex flex-col transition-all duration-300`}
                style={{
                  backgroundImage: 'linear-gradient(135deg, rgba(18,18,31,0.95), rgba(5,5,10,0.95))',
                  boxShadow: isHovered ? `0 0 20px ${theme.glow}, inset 0 0 20px rgba(255,255,255,0.03)` : 'inset 0 0 10px rgba(0,0,0,0.5)',
                }}
              >
                {/* Scanline */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-15"
                  style={{ background: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,240,255,0.25) 2px 3px)' }}
                />

                {/* Top bar */}
                <div className="relative flex items-center justify-between mb-4 pb-2 border-b border-cyber-chrome">
                  <span className="font-mono text-[10px] md:text-xs tracking-widest text-cyber-ash">
                    GIG_{String(index + 1).padStart(3, '0')}
                  </span>
                  <span
                    className={`font-mono text-[10px] md:text-xs tracking-widest px-2 py-0.5 border ${theme.border} ${theme.text}`}
                  >
                    {theme.tag}
                  </span>
                </div>

                {/* Icon */}
                <motion.div
                  className="mb-4 flex justify-center"
                  animate={isHovered ? { y: [0, -6, 0] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {isLucideIcon ? (
                    <div
                      className={`w-20 h-20 border-2 ${theme.border} bg-cyber-void flex items-center justify-center`}
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                        boxShadow: `inset 0 0 12px ${theme.glow}, 0 0 12px ${theme.glow}`,
                      }}
                    >
                      <IconComponent className={`w-10 h-10 ${theme.text}`} strokeWidth={1.5} />
                    </div>
                  ) : typeof project.icon === 'string' && project.icon.startsWith('/') ? (
                    <div
                      className={`w-20 h-20 border-2 ${theme.border} bg-cyber-void flex items-center justify-center p-3`}
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                        boxShadow: `inset 0 0 12px ${theme.glow}, 0 0 12px ${theme.glow}`,
                      }}
                    >
                      <img src={project.icon} alt={`${project.name} logo`} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="text-6xl">{project.icon as string}</div>
                  )}
                </motion.div>

                {/* Title */}
                <h3
                  className={`relative font-cyber font-black text-lg md:text-xl tracking-widest ${theme.text} text-center mb-2`}
                  style={{ textShadow: '0 0 6px currentColor' }}
                >
                  {project.name}
                </h3>

                {/* Mission */}
                <p className="relative font-hud text-sm md:text-base text-cyber-bone text-center mb-4 flex-1 leading-relaxed">
                  {project.mission}
                </p>

                {/* Stack tags */}
                <div className="relative flex flex-wrap gap-1.5 justify-center">
                  {project.stack.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="bg-cyber-void/80 border border-neon-yellow/60 px-2 py-0.5 font-mono text-[10px] md:text-xs tracking-widest text-neon-yellow"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > 3 && (
                    <span className="bg-cyber-void/80 border border-neon-yellow/60 px-2 py-0.5 font-mono text-[10px] md:text-xs tracking-widest text-neon-yellow">
                      +{project.stack.length - 3}
                    </span>
                  )}
                </div>

                {/* Bottom bar */}
                <motion.div
                  className={`relative mt-4 pt-3 border-t border-cyber-chrome flex items-center justify-between font-mono text-xs tracking-widest ${theme.text}`}
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span>&gt;&gt; ACCESS BRIEF</span>
                  <span>▶▶</span>
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
