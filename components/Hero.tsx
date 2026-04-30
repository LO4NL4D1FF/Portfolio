'use client';

import { motion } from 'framer-motion';
import { ArrowDownRight, MapPin } from 'lucide-react';
import { profile } from '@/lib/profile';

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-32 sm:pt-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-grid-fade"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18] mix-blend-screen bg-noise"
      />

      <div className="container-page">
        <div className="grid gap-10 pb-20 lg:grid-cols-12 lg:gap-12 lg:pb-28">
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="chip"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Available for select work
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cream-50 sm:text-5xl md:text-6xl lg:text-[68px]"
            >
              {profile.name}.{' '}
              <span className="text-cream-300">A software engineer</span> who
              builds calm interfaces and is learning the systems behind them.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-6 max-w-2xl text-base leading-relaxed text-cream-300 sm:text-lg"
            >
              {profile.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a href="#work" className="btn-primary">
                See the work
                <ArrowDownRight className="h-4 w-4" />
              </a>
              <a href="#contact" className="btn-ghost">
                Start a project
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-cream-300"
            >
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent-300" />
                {profile.location}
              </span>
              <span className="hidden h-4 w-px bg-white/10 sm:inline-block" />
              <span>{profile.focus}</span>
              <span className="hidden h-4 w-px bg-white/10 sm:inline-block" />
              <span>Currently interning at the Avernon Festival, Liberia</span>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="lg:col-span-4"
          >
            <div className="surface-strong relative overflow-hidden p-6 shadow-soft">
              <div
                aria-hidden
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-500/20 blur-3xl"
              />
              <p className="section-eyebrow">Snapshot</p>
              <h3 className="mt-2 font-display text-lg text-cream-50">
                What I am about right now
              </h3>
              <ul className="mt-5 space-y-3 text-sm">
                {profile.highlights.map((h) => (
                  <li
                    key={h.label}
                    className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 last:border-none last:pb-0"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream-400">
                      {h.label}
                    </span>
                    <span className="text-right text-cream-100">{h.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
