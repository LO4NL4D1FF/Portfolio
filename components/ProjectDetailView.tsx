'use client';

import { Project } from '@/lib/projects';
import { LucideIcon } from 'lucide-react';

interface ProjectDetailViewProps {
  project: Project;
}

export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const IconComponent = project.icon as LucideIcon;
  const isLucideIcon = typeof project.icon !== 'string';
  const isImageIcon = typeof project.icon === 'string' && project.icon.startsWith('/');

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-neon-yellow/30">
        {isLucideIcon && (
          <div
            className="w-16 h-16 border-2 border-neon-yellow bg-cyber-void flex items-center justify-center flex-shrink-0"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              boxShadow: '0 0 14px rgba(252,238,10,0.6)',
            }}
          >
            <IconComponent className="w-9 h-9 text-neon-yellow" strokeWidth={1.5} />
          </div>
        )}
        {isImageIcon && (
          <div
            className="w-16 h-16 border-2 border-neon-cyan bg-cyber-void flex items-center justify-center flex-shrink-0 p-2"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              boxShadow: '0 0 14px rgba(0,240,255,0.6)',
            }}
          >
            <img src={project.icon as string} alt={`${project.name} logo`} className="w-full h-full object-contain" />
          </div>
        )}
        <div>
          <h3 className="font-cyber font-black text-xl md:text-2xl tracking-widest text-neon-yellow" style={{ textShadow: '0 0 8px #fcee0a' }}>
            {project.name}
          </h3>
          <p className="font-mono text-xs tracking-widest text-neon-cyan mt-1">
            [ {project.category.toUpperCase()} · CLASSIFIED ]
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="cyber-panel cyber-panel-cyan cyber-clip-sm p-4 relative">
        <h4 className="font-mono text-[10px] md:text-xs tracking-widest text-neon-cyan mb-2">/// MISSION</h4>
        <p className="font-hud text-sm md:text-base text-cyber-bone">
          {project.mission}
        </p>
      </div>

      {/* Problem */}
      <div className="cyber-panel cyber-panel-magenta cyber-clip-sm p-4 relative">
        <h4 className="font-mono text-[10px] md:text-xs tracking-widest text-neon-magenta mb-2">/// PROBLEM</h4>
        <p className="font-hud text-sm md:text-base text-cyber-bone">
          {project.problem}
        </p>
      </div>

      {/* Overview */}
      <div className="cyber-panel cyber-clip-sm p-4 border border-neon-green/60" style={{ boxShadow: 'inset 0 0 12px rgba(57,255,20,0.08)' }}>
        <h4 className="font-mono text-[10px] md:text-xs tracking-widest text-neon-green mb-2">/// OVERVIEW</h4>
        <p className="font-hud text-sm md:text-base text-cyber-bone">
          {project.overview}
        </p>
      </div>

      {/* Tech Stack */}
      <div>
        <h4 className="font-mono text-[10px] md:text-xs tracking-widest text-neon-yellow mb-3">/// TECH STACK</h4>
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech, i) => (
            <span
              key={i}
              className="font-mono text-xs md:text-sm tracking-widest px-3 py-1 bg-cyber-void border border-neon-cyan text-neon-cyan"
              style={{
                clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                boxShadow: 'inset 0 0 6px rgba(0,240,255,0.15)',
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div>
        <h4 className="font-mono text-[10px] md:text-xs tracking-widest text-neon-yellow mb-3">/// KEY INSIGHTS</h4>
        <div className="space-y-2">
          {project.insights.map((insight, i) => (
            <div
              key={i}
              className="flex items-start gap-3 bg-cyber-void/60 border-l-2 border-neon-yellow px-3 py-2"
            >
              <span className="font-mono text-neon-yellow flex-shrink-0">▶</span>
              <p className="font-hud text-sm md:text-base text-cyber-bone">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub */}
      {project.github && (
        <div
          className={`cyber-clip-sm p-4 border-2 ${project.github.available ? 'border-neon-green' : 'border-neon-magenta'}`}
          style={{
            background: project.github.available ? 'rgba(57,255,20,0.05)' : 'rgba(255,0,60,0.05)',
            boxShadow: `inset 0 0 12px ${project.github.available ? 'rgba(57,255,20,0.08)' : 'rgba(255,0,60,0.08)'}`,
          }}
        >
          <h4 className={`font-mono text-xs tracking-widest mb-2 ${project.github.available ? 'text-neon-green' : 'text-neon-magenta'}`}>
            {project.github.available ? '✓ REPO ACCESSIBLE' : '✗ REPO LOCKED'}
          </h4>
          <p className="font-hud text-sm text-cyber-bone">
            {project.github.accessNote}
          </p>
        </div>
      )}
    </div>
  );
}
