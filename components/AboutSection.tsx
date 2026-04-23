'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Download, GraduationCap, BookOpen, Pencil } from 'lucide-react';

const stats = [
  { label: 'Name',         value: 'Loan Ladiff Sedo-Ta' },
  { label: 'Aliases',      value: 'Diff · Link · Mr. Badboi' },
  { label: 'Age',          value: String(new Date().getFullYear() - 2004) },
  { label: 'Origin',       value: 'Cameroonian' },
  { label: 'Based',        value: 'Monrovia, Liberia' },
  { label: 'Role',         value: 'Software Engineer · Product Builder' },
  { label: 'Experience',   value: '3+ years' },
  { label: 'Trajectory',   value: 'Founder / CEO' },
];

const timeline: { title: string; description: string; current?: boolean }[] = [
  { title: 'The Initiate',      description: 'HTML, CSS — first static pages. Structure, color, balance.' },
  { title: 'Logic Unlocked',    description: 'C++, C#, Python. Console games, Student Record Management System. Control flow mastered.' },
  { title: 'Interface Crafter', description: 'React enters. Personal portfolio. Component thinking, UI responsiveness obsession begins.' },
  { title: 'System Builder',    description: 'Smart Save — web + desktop budgeting tool. Real users, real constraints, backend matters.' },
  { title: 'The Architect',     description: 'Zenix / CORELM / Audify. AI-powered learning, subscription logic, gamification. Founder mindset awakens.' },
  { title: 'The Strategist',    description: 'Current. Rebuilding backends, optimizing AI cost vs power, preparing for scale.', current: true },
];

const stack = {
  primary:   ['HTML/CSS', 'JavaScript', 'React', 'React Native', 'TypeScript', 'Next.js', 'C# WinForms', 'Supabase', 'Firebase', 'AI Integration'],
  secondary: ['C++', 'Python', 'Java', 'SQL', 'Linux', 'Node.js'],
  tools:     ['VS Code', 'Claude Code CLI', 'Windsurf', 'Expo', 'GitHub', 'CapCut', 'Premiere Pro'],
};

const education = [
  { title: 'BSc Software Engineering', institution: 'BlueCrest University College, Liberia', status: 'In progress · mid 2026', icon: GraduationCap },
  { title: 'WASSCE',                   institution: 'Science Major',                          status: 'Completed',             icon: BookOpen },
  { title: 'FSLC',                     institution: 'First School Leaving Certificate',       status: 'Completed',             icon: Pencil },
];

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <p className="text-[11px] tracking-[0.3em] text-g-700 uppercase mb-2">
        {subtitle}
      </p>
      <h2 className="font-sans font-light text-2xl md:text-3xl tracking-tight text-white">
        {title}
      </h2>
    </div>
  );
}

export default function AboutSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen px-5 md:px-8 py-6 pb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        {/* Hero */}
        <section className="glass rounded-3xl p-8 md:p-10">
          <p className="text-xs tracking-[0.3em] text-g-700 uppercase mb-3">
            Profile
          </p>
          <h1 className="font-sans font-light text-4xl md:text-5xl tracking-tight text-white mb-6">
            Loan Ladiff Sedo-Ta
          </h1>
          <div className="space-y-4 text-base text-g-800 leading-relaxed">
            <p>
              A builder in motion — a fast-learning software engineer shaped by curiosity, restraint, and ambition. I design not just applications but systems: systems that teach, systems that save, systems that listen.
            </p>
            <p>
              My work lives at the intersection of education, AI, design, and human behavior. I&apos;m drawn to tools that simplify chaos, teach with joy, and scale quietly until they cannot be ignored.
            </p>
            <p className="text-white">
              I learn by building. I grow by breaking things — then rebuilding them better.
            </p>
          </div>
        </section>

        {/* Record */}
        <section className="glass rounded-3xl p-8 md:p-10">
          <SectionHeader title="Record" subtitle="01 · Facts" />
          <dl>
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex items-center justify-between py-3 ${
                  i === 0 ? '' : 'border-t border-white/5'
                }`}
              >
                <dt className="text-sm text-g-700">{s.label}</dt>
                <dd className="text-sm md:text-base text-white text-right">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Timeline */}
        <section className="glass rounded-3xl p-8 md:p-10">
          <SectionHeader title="Timeline" subtitle="02 · Path" />
          <ol className="space-y-5">
            {timeline.map((t, i) => (
              <li key={t.title} className="flex gap-5">
                <span className="text-xs text-g-700 w-6 shrink-0 pt-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 pb-5 border-b border-white/5 last:border-b-0 last:pb-0">
                  <h3 className={`font-medium text-lg tracking-tight ${t.current ? 'text-white' : 'text-g-900'}`}>
                    {t.title}
                    {t.current && (
                      <span className="ml-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full glass-subtle text-[10px] tracking-[0.15em] uppercase text-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        Current
                      </span>
                    )}
                  </h3>
                  <p className="mt-1.5 text-sm md:text-base text-g-800 leading-relaxed">
                    {t.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Stack */}
        <section className="glass rounded-3xl p-8 md:p-10">
          <SectionHeader title="Stack" subtitle="03 · Tools" />
          <div className="space-y-6">
            {[
              { label: 'Primary',   items: stack.primary },
              { label: 'Secondary', items: stack.secondary },
              { label: 'Tools',     items: stack.tools },
            ].map((group) => (
              <div key={group.label}>
                <p className="text-[11px] tracking-[0.3em] text-g-700 uppercase mb-3">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-full glass-subtle text-xs text-g-900"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="glass rounded-3xl p-8 md:p-10">
          <SectionHeader title="Education" subtitle="04 · Credentials" />
          <ul className="space-y-3">
            {education.map((e) => {
              const Icon = e.icon;
              return (
                <li key={e.title} className="glass-subtle rounded-2xl p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-base text-white tracking-tight">{e.title}</h3>
                    <p className="text-sm text-g-800">{e.institution}</p>
                  </div>
                  <span className="text-[11px] tracking-[0.15em] text-g-700 uppercase shrink-0 pt-1">
                    {e.status}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* CV */}
        <section className="text-center pt-2">
          <a
            href="mailto:difflad@gmail.com?subject=CV%20Request%20-%20Sedo-Ta%20Portfolio&body=Hi%20Sedo-Ta%2C%0A%0AI'd%20like%20to%20request%20your%20CV%2FResume.%0A%0AThank%20you!"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full glass glass-hover text-white text-sm font-medium btn-press"
          >
            <Download className="w-4 h-4" strokeWidth={1.75} />
            Request CV
          </a>
        </section>
      </motion.div>
    </div>
  );
}
