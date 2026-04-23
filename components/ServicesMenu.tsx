'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Service } from '@/lib/projects';
import { LucideIcon, ArrowUpRight, Check } from 'lucide-react';
import { useState } from 'react';

interface ServicesMenuProps {
  services: Service[];
}

export default function ServicesMenu({ services }: ServicesMenuProps) {
  const [selected, setSelected] = useState<Service | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 pb-24 space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-3xl p-8 md:p-10"
      >
        <p className="text-xs tracking-[0.3em] text-g-700 uppercase mb-3">
          Catalog
        </p>
        <h1 className="font-sans font-light text-3xl md:text-4xl tracking-tight text-white">
          Services
        </h1>
        <p className="mt-3 text-sm md:text-base text-g-800">
          Engagements and rates.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* List */}
        <div className="lg:col-span-3 space-y-3">
          {services.map((service, i) => {
            const Icon = service.icon as LucideIcon;
            const isActive = selected?.id === service.id;
            return (
              <motion.button
                key={service.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(service)}
                className={`group w-full text-left rounded-2xl p-5 flex items-start gap-4 transition-all ${
                  isActive ? 'glass-strong' : 'glass glass-hover'
                }`}
              >
                <div className="w-11 h-11 rounded-xl glass-subtle flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <h3 className="font-medium text-lg text-white tracking-tight truncate">
                      {service.name}
                    </h3>
                    <span className="text-[11px] tracking-[0.2em] text-g-700 uppercase shrink-0">
                      {service.pricing}
                    </span>
                  </div>
                  <p className="text-sm text-g-800 line-clamp-2">
                    {service.description}
                  </p>
                </div>

                <ArrowUpRight
                  className={`w-4 h-4 shrink-0 transition-all ${
                    isActive ? 'text-white' : 'text-g-700 group-hover:text-white'
                  }`}
                  strokeWidth={1.75}
                />
              </motion.button>
            );
          })}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.article
                  key={selected.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="glass rounded-3xl p-6 md:p-7"
                >
                  <p className="text-[11px] tracking-[0.3em] text-g-700 uppercase mb-2">
                    Spec
                  </p>
                  <h3 className="font-medium text-xl md:text-2xl text-white tracking-tight mb-3">
                    {selected.name}
                  </h3>
                  <p className="text-sm md:text-base text-g-800 leading-relaxed mb-5">
                    {selected.description}
                  </p>

                  <div className="glass-subtle rounded-xl p-4 mb-5">
                    <p className="text-[10px] tracking-[0.3em] text-g-700 uppercase mb-1">Rate</p>
                    <p className="text-lg text-white font-medium">{selected.pricing}</p>
                  </div>

                  <p className="text-[10px] tracking-[0.3em] text-g-700 uppercase mb-3">Includes</p>
                  <ul className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                    {selected.details.map((d, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-g-900">
                        <Check className="w-4 h-4 text-white shrink-0 mt-0.5" strokeWidth={1.75} />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`mailto:difflad@gmail.com?subject=Service%20Inquiry%20-%20${encodeURIComponent(selected.name)}&body=Hi%20Sedo-Ta%2C%0A%0AI'm%20interested%20in%20your%20${encodeURIComponent(selected.name)}%20service.%0A%0AService%3A%20${encodeURIComponent(selected.name)}%0APricing%3A%20${encodeURIComponent(selected.pricing)}%0A%0APlease%20let%20me%20know%20the%20next%20steps!%0A%0AThank%20you!`}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass glass-hover text-white text-sm font-medium btn-press"
                  >
                    Request
                    <ArrowUpRight className="w-4 h-4" strokeWidth={1.75} />
                  </a>
                </motion.article>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-subtle rounded-3xl p-10 min-h-[280px] flex items-center justify-center text-center"
                >
                  <p className="text-sm text-g-700">
                    Select a service to view its spec.
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
