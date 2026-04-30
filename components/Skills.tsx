'use client';

import { motion } from 'framer-motion';
import { skillGroups } from '@/lib/profile';

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 sm:py-28">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-eyebrow">Skills</p>
            <h2 className="mt-2 section-title">
              The stack I lean on, honestly weighted.
            </h2>
          </div>
          <p className="max-w-md text-sm text-cream-300">
            Frontend is where I am most fluent. Backend is in active growth, and
            I would rather list it accurately than oversell it.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {skillGroups.map((group, gi) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: gi * 0.05 }}
              className="surface-strong p-6"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-lg text-cream-50">
                  {group.title}
                </h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-300">
                  {group.weight}
                </span>
              </div>

              <ul className="mt-6 space-y-4">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-cream-100">{item.name}</span>
                      <span className="font-mono text-[11px] text-cream-400">
                        {item.level}
                      </span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.level}%` }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full rounded-full bg-gradient-to-r from-accent-500 via-accent-400 to-ember-500"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
