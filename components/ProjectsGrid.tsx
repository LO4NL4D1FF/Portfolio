'use client';

import { motion } from 'framer-motion';
import { Project } from '@/lib/projects';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface ProjectsGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const categoryLabel = (category: string) => {
  switch (category) {
    case 'app':      return 'APP';
    case 'service':  return 'SERVICE';
    case 'creative': return 'CREATIVE';
    default:         return 'PROJECT';
  }
};

export default function ProjectsGrid({ projects, onProjectClick }: ProjectsGridProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="font-mono text-[11px] tracking-[0.3em] text-slate mb-3">
          / / ARCHIVE
        </p>
        <h1 className="font-sans font-light text-3xl md:text-4xl tracking-[0.15em] text-bone uppercase">
          Projects
        </h1>
        <div className="mt-5 h-px bg-ink-line" />
      </motion.header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ink-line border border-ink-line">
        {projects.map((project, i) => {
          const IconComponent = project.icon as LucideIcon;
          const isLucideIcon = typeof project.icon !== 'string';
          const isImageIcon = typeof project.icon === 'string' && project.icon.startsWith('/');
          const isHovered = hovered === i;

          return (
            <motion.button
              key={project.id}
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onProjectClick(project)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`relative text-left bg-ink-0 p-6 md:p-7 min-h-[240px] flex flex-col transition-colors ${
                isHovered ? 'bg-ink-1' : ''
              }`}
            >
              {/* Top bar */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[10px] tracking-[0.25em] text-dim">
                  {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                </span>
                <span className="font-mono text-[10px] tracking-[0.25em] text-slate">
                  {categoryLabel(project.category)}
                </span>
              </div>

              {/* Icon + title */}
              <div className="flex items-start gap-4 mb-4">
                {isLucideIcon && (
                  <div className="w-10 h-10 border border-ink-line flex items-center justify-center shrink-0">
                    <IconComponent className={`w-5 h-5 ${isHovered ? 'text-amber' : 'text-bone/80'} transition-colors`} strokeWidth={1.5} />
                  </div>
                )}
                {isImageIcon && (
                  <div className="w-10 h-10 border border-ink-line flex items-center justify-center p-1.5 shrink-0">
                    <img src={project.icon as string} alt={`${project.name} logo`} className="w-full h-full object-contain opacity-90" />
                  </div>
                )}

                <h3 className={`font-sans font-medium text-xl md:text-2xl tracking-wide leading-tight ${
                  isHovered ? 'text-amber' : 'text-bone'
                } transition-colors`}>
                  {project.name}
                </h3>
              </div>

              {/* Mission */}
              <p className="font-sans text-sm md:text-base text-bone/70 leading-relaxed mb-5 flex-1">
                {project.mission}
              </p>

              {/* Stack */}
              <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
                {project.stack.slice(0, 4).map((tech, j) => (
                  <span key={j} className="font-mono text-[11px] tracking-[0.15em] text-dim">
                    {tech}
                  </span>
                ))}
                {project.stack.length > 4 && (
                  <span className="font-mono text-[11px] tracking-[0.15em] text-dim">
                    +{project.stack.length - 4}
                  </span>
                )}
              </div>

              {/* CTA */}
              <div className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] text-dim group">
                <span className={`h-px transition-all ${isHovered ? 'w-8 bg-amber' : 'w-4 bg-ink-line'}`} />
                <span className={isHovered ? 'text-amber' : ''}>OPEN</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
