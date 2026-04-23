'use client';

import { motion } from 'framer-motion';
import { Project } from '@/lib/projects';
import { ArrowUpRight, LucideIcon } from 'lucide-react';

interface Props {
  projects: Project[];
  onProjectClick: (p: Project) => void;
}

const categoryLabel = (c: string) => {
  switch (c) {
    case 'app':      return 'App';
    case 'service':  return 'Service';
    case 'creative': return 'Creative';
    default:         return 'Project';
  }
};

export default function ProjectsGrid({ projects, onProjectClick }: Props) {
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 pb-20 space-y-4">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="lg rounded-4xl p-6 md:p-8"
      >
        <div className="relative z-10">
          <p className="eyebrow mb-2">Work</p>
          <h1 className="headline font-bold text-3xl md:text-4xl text-fg">Projects.</h1>
          <p className="mt-2 text-sm md:text-base text-muted">
            Selected case notes. Tap a card to open the brief.
          </p>
        </div>
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={() => onProjectClick(project)}
              className="lg lg-hover rounded-3xl p-5 text-left flex flex-col group"
            >
              <div className="flex items-start justify-between mb-4 relative z-10">
                {isLucideIcon && (
                  <div className="lg-sm w-11 h-11 rounded-2xl flex items-center justify-center shrink-0">
                    <IconComponent className="w-5 h-5 text-fg relative z-10" strokeWidth={2} />
                  </div>
                )}
                {isImageIcon && (
                  <div className="lg-sm w-11 h-11 rounded-2xl flex items-center justify-center p-1.5 shrink-0">
                    <img
                      src={project.icon as string}
                      alt={`${project.name} logo`}
                      className="w-full h-full object-contain relative z-10"
                    />
                  </div>
                )}
                <ArrowUpRight
                  className="w-4 h-4 text-muted shrink-0 transition-all group-hover:text-fg group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2}
                />
              </div>

              <div className="relative z-10 flex flex-col flex-1">
                <p className="eyebrow mb-1">{categoryLabel(project.category)}</p>
                <h3 className="font-semibold text-lg text-fg leading-tight mb-2">
                  {project.name}
                </h3>
                <p className="text-sm text-muted leading-snug line-clamp-2 mb-3 flex-1">
                  {project.mission}
                </p>
                <div className="flex flex-wrap gap-1">
                  {project.stack.slice(0, 3).map((tech, j) => (
                    <span key={j} className="lg-sm rounded-full px-2 py-0.5 text-[11px] text-fg relative z-10">
                      {tech}
                    </span>
                  ))}
                  {project.stack.length > 3 && (
                    <span className="lg-sm rounded-full px-2 py-0.5 text-[11px] text-muted relative z-10">
                      +{project.stack.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
