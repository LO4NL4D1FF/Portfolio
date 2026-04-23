'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Service } from '@/lib/projects';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface ServicesMenuProps {
  services: Service[];
}

export default function ServicesMenu({ services }: ServicesMenuProps) {
  const [selected, setSelected] = useState<Service | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="font-mono text-[11px] tracking-[0.3em] text-slate mb-3">
          / / CATALOG
        </p>
        <h1 className="font-sans font-light text-3xl md:text-4xl tracking-[0.15em] text-bone uppercase">
          Services
        </h1>
        <div className="mt-5 h-px bg-ink-line" />
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* List */}
        <ul className="lg:col-span-3">
          {services.map((service, i) => {
            const IconComponent = service.icon as LucideIcon;
            const isActive = selected?.id === service.id;

            return (
              <li key={service.id} className="border-b border-ink-line">
                <button
                  onClick={() => setSelected(service)}
                  className="group w-full text-left flex items-start gap-5 py-5"
                >
                  <span className="font-mono text-[11px] tracking-[0.2em] text-dim w-8 shrink-0 pt-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="w-10 h-10 border border-ink-line flex items-center justify-center shrink-0">
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-amber' : 'text-bone/80 group-hover:text-amber'} transition-colors`} strokeWidth={1.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className={`font-sans font-medium text-lg md:text-xl tracking-wide ${isActive ? 'text-amber' : 'text-bone group-hover:text-amber'} transition-colors`}>
                      {service.name}
                    </h3>
                    <p className="mt-1 font-sans text-sm text-bone/65 line-clamp-2">
                      {service.description}
                    </p>
                    <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-slate">
                      {service.pricing}
                    </p>
                  </div>

                  <span className={`font-mono text-sm text-dim ${isActive ? 'text-amber' : ''} transition-colors`}>
                    →
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Detail */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-20">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.article
                  key={selected.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                  className="border border-ink-line bg-ink-1 p-6"
                >
                  <p className="font-mono text-[11px] tracking-[0.3em] text-slate mb-2">
                    / / SPEC
                  </p>
                  <h3 className="font-sans font-medium text-xl md:text-2xl text-bone tracking-wide mb-4">
                    {selected.name}
                  </h3>

                  <p className="font-sans text-sm md:text-base text-bone/80 leading-relaxed mb-5">
                    {selected.description}
                  </p>

                  <div className="border-t border-ink-line pt-4 mb-5">
                    <p className="font-mono text-[10px] tracking-[0.3em] text-dim mb-1">RATE</p>
                    <p className="font-sans text-lg text-amber">
                      {selected.pricing}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[10px] tracking-[0.3em] text-dim mb-3">INCLUDES</p>
                    <ul className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                      {selected.details.map((d, i) => (
                        <li key={i} className="flex gap-3 font-sans text-sm text-bone/85">
                          <span className="text-slate shrink-0">—</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href={`mailto:difflad@gmail.com?subject=Service%20Inquiry%20-%20${encodeURIComponent(selected.name)}&body=Hi%20Sedo-Ta%2C%0A%0AI'm%20interested%20in%20your%20${encodeURIComponent(selected.name)}%20service.%0A%0AService%3A%20${encodeURIComponent(selected.name)}%0APricing%3A%20${encodeURIComponent(selected.pricing)}%0A%0APlease%20let%20me%20know%20the%20next%20steps!%0A%0AThank%20you!`}
                    className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 border border-amber text-amber font-mono text-xs tracking-[0.25em] hover:bg-amber hover:text-ink-0 transition-colors btn-press"
                  >
                    REQUEST
                  </a>
                </motion.article>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border border-ink-line bg-ink-1 p-8 min-h-[300px] flex items-center justify-center"
                >
                  <p className="font-mono text-[11px] tracking-[0.3em] text-dim text-center">
                    SELECT A SERVICE<br />TO VIEW SPEC
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
