'use client';

import { motion } from 'framer-motion';
import PixelButton from './PixelButton';
import { Gamepad2, Briefcase, TrendingUp, Mail, User } from 'lucide-react';
import { getGameSounds } from '@/lib/sounds';

interface MainMenuProps {
  onMenuSelect: (menu: 'about' | 'projects' | 'services' | 'skills' | 'contact') => void;
}

export default function MainMenu({ onMenuSelect }: MainMenuProps) {
  const menuItems = [
    { id: 'about' as const, label: 'ABOUT ME', icon: User, color: 'primary' as const },
    { id: 'projects' as const, label: 'PROJECTS', icon: Gamepad2, color: 'success' as const },
    { id: 'services' as const, label: 'SERVICES', icon: Briefcase, color: 'secondary' as const },
    { id: 'skills' as const, label: 'SKILLS', icon: TrendingUp, color: 'danger' as const },
    { id: 'contact' as const, label: 'CONTACT', icon: Mail, color: 'primary' as const },
  ];

  const handleMenuSelect = (menu: 'about' | 'projects' | 'services' | 'skills' | 'contact') => {
    const sounds = getGameSounds();
    sounds.playSelect();
    setTimeout(() => onMenuSelect(menu), 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Logo/Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-12 text-center"
        >
          <div className="inline-block bg-pixel-black border-4 border-pixel-white p-6 shadow-pixel-lg mb-4">
            <h1 className="font-game text-3xl md:text-5xl text-pixel-yellow text-outline leading-relaxed">
              MAIN MENU
            </h1>
          </div>
          <p className="font-pixel text-xl md:text-2xl text-pixel-cyan">
            Choose your path, adventurer!
          </p>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ scale: 0, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{
                delay: index * 0.15,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
              className="relative"
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 blur-xl opacity-50"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
                style={{
                  background:
                    item.color === 'primary'
                      ? '#41a6f6'
                      : item.color === 'success'
                      ? '#a7f070'
                      : item.color === 'secondary'
                      ? '#9badb7'
                      : '#ff77a8',
                }}
              />

              {/* Menu Button */}
              <div
                onClick={() => handleMenuSelect(item.id)}
                className="relative cursor-pointer group"
              >
                <div className="bg-pixel-black border-4 border-pixel-white shadow-pixel hover:shadow-pixel-lg transition-shadow duration-200">
                  <div className="absolute inset-2 border-2 border-pixel-gray group-hover:border-pixel-yellow transition-colors"></div>

                  <motion.div
                    className="relative p-8 flex flex-col items-center justify-center bg-gradient-to-br from-game-panel to-pixel-blue"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Icon */}
                    <motion.div
                      animate={{
                        y: [0, -8, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: index * 0.2,
                      }}
                      className="mb-6"
                    >
                      <div className="w-24 h-24 bg-pixel-yellow border-4 border-pixel-orange shadow-pixel flex items-center justify-center">
                        <item.icon className="w-16 h-16 text-pixel-black" strokeWidth={2.5} />
                      </div>
                    </motion.div>

                    {/* Label */}
                    <h3 className="font-game text-2xl md:text-3xl text-pixel-white text-outline text-center mb-4 leading-relaxed">
                      {item.label}
                    </h3>

                    {/* Select indicator */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="font-pixel text-lg text-pixel-yellow"
                    >
                      Press to select ▶
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-pixel-black/80 border-2 border-pixel-white px-6 py-3">
            <p className="font-pixel text-lg text-pixel-light">
              💾 Auto-save enabled | 🎮 Mobile-optimized
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
