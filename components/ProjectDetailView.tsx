'use client';

import { Project } from '@/lib/projects';
import { LucideIcon } from 'lucide-react';

interface ProjectDetailViewProps {
  project: Project;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-[10px] tracking-[0.3em] text-g-700 uppercase mb-2">
        {label}
      </p>
      {children}
    </section>
  );
}

export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const IconComponent = project.icon as LucideIcon;
  const isLucideIcon = typeof project.icon !== 'string';
  const isImageIcon = typeof project.icon === 'string' && project.icon.startsWith('/');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {isLucideIcon && (
          <div className="w-12 h-12 rounded-xl glass-subtle flex items-center justify-center shrink-0">
            <IconComponent className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
        )}
        {isImageIcon && (
          <div className="w-12 h-12 rounded-xl glass-subtle flex items-center justify-center p-1.5 shrink-0">
            <img src={project.icon as string} alt={`${project.name} logo`} className="w-full h-full object-contain opacity-90" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-medium text-xl md:text-2xl text-white tracking-tight">
            {project.name}
          </h3>
          <p className="text-[11px] tracking-[0.25em] text-g-700 uppercase mt-0.5">
            {project.category}
          </p>
        </div>
      </div>

      <Row label="Mission">
        <p className="text-sm md:text-base text-g-900 leading-relaxed">
          {project.mission}
        </p>
      </Row>

      <Row label="Problem">
        <p className="text-sm md:text-base text-g-900 leading-relaxed">
          {project.problem}
        </p>
      </Row>

      <Row label="Overview">
        <p className="text-sm md:text-base text-g-900 leading-relaxed">
          {project.overview}
        </p>
      </Row>

      <Row label="Stack">
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded-full glass-subtle text-[11px] text-g-900"
            >
              {tech}
            </span>
          ))}
        </div>
      </Row>

      <Row label="Insights">
        <ul className="space-y-2">
          {project.insights.map((insight, i) => (
            <li key={i} className="flex gap-3 text-sm md:text-base text-g-900 leading-relaxed">
              <span className="text-g-700 shrink-0">—</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </Row>

      {project.github && (
        <Row label={project.github.available ? 'Repository · Public' : 'Repository · Private'}>
          <p className="text-sm text-g-800">{project.github.accessNote}</p>
        </Row>
      )}
    </div>
  );
}
