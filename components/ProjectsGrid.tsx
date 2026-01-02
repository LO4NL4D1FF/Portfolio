'use client';

import { motion } from 'framer-motion';
import { Project } from '@/lib/projects';
import { LucideIcon } from 'lucide-react';

interface ProjectsGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

export default function ProjectsGrid({ projects, onProjectClick }: ProjectsGridProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'app':
        return 'from-pixel-indigo to-pixel-sky';
      case 'service':
        return 'from-pixel-green to-pixel-lime';
      case 'creative':
        return 'from-pixel-pink to-pixel-peach';
      default:
        return 'from-pixel-gray to-pixel-light';
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'app':
        return 'bg-pixel-cyan text-pixel-black';
      case 'service':
        return 'bg-pixel-lime text-pixel-black';
      case 'creative':
        return 'bg-pixel-pink text-pixel-white';
      default:
        return 'bg-pixel-gray text-pixel-white';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {projects.map((project, index) => {
          const IconComponent = project.icon as LucideIcon;
          const isLucideIcon = typeof project.icon !== 'string';

          return (
            <motion.div
              key={project.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, type: 'spring', duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onProjectClick(project)}
              className="cursor-pointer no-select"
            >
              {/* Card */}
              <div className="relative bg-pixel-black border-4 border-pixel-white shadow-pixel hover:shadow-pixel-lg transition-shadow duration-200">
                {/* Inner border */}
                <div className="absolute inset-2 border-2 border-pixel-gray pointer-events-none"></div>

                {/* Content */}
                <div className={`relative bg-gradient-to-br ${getCategoryColor(project.category)} p-6 h-full flex flex-col`}>
                  {/* Category badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`${getCategoryBadgeColor(project.category)} px-3 py-1 font-game text-xs border-2 border-pixel-black shadow-pixel-sm`}>
                      {project.category.toUpperCase()}
                    </span>
                  </div>

                  {/* Icon */}
                  <motion.div
                    className="mb-4 flex items-center justify-center"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {isLucideIcon ? (
                      <div className="w-20 h-20 bg-pixel-yellow border-4 border-pixel-orange shadow-pixel-sm flex items-center justify-center">
                        <IconComponent className="w-12 h-12 text-pixel-black" strokeWidth={2.5} />
                      </div>
                    ) : (
                      <div className="text-6xl">{project.icon as string}</div>
                    )}
                  </motion.div>

                  {/* Title */}
                  <h3 className="font-game text-xl md:text-2xl text-pixel-white text-outline text-center mb-3 leading-relaxed">
                    {project.name}
                  </h3>

                  {/* Mission */}
                  <p className="font-pixel text-lg text-pixel-white text-center mb-4 flex-1">
                    {project.mission}
                  </p>

                  {/* Stack tags */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {project.stack.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="bg-pixel-black/50 border-2 border-pixel-white px-2 py-1 font-pixel text-sm text-pixel-yellow"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.stack.length > 3 && (
                      <span className="bg-pixel-black/50 border-2 border-pixel-white px-2 py-1 font-pixel text-sm text-pixel-yellow">
                        +{project.stack.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Click indicator */}
                  <motion.div
                    className="mt-4 text-center"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="font-game text-sm text-pixel-yellow">
                      CLICK FOR DETAILS ▶
                    </span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
