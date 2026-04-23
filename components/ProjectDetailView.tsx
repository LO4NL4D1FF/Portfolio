'use client';

import { Project } from '@/lib/projects';
import { LucideIcon } from 'lucide-react';

interface ProjectDetailViewProps {
  project: Project;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="py-4 border-b border-ink-line last:border-b-0">
      <p className="font-mono text-[10px] tracking-[0.3em] text-slate mb-2">
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
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 pb-5 mb-2 border-b border-ink-line">
        {isLucideIcon && (
          <div className="w-12 h-12 border border-ink-line flex items-center justify-center shrink-0">
            <IconComponent className="w-5 h-5 text-amber" strokeWidth={1.5} />
          </div>
        )}
        {isImageIcon && (
          <div className="w-12 h-12 border border-ink-line flex items-center justify-center p-1.5 shrink-0">
            <img src={project.icon as string} alt={`${project.name} logo`} className="w-full h-full object-contain opacity-90" />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="font-sans font-medium text-xl md:text-2xl text-bone tracking-wide">
            {project.name}
          </h3>
          <p className="font-mono text-[11px] tracking-[0.25em] text-dim uppercase mt-0.5">
            {project.category}
          </p>
        </div>
      </div>

      <Row label="MISSION">
        <p className="font-sans text-sm md:text-base text-bone/90 leading-relaxed">
          {project.mission}
        </p>
      </Row>

      <Row label="PROBLEM">
        <p className="font-sans text-sm md:text-base text-bone/90 leading-relaxed">
          {project.problem}
        </p>
      </Row>

      <Row label="OVERVIEW">
        <p className="font-sans text-sm md:text-base text-bone/90 leading-relaxed">
          {project.overview}
        </p>
      </Row>

      <Row label="STACK">
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
          {project.stack.map((tech, i) => (
            <li key={i} className="font-mono text-xs tracking-[0.15em] text-bone/85">
              {tech}
            </li>
          ))}
        </ul>
      </Row>

      <Row label="INSIGHTS">
        <ul className="space-y-2">
          {project.insights.map((insight, i) => (
            <li key={i} className="flex gap-3 font-sans text-sm md:text-base text-bone/90 leading-relaxed">
              <span className="text-slate shrink-0">—</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </Row>

      {project.github && (
        <Row label={project.github.available ? 'REPO · OPEN' : 'REPO · PRIVATE'}>
          <p className="font-sans text-sm text-bone/80">{project.github.accessNote}</p>
        </Row>
      )}
    </div>
  );
}
