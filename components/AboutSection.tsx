'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

const stats: { label: string; value: string }[] = [
  { label: 'Handle',    value: 'Loan Ladiff Sedo-Ta' },
  { label: 'Aliases',   value: 'Diff · Link · Mr. Badboi' },
  { label: 'Age',       value: String(new Date().getFullYear() - 2004) },
  { label: 'Origin',    value: 'Cameroonian' },
  { label: 'Based',     value: 'Monrovia, Liberia' },
  { label: 'Role',      value: 'Software Engineer · Product Builder' },
  { label: 'Experience', value: '3+ Years' },
  { label: 'Trajectory', value: 'Founder / CEO' },
];

const timeline: { title: string; description: string; current?: boolean }[] = [
  { title: 'The Initiate',       description: 'HTML, CSS — first static pages. Structure, color, balance.' },
  { title: 'Logic Unlocked',     description: 'C++, C#, Python. Console games, Student Record Management System. Control flow mastered.' },
  { title: 'Interface Crafter',  description: 'React enters. Personal portfolio. Component thinking, UI responsiveness obsession begins.' },
  { title: 'System Builder',     description: 'Smart Save — web + desktop budgeting tool. Real users, real constraints, backend matters.' },
  { title: 'The Architect',      description: 'Zenix / CORELM / Audify. AI-powered learning, subscription logic, gamification. Founder mindset awakens.' },
  { title: 'The Strategist',     description: 'Current. Rebuilding backends, optimizing AI cost vs power, preparing for scale.', current: true },
];

const stack = {
  primary:   ['HTML/CSS', 'JavaScript', 'React', 'React Native', 'TypeScript', 'Next.js', 'C# WinForms', 'Supabase', 'Firebase', 'AI Integration'],
  secondary: ['C++', 'Python', 'Java', 'SQL', 'Linux', 'Node.js'],
  tools:     ['VS Code', 'Claude Code CLI', 'Windsurf', 'Expo', 'GitHub', 'CapCut', 'Premiere Pro'],
};

const education = [
  { title: 'BSc Software Engineering', institution: 'BlueCrest University College, Liberia', status: 'In progress · mid 2026' },
  { title: 'WASSCE',                   institution: 'Science Major',                          status: 'Completed' },
  { title: 'FSLC',                     institution: 'First School Leaving Certificate',       status: 'Completed' },
];

function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-baseline gap-4 mb-6">
      <span className="font-mono text-[11px] tracking-[0.3em] text-slate">/ {num}</span>
      <h2 className="font-sans font-light text-xl md:text-2xl tracking-[0.15em] text-bone uppercase">
        {title}
      </h2>
      <div className="flex-1 h-px bg-ink-line" />
    </div>
  );
}

export default function AboutSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen px-6 py-10 pb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto space-y-16"
      >
        {/* Header */}
        <header>
          <p className="font-mono text-[11px] tracking-[0.3em] text-slate mb-3">
            / / PROFILE
          </p>
          <h1 className="font-sans font-light text-3xl md:text-4xl tracking-[0.15em] text-bone uppercase">
            About
          </h1>
        </header>

        {/* Bio */}
        <section>
          <SectionLabel num="01" title="Bio" />
          <div className="space-y-4 font-sans text-base md:text-lg text-bone/90 leading-relaxed">
            <p>
              A builder in motion — a fast-learning software engineer shaped by curiosity, restraint, and ambition. I design not just applications but systems: systems that teach, systems that save, systems that listen.
            </p>
            <p>
              My work lives at the intersection of education, AI, design, and human behavior. I&apos;m drawn to tools that simplify chaos, teach with joy, and scale quietly until they cannot be ignored.
            </p>
            <p className="text-amber">
              I learn by building. I grow by breaking things — then rebuilding them better.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section>
          <SectionLabel num="02" title="Record" />
          <dl className="divide-y divide-ink-line border-y border-ink-line">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center justify-between py-3">
                <dt className="font-mono text-xs tracking-[0.2em] text-dim uppercase">{s.label}</dt>
                <dd className="font-sans text-sm md:text-base text-bone text-right">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Timeline */}
        <section>
          <SectionLabel num="03" title="Timeline" />
          <ol className="space-y-5">
            {timeline.map((t, i) => (
              <li key={t.title} className="flex gap-6">
                <span className="font-mono text-xs tracking-[0.2em] text-dim pt-0.5 w-8 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 pb-5 border-b border-ink-line last:border-b-0">
                  <h3 className={`font-sans font-medium text-lg md:text-xl tracking-wide ${t.current ? 'text-amber' : 'text-bone'}`}>
                    {t.title}
                    {t.current && <span className="ml-3 font-mono text-[10px] tracking-[0.3em] text-amber">· CURRENT</span>}
                  </h3>
                  <p className="mt-1.5 font-sans text-sm md:text-base text-bone/70 leading-relaxed">
                    {t.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Stack */}
        <section>
          <SectionLabel num="04" title="Stack" />
          <div className="space-y-6">
            {[
              { label: 'Primary',   items: stack.primary },
              { label: 'Secondary', items: stack.secondary },
              { label: 'Tools',     items: stack.tools },
            ].map((group) => (
              <div key={group.label} className="pb-4 border-b border-ink-line last:border-b-0">
                <p className="font-mono text-[11px] tracking-[0.3em] text-slate mb-3">
                  {group.label.toUpperCase()}
                </p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {group.items.map((t) => (
                    <li key={t} className="font-sans text-sm md:text-base text-bone/85">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <SectionLabel num="05" title="Education" />
          <ul className="divide-y divide-ink-line border-y border-ink-line">
            {education.map((e) => (
              <li key={e.title} className="py-4 flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <h3 className="font-sans font-medium text-base md:text-lg text-bone">{e.title}</h3>
                  <p className="font-sans text-sm text-bone/70">{e.institution}</p>
                </div>
                <span className="font-mono text-[10px] tracking-[0.25em] text-slate uppercase shrink-0 pt-1">
                  {e.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* CV */}
        <section>
          <a
            href="mailto:difflad@gmail.com?subject=CV%20Request%20-%20Sedo-Ta%20Portfolio&body=Hi%20Sedo-Ta%2C%0A%0AI'd%20like%20to%20request%20your%20CV%2FResume.%0A%0AThank%20you!"
            className="group inline-flex items-center gap-3 px-6 py-3 border border-amber text-amber font-mono text-sm tracking-[0.25em] hover:bg-amber hover:text-ink-0 transition-colors btn-press"
          >
            <Download className="w-4 h-4" strokeWidth={1.5} />
            REQUEST CV
          </a>
        </section>
      </motion.div>
    </div>
  );
}
