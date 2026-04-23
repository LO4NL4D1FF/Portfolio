'use client';

import { Project } from '@/lib/projects';
import { LucideIcon } from 'lucide-react';

interface Props { project: Project; }

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section>
      <p className="eyebrow mb-1.5">{label}</p>
      {children}
    </section>
  );
}

export default function ProjectDetailView({ project }: Props) {
  const IconComponent = project.icon as LucideIcon;
  const isLucideIcon = typeof project.icon !== 'string';
  const isImageIcon = typeof project.icon === 'string' && project.icon.startsWith('/');

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        {isLucideIcon && (
          <div className="lg-sm w-12 h-12 rounded-2xl flex items-center justify-center shrink-0">
            <IconComponent className="w-5 h-5 text-fg relative z-10" strokeWidth={2} />
          </div>
        )}
        {isImageIcon && (
          <div className="lg-sm w-12 h-12 rounded-2xl flex items-center justify-center p-1.5 shrink-0">
            <img src={project.icon as string} alt={`${project.name} logo`} className="w-full h-full object-contain relative z-10" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-bold text-xl text-fg leading-tight">{project.name}</h3>
          <p className="eyebrow mt-0.5">{project.category}</p>
        </div>
      </div>

      <Row label="Mission">
        <p className="text-sm text-fg leading-relaxed">{project.mission}</p>
      </Row>

      <Row label="Problem">
        <p className="text-sm text-fg leading-relaxed">{project.problem}</p>
      </Row>

      <Row label="Overview">
        <p className="text-sm text-fg leading-relaxed">{project.overview}</p>
      </Row>

      <Row label="Stack">
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tech, i) => (
            <span key={i} className="lg-sm rounded-full px-2.5 py-0.5 text-[11px] text-fg relative z-10">
              {tech}
            </span>
          ))}
        </div>
      </Row>

      <Row label="Insights">
        <ul className="space-y-1.5">
          {project.insights.map((insight, i) => (
            <li key={i} className="flex gap-2 text-sm text-fg leading-relaxed">
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
