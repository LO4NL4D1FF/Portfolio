'use client';

import { motion } from 'framer-motion';
import { Project } from '@/lib/projects';
import { ArrowUpRight, LucideIcon } from 'lucide-react';

interface ProjectsGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const categoryLabel = (category: string) => {
  switch (category) {
    case 'app':      return 'App';
    case 'service':  return 'Service';
    case 'creative': return 'Creative';
    default:         return 'Project';
  }
};

export default function ProjectsGrid({ projects, onProjectClick }: ProjectsGridProps) {
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 pb-20 space-y-4">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-3xl p-6 md:p-8"
      >
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-2">Work</p>
        <h1 className="headline font-semibold text-3xl md:text-4xl text-fg">
          Projects.
        </h1>
        <p className="mt-2 text-sm md:text-base text-muted">
          Selected case notes. Tap a card to open the brief.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {projects.map((project, i) => {
          const IconComponent = project.icon as LucideIcon;
          const isLucideIcon = typeof project.icon !== 'string';
          const isImageIcon = typeof project.icon === 'string' && project.icon.startsWith('/');

          return (
            <motion.button
              key={project.id}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              onClick={() => onProjectClick(project)}
              className="group glass glass-hover rounded-2xl p-5 text-left flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                {isLucideIcon && (
                  <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 text-fg" strokeWidth={1.75} />
                  </div>
                )}
                {isImageIcon && (
                  <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center p-1.5 shrink-0 bg-white/60">
                    <img src={project.icon as string} alt={`${project.name} logo`} className="w-full h-full object-contain" />
                  </div>
                )}

                <ArrowUpRight
                  className="w-4 h-4 text-muted shrink-0 transition-all group-hover:text-fg group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.75}
                />
              </div>

              <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-sub mb-1">
                {categoryLabel(project.category)}
              </p>
              <h3 className="font-semibold text-lg text-fg tracking-tight leading-tight mb-2">
                {project.name}
              </h3>
              <p className="text-sm text-muted leading-snug line-clamp-2 mb-3 flex-1">
                {project.mission}
              </p>

              <div className="flex flex-wrap gap-1">
                {project.stack.slice(0, 3).map((tech, j) => (
                  <span key={j} className="glass-chip rounded-full px-2 py-0.5 text-[11px] text-fg-soft">
                    {tech}
                  </span>
                ))}
                {project.stack.length > 3 && (
                  <span className="glass-chip rounded-full px-2 py-0.5 text-[11px] text-muted">
                    +{project.stack.length - 3}
                  </span>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
