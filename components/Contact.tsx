'use client';

import { motion } from 'framer-motion';
import { Mail, Github, MapPin, ArrowUpRight } from 'lucide-react';
import { profile } from '@/lib/profile';

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 sm:py-28">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="surface-strong relative overflow-hidden p-8 sm:p-12"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-500/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-ember-500/10 blur-3xl"
          />

          <div className="relative grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="section-eyebrow">Contact</p>
              <h2 className="mt-2 section-title">
                Have a project? Tell me about it.
              </h2>
              <p className="mt-4 max-w-xl text-cream-300">
                I read every message. Briefs, collaboration ideas, internships,
                or a quiet hello are all welcome. I am open and easy to work
                with, and I am eager to keep learning.
              </p>

              <div className="mt-8 space-y-3">
                <a
                  href={`mailto:${profile.contacts.email}`}
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-500/15 text-accent-300">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-cream-400">
                        Email
                      </span>
                      <span className="block text-sm text-cream-100">
                        {profile.contacts.email}
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-cream-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cream-50" />
                </a>

                <a
                  href={profile.contacts.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 transition hover:border-white/20 hover:bg-white/[0.05]"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-500/15 text-accent-300">
                      <Github className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-cream-400">
                        GitHub
                      </span>
                      <span className="block text-sm text-cream-100">
                        github.com/lo4nl4d1ff
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-cream-300 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cream-50" />
                </a>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <span className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-500/15 text-accent-300">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-cream-400">
                        Based in
                      </span>
                      <span className="block text-sm text-cream-100">
                        {profile.contacts.location}
                      </span>
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="surface p-6">
                <h3 className="font-display text-lg text-cream-50">
                  Working with me
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-cream-200">
                  <li>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-300">
                      Process
                    </span>
                    <p className="mt-1">
                      Brief in, scope out, build, ship, then a short handoff
                      with documentation.
                    </p>
                  </li>
                  <li>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-300">
                      Communication
                    </span>
                    <p className="mt-1">
                      Plain language, clear updates, no jargon for its own
                      sake.
                    </p>
                  </li>
                  <li>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-300">
                      Posture
                    </span>
                    <p className="mt-1">
                      Calm, curious, and ready to learn whatever the work
                      needs.
                    </p>
                  </li>
                </ul>

                <a
                  href={`mailto:${profile.contacts.email}?subject=Project%20brief`}
                  className="btn-primary mt-6 w-full"
                >
                  Send a brief
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
