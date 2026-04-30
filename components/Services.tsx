'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { services } from '@/lib/projects';

export default function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-28">
      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-eyebrow">Services</p>
            <h2 className="mt-2 section-title">What I can build for you.</h2>
            <p className="mt-3 max-w-xl text-sm text-cream-300">
              Honest scopes, fair rates, and clear delivery. Pricing is a
              starting point and is adjusted to the brief.
            </p>
          </div>
          <a href="#contact" className="btn-ghost">
            Request a custom quote
          </a>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="surface-strong flex flex-col p-6"
            >
              <h3 className="font-display text-lg font-semibold text-cream-50">
                {service.name}
              </h3>
              <p className="mt-1 text-sm text-cream-300">
                {service.description}
              </p>

              <p className="mt-4 font-mono text-sm text-ember-400">
                {service.pricing}
              </p>

              <ul className="mt-5 flex-1 space-y-2.5">
                {service.details.map((d) => (
                  <li
                    key={d}
                    className="flex items-start gap-2 text-sm text-cream-200"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-none text-accent-300" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className="mt-6 inline-flex items-center text-sm font-medium text-accent-300 transition hover:text-accent-200"
              >
                Start a brief
                <span className="ml-1">→</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
