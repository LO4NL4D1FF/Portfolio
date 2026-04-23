'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Service } from '@/lib/projects';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface ServicesMenuProps {
  services: Service[];
}

const THEMES = [
  { border: 'border-neon-yellow', text: 'text-neon-yellow', accent: '#fcee0a', label: 'TIER.α' },
  { border: 'border-neon-cyan', text: 'text-neon-cyan', accent: '#00f0ff', label: 'TIER.β' },
  { border: 'border-neon-pink', text: 'text-neon-pink', accent: '#ff00aa', label: 'TIER.γ' },
  { border: 'border-neon-green', text: 'text-neon-green', accent: '#39ff14', label: 'TIER.δ' },
  { border: 'border-neon-magenta', text: 'text-neon-magenta', accent: '#ff003c', label: 'TIER.ε' },
];

export default function ServicesMenu({ services }: ServicesMenuProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      {/* Title */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="cyber-panel cyber-panel-yellow cyber-corners p-5 md:p-6 mb-8 text-center"
      >
        <p className="font-mono tracking-[0.4em] text-xs text-neon-cyan mb-2" style={{ textShadow: '0 0 6px #00f0ff' }}>
          /// FIXER.NET · OPEN MARKET ///
        </p>
        <h2 className="glitch font-cyber font-black text-3xl md:text-5xl tracking-widest" data-text="AVAILABLE GIGS">
          AVAILABLE GIGS
        </h2>
        <p className="font-hud tracking-widest text-sm md:text-base text-cyber-ash mt-3">
          Select a contract to review its full spec sheet
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Services grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((service, index) => {
            const IconComponent = service.icon as LucideIcon;
            const isSelected = selectedService?.id === service.id;
            const theme = THEMES[index % THEMES.length];

            return (
              <motion.button
                key={service.id}
                type="button"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedService(service)}
                className="relative text-left no-select group"
              >
                <div
                  className={`absolute -inset-0.5 opacity-40 group-hover:opacity-90 blur-md transition-opacity ${isSelected ? 'opacity-100 animate-pulse' : ''}`}
                  style={{ background: `linear-gradient(135deg, ${theme.accent}, transparent 70%)` }}
                />

                <div
                  className={`relative cyber-clip bg-cyber-dark border-2 ${theme.border} p-5 h-full`}
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(18,18,31,0.95), rgba(5,5,10,0.95))',
                    boxShadow: isSelected ? `0 0 24px ${theme.accent}99, inset 0 0 16px ${theme.accent}33` : 'inset 0 0 10px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Scanline */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-15"
                    style={{ background: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,240,255,0.25) 2px 3px)' }}
                  />

                  {/* Top bar */}
                  <div className="relative flex items-center justify-between mb-4 pb-2 border-b border-cyber-chrome">
                    <span className="font-mono text-[10px] md:text-xs tracking-widest text-cyber-ash">
                      CONTRACT #{String(index + 1).padStart(2, '0')}
                    </span>
                    <span className={`font-mono text-[10px] md:text-xs tracking-widest px-2 py-0.5 border ${theme.border} ${theme.text}`}>
                      {theme.label}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="relative flex items-center gap-4 mb-4">
                    <motion.div
                      className={`w-16 h-16 border-2 ${theme.border} bg-cyber-void flex items-center justify-center`}
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                        boxShadow: isSelected ? `0 0 16px ${theme.accent}` : 'none',
                      }}
                      animate={isSelected ? { rotate: [0, -4, 4, 0] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <IconComponent className={`w-9 h-9 ${theme.text}`} strokeWidth={1.5} />
                    </motion.div>

                    <h3
                      className={`flex-1 font-cyber font-black text-base md:text-lg tracking-widest ${theme.text}`}
                      style={{ textShadow: '0 0 6px currentColor' }}
                    >
                      {service.name}
                    </h3>
                  </div>

                  {/* Preview */}
                  <p className="relative font-hud text-sm text-cyber-bone/90 line-clamp-2 mb-4">
                    {service.description}
                  </p>

                  {/* Pricing */}
                  <div className="relative bg-cyber-void/70 border-l-2 border-neon-yellow px-3 py-2 mb-3">
                    <p className={`font-cyber font-bold text-sm md:text-base tracking-widest text-neon-yellow`} style={{ textShadow: '0 0 6px #fcee0a' }}>
                      &gt; {service.pricing}
                    </p>
                  </div>

                  {/* CTA */}
                  <motion.div
                    className={`relative flex items-center justify-between font-mono text-xs tracking-widest ${theme.text}`}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span>{isSelected ? '>> LOADED' : '>> LOAD DETAILS'}</span>
                    <span>▶▶</span>
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-28">
            <AnimatePresence mode="wait">
              {selectedService ? (
                <motion.div
                  key={selectedService.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  className="cyber-panel cyber-panel-yellow cyber-clip p-5 md:p-6 relative"
                >
                  <div
                    className="absolute inset-0 pointer-events-none opacity-15"
                    style={{ background: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,240,255,0.3) 2px 3px)' }}
                  />

                  <div className="relative flex items-center justify-between pb-3 mb-4 border-b border-neon-yellow/40">
                    <span className="font-mono text-xs tracking-widest text-neon-cyan">/// SPEC SHEET</span>
                    <span className="font-mono text-xs tracking-widest text-neon-magenta">● LIVE</span>
                  </div>

                  <h3 className="relative font-cyber font-black text-xl md:text-2xl tracking-widest text-neon-yellow mb-3" style={{ textShadow: '0 0 8px #fcee0a' }}>
                    {selectedService.name}
                  </h3>

                  <p className="relative font-hud text-sm md:text-base text-cyber-bone leading-relaxed mb-4">
                    {selectedService.description}
                  </p>

                  <div className="relative bg-cyber-void/80 border-l-4 border-neon-green px-3 py-3 mb-4">
                    <p className="font-cyber font-black text-lg md:text-xl text-neon-green" style={{ textShadow: '0 0 6px #39ff14' }}>
                      EDDIE RATE · {selectedService.pricing}
                    </p>
                  </div>

                  <h4 className="relative font-mono text-xs tracking-widest text-neon-cyan mb-2">
                    [ CONTRACT INCLUDES ]
                  </h4>

                  <div className="relative space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar pr-2 mb-4">
                    {selectedService.details.map((detail, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex gap-2 bg-cyber-void/60 border-l border-neon-cyan/50 px-3 py-2"
                      >
                        <span className="font-mono text-neon-yellow flex-shrink-0">+</span>
                        <span className="font-hud text-sm text-cyber-bone">{detail}</span>
                      </motion.div>
                    ))}
                  </div>

                  <a
                    href={`mailto:difflad@gmail.com?subject=Service%20Inquiry%20-%20${encodeURIComponent(selectedService.name)}&body=Hi%20Sedo-Ta%2C%0A%0AI'm%20interested%20in%20your%20${encodeURIComponent(selectedService.name)}%20service.%0A%0AService%3A%20${encodeURIComponent(selectedService.name)}%0APricing%3A%20${encodeURIComponent(selectedService.pricing)}%0A%0APlease%20let%20me%20know%20the%20next%20steps!%0A%0AThank%20you!`}
                    className="relative block"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-yellow via-neon-magenta to-neon-cyan opacity-60 blur" />
                    <div
                      className="relative bg-cyber-void border-2 border-neon-yellow px-4 py-3 text-center btn-press"
                      style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
                    >
                      <p className="font-cyber font-black tracking-widest text-neon-yellow" style={{ textShadow: '0 0 6px #fcee0a' }}>
                        &gt;&gt; ACCEPT CONTRACT
                      </p>
                      <p className="font-mono text-[10px] tracking-widest text-cyber-ash mt-1">
                        Opens secure uplink
                      </p>
                    </div>
                  </a>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="cyber-panel cyber-panel-cyan cyber-clip p-8 min-h-[400px] flex flex-col items-center justify-center text-center"
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="w-20 h-20 border-2 border-neon-cyan flex items-center justify-center mb-4"
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                      boxShadow: '0 0 18px #00f0ff',
                    }}
                  >
                    <span className="font-cyber font-black text-3xl text-neon-cyan" style={{ textShadow: '0 0 8px #00f0ff' }}>?</span>
                  </motion.div>
                  <p className="font-cyber font-bold text-base md:text-lg tracking-widest text-neon-cyan" style={{ textShadow: '0 0 6px #00f0ff' }}>
                    STANDBY FOR BRIEFING
                  </p>
                  <p className="font-hud text-sm tracking-widest text-cyber-ash mt-2">
                    Select a contract from the list
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
