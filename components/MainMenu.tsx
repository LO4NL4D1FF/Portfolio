'use client';

import { motion } from 'framer-motion';
import { Gamepad2, Briefcase, TrendingUp, Mail, User, Sparkles, Zap, Star } from 'lucide-react';
import { getGameSounds } from '@/lib/sounds';
import { useState } from 'react';

interface MainMenuProps {
  onMenuSelect: (menu: 'about' | 'projects' | 'services' | 'skills' | 'contact') => void;
}

const getMenuGradient = (index: number) => {
  const gradients = [
    'from-purple-500 via-pink-500 to-rose-500',
    'from-cyan-500 via-blue-500 to-indigo-500',
    'from-emerald-500 via-green-500 to-teal-500',
    'from-orange-500 via-amber-500 to-yellow-500',
    'from-fuchsia-500 via-purple-500 to-violet-500',
  ];
  return gradients[index % gradients.length];
};


export default function MainMenu({ onMenuSelect }: MainMenuProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const menuItems = [
    { id: 'about' as const, label: 'ABOUT ME', icon: User, subtitle: 'My Story' },
    { id: 'projects' as const, label: 'PROJECTS', icon: Gamepad2, subtitle: 'View Portfolio' },
    { id: 'services' as const, label: 'SERVICES', icon: Briefcase, subtitle: 'What I Offer' },
    { id: 'skills' as const, label: 'SKILLS', icon: TrendingUp, subtitle: 'Tech Stack' },
    { id: 'contact' as const, label: 'CONTACT', icon: Mail, subtitle: 'Get In Touch' },
  ];

  const handleMenuSelect = (menu: 'about' | 'projects' | 'services' | 'skills' | 'contact') => {
    const sounds = getGameSounds();
    sounds.playSelect();
    setTimeout(() => onMenuSelect(menu), 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 right-20 text-pixel-yellow opacity-20"
        animate={{
          y: [0, -30, 0],
          rotate: [0, 15, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Star className="w-16 h-16" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-20 text-pixel-cyan opacity-20"
        animate={{
          y: [0, 30, 0],
          rotate: [0, -15, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      >
        <Sparkles className="w-16 h-16" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-10 text-pixel-pink opacity-20"
        animate={{
          x: [0, 20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      >
        <Zap className="w-12 h-12" />
      </motion.div>

      <div className="w-full max-w-5xl relative z-10">
        {/* Enhanced Logo/Title */}
        <motion.div
          initial={{ y: -50, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 1 }}
          className="mb-16 text-center"
        >
          <div className="relative inline-block">
            {/* Animated glow effect */}
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-pixel-yellow via-pixel-orange to-pixel-red blur-lg opacity-75"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="relative bg-gradient-to-r from-pixel-cyan via-pixel-indigo to-pixel-purple border-4 border-pixel-white p-8 shadow-pixel-lg">
              <div className="absolute inset-2 border-2 border-pixel-yellow pointer-events-none"></div>

              <motion.h1
                className="relative font-game text-4xl md:text-6xl text-pixel-yellow text-outline leading-relaxed"
                animate={{
                  textShadow: [
                    '3px 3px 0px rgba(0,0,0,0.8)',
                    '4px 4px 0px rgba(0,0,0,0.8)',
                    '3px 3px 0px rgba(0,0,0,0.8)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                PLAYER SELECT
              </motion.h1>
            </div>
          </div>

          <motion.p
            className="font-pixel text-xl md:text-2xl lg:text-3xl text-pixel-white mt-6"
            animate={{
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Choose your adventure!
          </motion.p>

          {/* Animated arrows */}
          <motion.div
            className="flex justify-center gap-4 mt-4"
            animate={{
              y: [0, -5, 0]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="text-pixel-yellow text-2xl"
                animate={{
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              >
                ▼
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Enhanced Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => {
            const gradient = getMenuGradient(index);
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={item.id}
                initial={{ scale: 0, rotateY: -90, opacity: 0 }}
                animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                className="relative"
              >
                {/* Enhanced glow effect */}
                {isHovered && (
                  <motion.div
                    className={`absolute -inset-1 bg-gradient-to-r ${gradient} blur-lg opacity-75 rounded-lg`}
                    animate={{
                      opacity: [0.5, 0.9, 0.5],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                {/* Menu Button */}
                <div
                  onClick={() => handleMenuSelect(item.id)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative cursor-pointer group"
                >
                  <div className={`
                    bg-pixel-black border-4
                    ${isHovered ? 'border-pixel-yellow' : 'border-pixel-white'}
                    shadow-pixel-lg
                    transition-all duration-300
                  `}>
                    {/* Level badge */}
                    <div className="absolute -top-3 -left-3 bg-gradient-to-br from-pixel-yellow to-pixel-orange border-3 border-pixel-white px-3 py-1 shadow-pixel z-10">
                      <span className="font-game text-xs text-pixel-black">LV.{index + 1}</span>
                    </div>

                    {/* Star indicator on hover */}
                    {isHovered && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-3 -right-3 z-10"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          className="w-10 h-10 bg-gradient-to-br from-pixel-pink to-pixel-red border-2 border-pixel-white rounded-full flex items-center justify-center shadow-pixel"
                        >
                          <Star className="w-5 h-5 text-pixel-white fill-pixel-white" />
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Inner border */}
                    <div className={`absolute inset-2 border-2 ${isHovered ? 'border-pixel-yellow' : 'border-pixel-gray'} transition-colors pointer-events-none`}></div>

                    <motion.div
                      className={`relative p-6 flex flex-col items-center justify-center bg-gradient-to-br ${gradient} min-h-[280px]`}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {/* Icon with enhanced animation */}
                      <motion.div
                        animate={{
                          y: isHovered ? [0, -15, 0] : [0, -8, 0],
                          rotate: isHovered ? [0, 5, -5, 0] : [0, 0, 0, 0]
                        }}
                        transition={{
                          duration: isHovered ? 1 : 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="mb-6"
                      >
                        <div className={`
                          relative w-24 h-24
                          ${isHovered ? 'bg-pixel-white' : 'bg-pixel-yellow'}
                          border-4 border-pixel-black shadow-pixel
                          flex items-center justify-center
                          transition-all duration-300
                          ${isHovered ? 'rotate-12 scale-110' : ''}
                        `}>
                          {/* Pixel corners */}
                          <div className="absolute -top-1 -left-1 w-2 h-2 bg-pixel-black"></div>
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-pixel-black"></div>
                          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pixel-black"></div>
                          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-pixel-black"></div>

                          {(() => {
                            const IconComponent = item.icon;
                            return <IconComponent className="w-14 h-14 text-pixel-black" strokeWidth={2.5} />;
                          })()}
                        </div>
                      </motion.div>

                      {/* Label */}
                      <h3 className="font-game text-lg md:text-xl lg:text-2xl text-pixel-white text-outline text-center mb-2 leading-relaxed">
                        {item.label}
                      </h3>

                      {/* Subtitle */}
                      <p className="font-pixel text-sm md:text-base text-pixel-white/80 text-center mb-4">
                        {item.subtitle}
                      </p>

                      {/* Select indicator */}
                      <motion.div
                        className="font-pixel text-xs md:text-sm text-pixel-yellow text-center"
                        animate={{
                          opacity: isHovered ? [0.7, 1, 0.7] : 0.6
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {isHovered ? '★ Click to enter ★' : 'Hover to preview ▶'}
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced Bottom info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-pixel-purple to-pixel-indigo border-4 border-pixel-white px-6 md:px-8 py-3 md:py-4 shadow-pixel-lg">
            <div className="absolute inset-2 border-2 border-pixel-cyan pointer-events-none"></div>
            <motion.p
              className="relative font-pixel text-sm md:text-base lg:text-lg text-pixel-white"
              animate={{
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Progress saved • Pixel-perfect UI • Blazing fast
            </motion.p>
          </div>

          {/* Additional decorative elements */}
          <div className="flex justify-center gap-6 mt-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-pixel-yellow"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
