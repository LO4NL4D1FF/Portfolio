'use client';

import { Project } from '@/lib/projects';
import { LucideIcon } from 'lucide-react';

interface ProjectDetailViewProps { project: Project; }

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted mb-1.5">
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
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        {isLucideIcon && (
          <div className="w-12 h-12 rounded-xl glass-subtle flex items-center justify-center shrink-0">
            <IconComponent className="w-5 h-5 text-fg" strokeWidth={1.75} />
          </div>
        )}
        {isImageIcon && (
          <div className="w-12 h-12 rounded-xl glass-subtle flex items-center justify-center p-1.5 shrink-0 bg-white/60">
            <img src={project.icon as string} alt={`${project.name} logo`} className="w-full h-full object-contain" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-semibold text-xl text-fg tracking-tight leading-tight">
            {project.name}
          </h3>
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted mt-0.5">
            {project.category}
          </p>
        </div>
      </div>

      <Row label="Mission">
        <p className="text-sm text-fg-soft leading-relaxed">{project.mission}</p>
      </Row>

      <Row label="Problem">
        <p className="text-sm text-fg-soft leading-relaxed">{project.problem}</p>
      </Row>

      <Row label="Overview">
        <p className="text-sm text-fg-soft leading-relaxed">{project.overview}</p>
      </Row>

      <Row label="Stack">
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech, i) => (
            <span key={i} className="glass-chip rounded-full px-2.5 py-0.5 text-[11px] text-fg-soft">
              {tech}
            </span>
          ))}
        </div>
      </Row>

      <Row label="Insights">
        <ul className="space-y-1.5">
          {project.insights.map((insight, i) => (
            <li key={i} className="flex gap-2 text-sm text-fg-soft leading-relaxed">
              <span className="text-muted shrink-0">—</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </Row>

      {project.github && (
        <Row label={project.github.available ? 'Repository · Public' : 'Repository · Private'}>
          <p className="text-sm text-muted">{project.github.accessNote}</p>
        </Row>
      )}
    </div>
  );
}
