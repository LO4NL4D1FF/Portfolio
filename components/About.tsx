'use client';

import { motion } from 'framer-motion';
import { profile } from '@/lib/profile';

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="section-eyebrow">About</p>
            <h2 className="mt-2 section-title">
              Frontend at home, backend in progress.
            </h2>
            <p className="mt-4 text-sm text-cream-300">
              A working portrait of where I am right now, written without
              decoration.
            </p>
          </div>

          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="space-y-5 text-base leading-relaxed text-cream-200"
            >
              {profile.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                {
                  k: 'Now',
                  v: 'Intern, Afriland First Bank Liberia. Administrative coordination and operational support.',
                },
                {
                  k: 'Strength',
                  v: 'Frontend engineering with React, Next.js, and TypeScript.',
                },
                {
                  k: 'Learning',
                  v: 'Backend, APIs, databases, and the quiet plumbing of trustworthy products.',
                },
              ].map((c) => (
                <div key={c.k} className="surface p-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-300">
                    {c.k}
                  </p>
                  <p className="mt-2 text-sm text-cream-100">{c.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
