'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Service } from '@/lib/projects';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface ServicesMenuProps {
  services: Service[];
}

const getServiceGradient = (index: number) => {
  const gradients = [
    'from-blue-500 via-indigo-500 to-purple-500',
    'from-green-500 via-emerald-500 to-teal-500',
    'from-pink-500 via-rose-500 to-red-500',
    'from-yellow-500 via-orange-500 to-amber-500',
    'from-purple-500 via-fuchsia-500 to-pink-500',
  ];
  return gradients[index % gradients.length];
};

export default function ServicesMenu({ services }: ServicesMenuProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      {/* Title */}
      <div className="relative mb-12">
        <div className="bg-gradient-to-r from-pixel-yellow via-pixel-orange to-pixel-red border-4 border-pixel-white p-6 md:p-8 shadow-pixel-lg">
          <div className="absolute inset-2 border-2 border-pixel-yellow"></div>
          <h2 className="relative font-game text-3xl md:text-5xl text-pixel-black text-center leading-relaxed">
            POWER-UPS AVAILABLE
          </h2>
          <p className="font-pixel text-lg md:text-xl text-pixel-black text-center mt-2">
            Choose your upgrade and level up your project!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Services Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon as LucideIcon;
            const isSelected = selectedService?.id === service.id;
            const gradient = getServiceGradient(index);

            return (
              <motion.div
                key={service.id}
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: 'spring', duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedService(service)}
                className="relative cursor-pointer no-select"
              >
                {/* Glow effect on hover or selected */}
                {isSelected && (
                  <motion.div
                    className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-lg blur-lg opacity-75`}
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <div className={`
                  relative bg-pixel-black border-4
                  ${isSelected ? 'border-pixel-yellow' : 'border-pixel-white'}
                  shadow-pixel-lg
                  transition-all duration-200
                `}>
                {/* Selected badge */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      className="absolute -top-4 -right-4 z-10"
                    >
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-12 h-12 bg-gradient-to-br from-pixel-yellow to-pixel-orange border-3 border-pixel-white rounded-full flex items-center justify-center shadow-pixel"
                      >
                        <span className="text-pixel-black text-2xl">★</span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Level indicator */}
                <div className="absolute top-2 left-2 bg-pixel-black border-2 border-pixel-white px-2 py-1 z-10">
                  <span className="font-game text-xs text-pixel-yellow">LV.{index + 1}</span>
                </div>

                {/* Inner border */}
                <div className={`absolute inset-2 border-2 ${isSelected ? 'border-pixel-yellow' : 'border-pixel-gray'} pointer-events-none`}></div>

                {/* Content */}
                <div className={`relative bg-gradient-to-br ${gradient} p-6`}>
                  {/* Icon */}
                  <div className="mb-4 flex justify-center">
                    <motion.div
                      animate={isSelected ? {
                        y: [0, -10, 0],
                        scale: [1, 1.1, 1]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`
                        relative w-20 h-20
                        ${isSelected ? 'bg-pixel-yellow' : 'bg-pixel-white'}
                        border-4 border-pixel-black shadow-pixel
                        flex items-center justify-center
                      `}>
                      <div className="absolute -top-1 -left-1 w-2 h-2 bg-pixel-black"></div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-pixel-black"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pixel-black"></div>
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-pixel-black"></div>

                      <IconComponent
                        className={`w-12 h-12 ${isSelected ? 'text-pixel-black' : 'text-pixel-purple'}`}
                        strokeWidth={2.5}
                      />
                    </motion.div>
                  </div>

                  {/* Service name */}
                  <h3 className="font-game text-base md:text-lg lg:text-xl text-pixel-white text-outline text-center leading-relaxed mb-3">
                    {service.name}
                  </h3>

                  {/* Description preview */}
                  <p className="font-pixel text-xs md:text-sm text-pixel-white/90 text-center mb-3 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Pricing badge */}
                  <div className="bg-pixel-black border-3 border-pixel-yellow p-2 md:p-3 shadow-pixel-sm">
                    <p className="font-game text-sm md:text-base lg:text-lg text-pixel-yellow text-center">
                      {service.pricing}
                    </p>
                  </div>

                  {/* Select prompt */}
                  <motion.div
                    className="mt-3 text-center"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="font-pixel text-xs md:text-sm text-pixel-white">
                      {isSelected ? 'SELECTED' : 'Click to select'}
                    </span>
                  </motion.div>
                </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Service Details Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <AnimatePresence mode="wait">
              {selectedService ? (
                <motion.div
                  key={selectedService.id}
                  initial={{ opacity: 0, scale: 0.9, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 50 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="bg-pixel-black border-4 border-pixel-yellow shadow-pixel-lg"
                >
                  <div className="absolute inset-2 border-2 border-pixel-orange pointer-events-none"></div>

                  <div className="relative bg-gradient-to-b from-pixel-purple via-pixel-blue to-pixel-indigo p-6">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-pixel-yellow to-pixel-orange border-3 border-pixel-white p-3 md:p-4 shadow-pixel mb-4">
                    <h3 className="font-game text-lg md:text-xl text-pixel-black text-center leading-relaxed">
                      {selectedService.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="bg-pixel-black/50 border-2 border-pixel-cyan p-3 md:p-4 mb-4">
                    <p className="font-pixel text-base md:text-lg text-pixel-white">
                      {selectedService.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="bg-gradient-to-r from-pixel-green to-pixel-lime border-3 border-pixel-black p-3 md:p-4 mb-4">
                    <p className="font-game text-xl md:text-2xl text-pixel-black text-center">
                      {selectedService.pricing}
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="space-y-3">
                    <div className="bg-pixel-yellow border-2 border-pixel-black p-2">
                      <h4 className="font-game text-xs md:text-sm text-pixel-black text-center">
                        POWER-UP INCLUDES:
                      </h4>
                    </div>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                      {selectedService.details.map((detail, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: -30, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.05, type: 'spring' }}
                          className="bg-pixel-black/60 border-2 border-pixel-gray hover:border-pixel-lime p-2 md:p-3 transition-colors"
                        >
                          <div className="flex items-start gap-2">
                            <motion.span
                              className="text-pixel-lime text-base md:text-lg flex-shrink-0 font-bold"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ delay: i * 0.05, duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                            >
                              +
                            </motion.span>
                            <span className="font-pixel text-sm md:text-base text-pixel-white">
                              {detail}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6">
                    <a
                      href={`mailto:difflad@gmail.com?subject=Service%20Inquiry%20-%20${encodeURIComponent(selectedService.name)}&body=Hi%20Sedo-Ta%2C%0A%0AI'm%20interested%20in%20your%20${encodeURIComponent(selectedService.name)}%20service.%0A%0AService%3A%20${encodeURIComponent(selectedService.name)}%0APricing%3A%20${encodeURIComponent(selectedService.pricing)}%0A%0APlease%20let%20me%20know%20the%20next%20steps!%0A%0AThank%20you!`}
                      className="block bg-gradient-to-r from-pixel-pink via-pixel-red to-pixel-orange border-4 border-pixel-white p-3 md:p-4 shadow-pixel-lg text-center hover:scale-105 transition-transform"
                    >
                      <p className="font-game text-sm md:text-base text-pixel-white text-outline leading-relaxed">
                        READY TO LEVEL UP?
                      </p>
                      <p className="font-pixel text-xs md:text-sm text-pixel-yellow mt-2">
                        Click to contact me!
                      </p>
                    </a>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-pixel-black border-4 border-pixel-white shadow-pixel-lg"
              >
                <div className="absolute inset-2 border-2 border-pixel-gray pointer-events-none"></div>

                <div className="relative bg-gradient-to-b from-game-panel to-pixel-blue p-8 min-h-[500px] flex flex-col items-center justify-center text-center">
                  <motion.div
                    animate={{
                      y: [0, -15, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="mb-6"
                  >
                    <div className="relative w-24 h-24 bg-gradient-to-br from-pixel-yellow to-pixel-orange border-4 border-pixel-white flex items-center justify-center">
                      <span className="text-6xl">✨</span>
                    </div>
                  </motion.div>

                  <motion.p
                    className="font-game text-lg md:text-xl text-pixel-yellow mb-2 leading-relaxed"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    SELECT A POWER-UP
                  </motion.p>
                  <p className="font-pixel text-base md:text-lg text-pixel-light">
                    Choose a service to view<br />full details and features
                  </p>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
