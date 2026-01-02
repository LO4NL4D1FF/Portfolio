'use client';

import { Project } from '@/lib/projects';
import { LucideIcon } from 'lucide-react';

interface ProjectDetailViewProps {
  project: Project;
}

export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const IconComponent = project.icon as LucideIcon;
  const isLucideIcon = typeof project.icon !== 'string';

  return (
    <div className="space-y-6">
      {/* Header with icon */}
      <div className="flex items-center gap-4 pb-4 border-b-4 border-pixel-yellow">
        {isLucideIcon && (
          <div className="w-16 h-16 bg-pixel-yellow border-4 border-pixel-orange shadow-pixel flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-10 h-10 text-pixel-black" strokeWidth={2.5} />
          </div>
        )}
        <div>
          <h3 className="font-game text-2xl md:text-3xl text-pixel-yellow">
            {project.name}
          </h3>
          <p className="font-pixel text-lg text-pixel-cyan mt-1">
            {project.category.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-pixel-black/50 border-2 border-pixel-cyan p-4">
        <h4 className="font-game text-sm text-pixel-cyan mb-2">MISSION</h4>
        <p className="font-pixel text-xl text-pixel-white">
          {project.mission}
        </p>
      </div>

      {/* Problem */}
      <div className="bg-pixel-black/50 border-2 border-pixel-red p-4">
        <h4 className="font-game text-sm text-pixel-red mb-2">PROBLEM</h4>
        <p className="font-pixel text-xl text-pixel-white">
          {project.problem}
        </p>
      </div>

      {/* Overview */}
      <div className="bg-pixel-black/50 border-2 border-pixel-lime p-4">
        <h4 className="font-game text-sm text-pixel-lime mb-2">OVERVIEW</h4>
        <p className="font-pixel text-xl text-pixel-white">
          {project.overview}
        </p>
      </div>

      {/* Tech Stack */}
      <div>
        <h4 className="font-game text-sm text-pixel-yellow mb-3">TECH STACK</h4>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech, i) => (
            <div
              key={i}
              className="bg-gradient-to-r from-pixel-indigo to-pixel-sky border-2 border-pixel-white px-4 py-2 shadow-pixel-sm"
            >
              <span className="font-pixel text-lg text-pixel-white">
                {tech}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div>
        <h4 className="font-game text-sm text-pixel-yellow mb-3">KEY INSIGHTS</h4>
        <div className="space-y-3">
          {project.insights.map((insight, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-pixel-black/50 border-2 border-pixel-gray p-3"
            >
              <span className="text-pixel-lime text-xl flex-shrink-0">▶</span>
              <p className="font-pixel text-lg text-pixel-white">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub Access */}
      {project.github && (
        <div className={`border-4 p-4 ${project.github.available ? 'bg-pixel-green/20 border-pixel-green' : 'bg-pixel-red/20 border-pixel-red'}`}>
          <h4 className="font-game text-sm mb-2" style={{ color: project.github.available ? '#a7f070' : '#ff77a8' }}>
            {project.github.available ? '✓ GITHUB AVAILABLE' : '✗ PRIVATE REPOSITORY'}
          </h4>
          <p className="font-pixel text-lg text-pixel-white">
            {project.github.accessNote}
          </p>
        </div>
      )}
    </div>
  );
}
