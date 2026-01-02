'use client';

import { motion } from 'framer-motion';
import { Service } from '@/lib/projects';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface ServicesMenuProps {
  services: Service[];
}

export default function ServicesMenu({ services }: ServicesMenuProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
      {/* Title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-pixel-black border-4 border-pixel-white p-4 md:p-6 shadow-pixel mb-8"
      >
        <h2 className="font-game text-2xl md:text-4xl text-pixel-yellow text-center text-outline leading-relaxed">
          SELECT YOUR SERVICE
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services Grid - Character Select Style */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((service, index) => {
            const IconComponent = service.icon as LucideIcon;
            const isSelected = selectedService?.id === service.id;

            return (
              <motion.div
                key={service.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedService(service)}
                className={`
                  relative cursor-pointer no-select
                  bg-pixel-black border-4
                  ${isSelected ? 'border-pixel-yellow' : 'border-pixel-white'}
                  shadow-pixel hover:shadow-pixel-lg
                  transition-all duration-200
                `}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-3 -right-3 z-10"
                  >
                    <div className="w-8 h-8 bg-pixel-yellow border-2 border-pixel-black rotate-45 flex items-center justify-center">
                      <span className="font-game text-xs text-pixel-black -rotate-45">✓</span>
                    </div>
                  </motion.div>
                )}

                {/* Inner border */}
                <div className={`absolute inset-2 border-2 ${isSelected ? 'border-pixel-yellow' : 'border-pixel-gray'} pointer-events-none`}></div>

                {/* Content */}
                <div className="relative bg-gradient-to-br from-pixel-purple to-pixel-blue p-4 flex flex-col items-center justify-center aspect-square">
                  {/* Icon */}
                  <motion.div
                    animate={isSelected ? { y: [0, -5, 0] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="mb-3"
                  >
                    <div className={`w-16 h-16 ${isSelected ? 'bg-pixel-yellow' : 'bg-pixel-white'} border-4 border-pixel-black shadow-pixel-sm flex items-center justify-center`}>
                      <IconComponent className={`w-10 h-10 ${isSelected ? 'text-pixel-black' : 'text-pixel-purple'}`} strokeWidth={2.5} />
                    </div>
                  </motion.div>

                  {/* Name */}
                  <h3 className="font-game text-xs md:text-sm text-pixel-white text-outline text-center leading-relaxed">
                    {service.name}
                  </h3>

                  {/* Pricing */}
                  <p className="mt-2 font-pixel text-sm text-pixel-yellow text-center">
                    {service.pricing}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Service Details Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 bg-pixel-black border-4 border-pixel-white shadow-pixel-lg">
            <div className="absolute inset-2 border-2 border-pixel-gray"></div>

            <div className="relative bg-gradient-to-b from-game-panel to-pixel-blue p-6 min-h-[400px]">
              {selectedService ? (
                <motion.div
                  key={selectedService.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* Service name */}
                  <div className="bg-pixel-yellow border-2 border-pixel-black p-3 shadow-pixel-sm">
                    <h3 className="font-game text-lg text-pixel-black text-center leading-relaxed">
                      {selectedService.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="font-pixel text-lg text-pixel-white">
                    {selectedService.description}
                  </p>

                  {/* Pricing */}
                  <div className="bg-pixel-green border-2 border-pixel-black p-3">
                    <p className="font-game text-xl text-pixel-black text-center">
                      {selectedService.pricing}
                    </p>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <h4 className="font-game text-sm text-pixel-yellow">INCLUDES:</h4>
                    <ul className="space-y-2">
                      {selectedService.details.map((detail, i) => (
                        <motion.li
                          key={i}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="font-pixel text-base text-pixel-white flex items-start"
                        >
                          <span className="text-pixel-green mr-2">▶</span>
                          {detail}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="pt-4"
                  >
                    <div className="bg-gradient-to-r from-pixel-pink to-pixel-red border-4 border-pixel-white p-3 shadow-pixel text-center">
                      <p className="font-game text-sm text-pixel-white text-outline">
                        READY TO START?
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-20 h-20 bg-pixel-gray border-4 border-pixel-white mb-4"></div>
                  </motion.div>
                  <p className="font-pixel text-xl text-pixel-light">
                    Select a service to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
