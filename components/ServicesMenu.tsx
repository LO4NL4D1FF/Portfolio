'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Service } from '@/lib/projects';
import { LucideIcon, ArrowUpRight, Check } from 'lucide-react';
import { useState } from 'react';

interface Props {
  services: Service[];
}

export default function ServicesMenu({ services }: Props) {
  const [selected, setSelected] = useState<Service | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-6 pb-20 space-y-4">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="lg rounded-4xl p-6 md:p-8"
      >
        <div className="relative z-10">
          <p className="eyebrow mb-2">Offerings</p>
          <h1 className="headline font-bold text-3xl md:text-4xl text-fg">Services.</h1>
          <p className="mt-2 text-sm md:text-base text-muted">
            Pick an engagement to see what&apos;s included.
          </p>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
          {services.map((service, i) => {
            const Icon = service.icon as LucideIcon;
            const isActive = selected?.id === service.id;
            return (
              <motion.button
                key={service.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelected(service)}
                className={`group rounded-3xl p-4 text-left flex items-start gap-3 ${
                  isActive ? 'lg-strong' : 'lg lg-hover'
                }`}
              >
                <div className="lg-sm w-11 h-11 rounded-2xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-fg relative z-10" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0 relative z-10">
                  <h3 className="font-semibold text-sm text-fg leading-tight">
                    {service.name}
                  </h3>
                  <p className="text-xs text-muted mt-0.5 line-clamp-2 leading-snug">
                    {service.description}
                  </p>
                  <p className="eyebrow mt-2">{service.pricing}</p>
                </div>
                <ArrowUpRight
                  className={`w-4 h-4 shrink-0 relative z-10 ${
                    isActive ? 'text-fg' : 'text-muted group-hover:text-fg'
                  }`}
                  strokeWidth={2}
                />
              </motion.button>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.article
                  key={selected.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.22 }}
                  className="lg-strong rounded-4xl p-6"
                >
                  <div className="relative z-10">
                    <p className="eyebrow mb-1">Included</p>
                    <h3 className="font-semibold text-xl text-fg mb-2">
                      {selected.name}
                    </h3>
                    <p className="text-sm text-muted leading-snug mb-4">
                      {selected.description}
                    </p>

                    <div className="lg-sm rounded-2xl p-3 mb-4 relative z-10">
                      <p className="eyebrow">Rate</p>
                      <p className="text-base text-fg font-semibold mt-0.5 relative z-10">
                        {selected.pricing}
                      </p>
                    </div>

                    <ul className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                      {selected.details.map((d, i) => (
                        <li key={i} className="flex gap-2 text-sm text-fg leading-snug">
                          <Check className="w-4 h-4 text-fg shrink-0 mt-0.5" strokeWidth={2.25} />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href={`mailto:difflad@gmail.com?subject=Service%20Inquiry%20-%20${encodeURIComponent(selected.name)}&body=Hi%20Sedo-Ta%2C%0A%0AI'm%20interested%20in%20your%20${encodeURIComponent(selected.name)}%20service.%0A%0AService%3A%20${encodeURIComponent(selected.name)}%0APricing%3A%20${encodeURIComponent(selected.pricing)}%0A%0APlease%20let%20me%20know%20the%20next%20steps!%0A%0AThank%20you!`}
                      className="btn-press btn-dark mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
                    >
                      Request
                      <ArrowUpRight className="w-4 h-4" strokeWidth={2.25} />
                    </a>
                  </div>
                </motion.article>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="lg rounded-4xl p-8 text-center"
                >
                  <p className="text-sm text-muted relative z-10">
                    Tap a service to see its spec.
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
