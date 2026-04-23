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
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 pb-24 space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-3xl p-8 md:p-10"
      >
        <p className="text-xs tracking-[0.3em] text-g-700 uppercase mb-3">
          Archive
        </p>
        <h1 className="font-sans font-light text-3xl md:text-4xl tracking-tight text-white">
          Projects
        </h1>
        <p className="mt-3 text-sm md:text-base text-g-800">
          Selected work and case notes.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              transition={{ delay: i * 0.04, duration: 0.4 }}
              onClick={() => onProjectClick(project)}
              className="group glass glass-hover rounded-2xl p-6 text-left flex flex-col min-h-[240px]"
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3 min-w-0">
                  {isLucideIcon && (
                    <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center shrink-0">
                      <IconComponent className="w-5 h-5 text-white" strokeWidth={1.5} />
                    </div>
                  )}
                  {isImageIcon && (
                    <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center p-1.5 shrink-0">
                      <img src={project.icon as string} alt={`${project.name} logo`} className="w-full h-full object-contain opacity-90" />
                    </div>
                  )}
                  <span className="text-[11px] tracking-[0.25em] text-g-700 uppercase">
                    {categoryLabel(project.category)}
                  </span>
                </div>

                <ArrowUpRight
                  className="w-4 h-4 text-g-700 transition-all group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                  strokeWidth={1.75}
                />
              </div>

              {/* Name */}
              <h3 className="font-medium text-xl md:text-2xl tracking-tight text-white mb-2">
                {project.name}
              </h3>

              {/* Mission */}
              <p className="text-sm md:text-base text-g-800 leading-relaxed mb-5 flex-1 line-clamp-2">
                {project.mission}
              </p>

              {/* Stack chips */}
              <div className="flex flex-wrap gap-1.5">
                {project.stack.slice(0, 4).map((tech, j) => (
                  <span
                    key={j}
                    className="px-2.5 py-0.5 rounded-full glass-subtle text-[11px] text-g-900"
                  >
                    {tech}
                  </span>
                ))}
                {project.stack.length > 4 && (
                  <span className="px-2.5 py-0.5 rounded-full glass-subtle text-[11px] text-g-700">
                    +{project.stack.length - 4}
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
