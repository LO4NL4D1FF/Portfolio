'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Download, GraduationCap, BookOpen, Pencil } from 'lucide-react';

const stats = [
  { label: 'Name',       value: 'Loan Ladiff Sedo-Ta' },
  { label: 'Aliases',    value: 'Diff · Link · Mr. Badboi' },
  { label: 'Age',        value: String(new Date().getFullYear() - 2004) },
  { label: 'Origin',     value: 'Cameroonian' },
  { label: 'Based',      value: 'Monrovia, Liberia' },
  { label: 'Role',       value: 'Software Engineer' },
  { label: 'Experience', value: '3+ years' },
  { label: 'Trajectory', value: 'Founder / CEO' },
];

const timeline: { title: string; description: string; current?: boolean }[] = [
  { title: 'The Initiate',      description: 'HTML, CSS — first static pages. Structure, color, balance.' },
  { title: 'Logic Unlocked',    description: 'C++, C#, Python. Console games, Student Record Management System.' },
  { title: 'Interface Crafter', description: 'React enters. Personal portfolio. Component thinking.' },
  { title: 'System Builder',    description: 'Smart Save — web + desktop budgeting tool. Real users, real constraints.' },
  { title: 'The Architect',     description: 'Zenix / CORELM / Audify. AI-powered learning, gamification.' },
  { title: 'The Strategist',    description: 'Rebuilding backends, optimizing AI cost vs power, preparing for scale.', current: true },
];

const stack = {
  primary:   ['HTML/CSS', 'JavaScript', 'React', 'React Native', 'TypeScript', 'Next.js', 'C# WinForms', 'Supabase', 'Firebase', 'AI Integration'],
  secondary: ['C++', 'Python', 'Java', 'SQL', 'Linux', 'Node.js'],
  tools:     ['VS Code', 'Claude Code CLI', 'Windsurf', 'Expo', 'GitHub', 'CapCut', 'Premiere Pro'],
};

const education = [
  { title: 'BSc Software Engineering', institution: 'BlueCrest University College', status: 'In progress · mid 2026', icon: GraduationCap },
  { title: 'WASSCE',                   institution: 'Science Major',                 status: 'Completed',             icon: BookOpen },
  { title: 'FSLC',                     institution: 'Primary School Certificate',    status: 'Completed',             icon: Pencil },
];

export default function AboutSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="px-5 md:px-8 py-6 pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-4"
      >
        {/* Hero */}
        <section className="glass rounded-3xl p-6 md:p-10">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-3">About</p>
          <h1 className="headline font-semibold text-4xl md:text-5xl text-fg mb-4">
            Loan Ladiff Sedo-Ta.
          </h1>
          <p className="text-base md:text-lg text-fg-soft leading-relaxed max-w-2xl">
            A builder in motion — a fast-learning software engineer shaped by curiosity, restraint, and ambition. I design systems that teach, save, and listen — at the intersection of education, AI, design, and human behavior.
          </p>
          <p className="mt-3 text-base md:text-lg text-fg max-w-2xl">
            I learn by building. I grow by breaking things — then rebuilding them better.
          </p>
        </section>

        {/* Record + Education — side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <section className="glass rounded-3xl p-6 md:p-7 lg:col-span-2">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-4">Record</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
              {stats.map((s) => (
                <div key={s.label} className="border-b border-black/5 pb-2">
                  <dt className="text-xs text-muted">{s.label}</dt>
                  <dd className="text-sm md:text-[15px] text-fg font-medium truncate">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="glass rounded-3xl p-6 md:p-7 space-y-3">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-1">Education</p>
            {education.map((e) => {
              const Icon = e.icon;
              return (
                <div key={e.title} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl glass-subtle flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-fg" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-fg tracking-tight leading-tight">{e.title}</p>
                    <p className="text-xs text-muted truncate">{e.institution}</p>
                    <p className="text-[11px] text-sub mt-0.5">{e.status}</p>
                  </div>
                </div>
              );
            })}
          </section>
        </div>

        {/* Timeline — 2-col grid (cuts vertical space in half) */}
        <section className="glass rounded-3xl p-6 md:p-8">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-4">Timeline</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {timeline.map((t, i) => (
              <div key={t.title} className="flex gap-3">
                <span className="text-[11px] text-muted w-5 shrink-0 pt-0.5 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-semibold text-fg tracking-tight flex items-center gap-2">
                    {t.title}
                    {t.current && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-fg text-white text-[9px] tracking-[0.15em] uppercase font-medium">
                        Now
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-muted leading-snug mt-0.5">
                    {t.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stack — compact single panel, 3 groups inline */}
        <section className="glass rounded-3xl p-6 md:p-8">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-muted mb-4">Stack</p>
          <div className="space-y-4">
            {[
              { label: 'Primary',   items: stack.primary },
              { label: 'Secondary', items: stack.secondary },
              { label: 'Tools',     items: stack.tools },
            ].map((group) => (
              <div key={group.label} className="flex flex-col md:flex-row md:items-start gap-2 md:gap-5 pb-3 border-b border-black/5 last:border-b-0 last:pb-0">
                <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-sub w-24 shrink-0 pt-1">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((t) => (
                    <span key={t} className="glass-chip rounded-full px-2.5 py-0.5 text-xs text-fg">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CV CTA */}
        <div className="text-center pt-2">
          <a
            href="mailto:difflad@gmail.com?subject=CV%20Request%20-%20Sedo-Ta%20Portfolio&body=Hi%20Sedo-Ta%2C%0A%0AI'd%20like%20to%20request%20your%20CV%2FResume.%0A%0AThank%20you!"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-fg text-white text-sm font-medium hover:bg-black transition-colors btn-press"
          >
            <Download className="w-4 h-4" strokeWidth={2} />
            Request CV
          </a>
        </div>
      </motion.div>
    </div>
  );
}
