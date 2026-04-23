'use client';

import { motion } from 'framer-motion';
import { Cpu, Briefcase, Activity, Radio, Fingerprint } from 'lucide-react';
import { getGameSounds } from '@/lib/sounds';
import { useState } from 'react';

interface MainMenuProps {
  onMenuSelect: (menu: 'about' | 'projects' | 'services' | 'skills' | 'contact') => void;
}

type MenuItem = {
  id: 'about' | 'projects' | 'services' | 'skills' | 'contact';
  label: string;
  icon: typeof Cpu;
  subtitle: string;
  code: string;
  glow: string;
  border: string;
  text: string;
};

const menuItems: MenuItem[] = [
  {
    id: 'about',
    label: 'OPERATIVE',
    icon: Fingerprint,
    subtitle: 'Dossier // Bio-Scan',
    code: '0x01 · V_FILE',
    glow: 'shadow-neon-yellow',
    border: 'border-neon-yellow',
    text: 'text-neon-yellow',
  },
  {
    id: 'projects',
    label: 'GIGS.LOG',
    icon: Briefcase,
    subtitle: 'Completed Jobs',
    code: '0x02 · CONTRACTS',
    glow: 'shadow-neon-cyan',
    border: 'border-neon-cyan',
    text: 'text-neon-cyan',
  },
  {
    id: 'services',
    label: 'FIXER.NET',
    icon: Radio,
    subtitle: 'Available Services',
    code: '0x03 · MARKET',
    glow: 'shadow-neon-magenta',
    border: 'border-neon-magenta',
    text: 'text-neon-magenta',
  },
  {
    id: 'skills',
    label: 'CYBERWARE',
    icon: Activity,
    subtitle: 'Installed Skills',
    code: '0x04 · RIPPERDOC',
    glow: 'shadow-neon-yellow',
    border: 'border-neon-yellow',
    text: 'text-neon-yellow',
  },
  {
    id: 'contact',
    label: 'UPLINK',
    icon: Cpu,
    subtitle: 'Open Comms Channel',
    code: '0x05 · NETWATCH',
    glow: 'shadow-neon-cyan',
    border: 'border-neon-cyan',
    text: 'text-neon-cyan',
  },
];

export default function MainMenu({ onMenuSelect }: MainMenuProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleMenuSelect = (menu: MenuItem['id']) => {
    const sounds = getGameSounds();
    sounds.playSelect();
    setTimeout(() => onMenuSelect(menu), 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* HUD header */}
      <div className="w-full max-w-6xl relative z-10">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12 text-center"
        >
          <div className="inline-block cyber-panel cyber-panel-yellow cyber-corners px-6 md:px-10 py-4 md:py-5 mb-5">
            <p className="font-mono tracking-[0.4em] text-xs md:text-sm text-neon-cyan mb-1" style={{ textShadow: '0 0 6px #00f0ff' }}>
              // N I G H T   C I T Y   T E R M I N A L
            </p>
            <h1
              className="glitch font-cyber font-black text-3xl md:text-5xl tracking-widest"
              data-text="MAIN DECK"
            >
              MAIN DECK
            </h1>
          </div>

          <div className="flex items-center justify-center gap-3 font-hud tracking-widest text-xs text-cyber-ash">
            <span className="inline-block w-2 h-2 bg-neon-yellow animate-pulse" style={{ boxShadow: '0 0 6px #fcee0a' }} />
            <span>CONNECTION STABLE — SELECT A PROGRAM TO EXECUTE</span>
            <span className="inline-block w-2 h-2 bg-neon-yellow animate-pulse" style={{ boxShadow: '0 0 6px #fcee0a' }} />
          </div>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {menuItems.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const IconComponent = item.icon;

            return (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                onClick={() => handleMenuSelect(item.id)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="relative text-left group no-select"
              >
                {/* Outer glow */}
                <div
                  className="absolute -inset-0.5 opacity-30 group-hover:opacity-70 transition-opacity duration-300 blur-md"
                  style={{
                    background: `linear-gradient(135deg, ${
                      item.text.includes('yellow') ? '#fcee0a' :
                      item.text.includes('cyan') ? '#00f0ff' : '#ff003c'
                    }, transparent)`,
                  }}
                />

                {/* Card body */}
                <div
                  className={`relative cyber-clip bg-cyber-dark border-2 ${item.border} p-5 md:p-6 min-h-[260px] flex flex-col transition-all duration-300`}
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(18,18,31,0.95), rgba(5,5,10,0.9))',
                  }}
                >
                  {/* Scanline overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      background: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,240,255,0.2) 2px 3px)',
                    }}
                  />

                  {/* Corner accents */}
                  <div className={`absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 ${item.border}`} />
                  <div className={`absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 ${item.border}`} />
                  <div className={`absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 ${item.border}`} />
                  <div className={`absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 ${item.border}`} />

                  {/* Top header bar */}
                  <div className="relative flex items-center justify-between mb-5 pb-2 border-b border-neon-yellow/30">
                    <span className="font-mono text-[10px] md:text-xs tracking-widest text-cyber-ash">
                      {item.code}
                    </span>
                    <span className={`font-mono text-[10px] md:text-xs tracking-widest ${item.text}`}>
                      {String(index + 1).padStart(2, '0')}/05
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="relative flex items-start gap-4 mb-4">
                    <motion.div
                      animate={isHovered ? { rotate: [0, -5, 5, 0], scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
                      className={`relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border ${item.border} bg-cyber-void`}
                      style={{
                        clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                        boxShadow: isHovered
                          ? `0 0 20px currentColor, inset 0 0 20px rgba(255,255,255,0.05)`
                          : 'inset 0 0 10px rgba(0,0,0,0.5)',
                      }}
                    >
                      <IconComponent className={`w-9 h-9 md:w-11 md:h-11 ${item.text}`} strokeWidth={1.5} />
                    </motion.div>

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-cyber font-black text-xl md:text-2xl tracking-widest ${item.text}`}
                        style={{ textShadow: '0 0 6px currentColor' }}
                      >
                        {item.label}
                      </h3>
                      <p className="font-hud tracking-wider text-sm md:text-base text-cyber-ash mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Bottom execute line */}
                  <div className="relative mt-auto pt-3 border-t border-cyber-steel flex items-center justify-between">
                    <motion.span
                      className={`font-mono text-xs md:text-sm tracking-widest ${item.text}`}
                      animate={isHovered ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.6 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {isHovered ? '>> EXECUTING...' : '>> EXECUTE'}
                    </motion.span>
                    <span className={`font-mono text-xs ${item.text}`}>▶▶</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Bottom HUD */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 md:mt-12 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] md:text-xs tracking-widest text-cyber-ash/80"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-neon-yellow animate-pulse" style={{ boxShadow: '0 0 6px #fcee0a' }} />
            <span>SYSTEM: ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-neon-cyan animate-pulse" style={{ boxShadow: '0 0 6px #00f0ff' }} />
            <span>PING: 02MS · NETWATCH BYPASSED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-neon-magenta animate-pulse" style={{ boxShadow: '0 0 6px #ff003c' }} />
            <span>RELIC INTEGRITY: 97%</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
