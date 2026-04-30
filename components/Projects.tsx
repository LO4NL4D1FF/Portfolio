'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Lock, Github, Film } from 'lucide-react';
import { projects, type Project, type ProjectCategory } from '@/lib/projects';

const filters: { id: ProjectCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'app', label: 'Apps' },
  { id: 'creative', label: 'Creative' },
];

export default function Projects() {
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all');

  const filtered = projects.filter(
    (p) => filter === 'all' || p.category === filter
  );

  return (
    <section id="work" className="relative py-24 sm:py-28">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="section-eyebrow">Selected work</p>
            <h2 className="mt-2 section-title">
              Things I have shipped, with the receipts.
            </h2>
            <p className="mt-3 max-w-xl text-sm text-cream-300">
              A mix of product engineering and a separate creative practice in
              video. Filter to focus.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  filter === f.id
                    ? 'border-accent-400 bg-accent-500/15 text-cream-50'
                    : 'border-white/10 bg-white/[0.02] text-cream-300 hover:border-white/20 hover:text-cream-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.article
                key={project.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className="group surface-strong relative overflow-hidden p-6"
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br ${project.accent} opacity-60 transition-opacity group-hover:opacity-100`}
                />

                <div className="relative z-10 flex items-start justify-between">
                  <ProjectIcon project={project} />
                  <span className="chip">
                    {project.category === 'creative' ? 'Creative' : 'App'}
                  </span>
                </div>

                <h3 className="relative z-10 mt-6 font-display text-xl font-semibold text-cream-50">
                  {project.name}
                </h3>
                <p className="relative z-10 mt-1 text-sm text-cream-300">
                  {project.tagline}
                </p>

                <p className="relative z-10 mt-4 text-sm leading-relaxed text-cream-200">
                  {project.summary}
                </p>

                <ul className="relative z-10 mt-5 space-y-2">
                  {project.highlights.slice(0, 2).map((h) => (
                    <li
                      key={h}
                      className="flex gap-2 text-xs text-cream-300"
                    >
                      <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-accent-300" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative z-10 mt-6 flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 5).map((s) => (
                    <span
                      key={s}
                      className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-cream-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-cream-300">
                  <span className="inline-flex items-center gap-1.5">
                    {project.source.public ? (
                      <Github className="h-3.5 w-3.5 text-accent-300" />
                    ) : (
                      <Lock className="h-3.5 w-3.5 text-cream-400" />
                    )}
                    {project.source.note}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-cream-300 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cream-50" />
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function ProjectIcon({ project }: { project: Project }) {
  if (project.category === 'creative') {
    return (
      <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.04]">
        <Film className="h-5 w-5 text-cream-100" />
      </div>
    );
  }
  if (project.logo) {
    return (
      <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
        <Image
          src={project.logo}
          alt={`${project.name} logo`}
          fill
          sizes="48px"
          className="object-contain p-2"
        />
      </div>
    );
  }
  return (
    <div className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.04] font-display text-base text-cream-100">
      {project.name.slice(0, 1)}
    </div>
  );
}
