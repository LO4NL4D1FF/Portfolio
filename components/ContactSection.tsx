'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Facebook, MessageCircle } from 'lucide-react';
import PixelButton from './PixelButton';

export default function ContactSection() {
  const socialLinks = [
    { icon: Mail, label: 'EMAIL', value: 'difflad@gmail.com', href: 'mailto:difflad@gmail.com', color: 'pixel-red' },
    { icon: Github, label: 'GITHUB', value: 'LO4NL4D1FF', href: 'https://github.com/LO4NL4D1FF', color: 'pixel-purple' },
    { icon: Facebook, label: 'FACEBOOK', value: 'Loan Ladiff', href: 'https://www.facebook.com/Anonn.005/', color: 'pixel-indigo' },
    { icon: MessageCircle, label: 'WHATSAPP', value: '+231 555 666 157', href: 'https://wa.me/231555666157', color: 'pixel-green' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-pixel-black border-4 border-pixel-white p-6 shadow-pixel-lg mb-12"
        >
          <h2 className="font-game text-3xl md:text-5xl text-pixel-yellow text-center text-outline leading-relaxed">
            GET IN TOUCH
          </h2>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-game-panel to-pixel-blue border-4 border-pixel-white p-8 shadow-pixel mb-8"
        >
          <div className="border-2 border-pixel-gray p-6">
            <p className="font-pixel text-xl md:text-2xl text-pixel-white text-center leading-relaxed mb-4">
              Ready to collaborate on your next project? Whether it's building an AI-powered app, crafting a web/mobile experience, or producing cinematic content — let's create something remarkable together!
            </p>
            <p className="font-pixel text-lg md:text-xl text-pixel-cyan text-center leading-relaxed">
              Choose your preferred communication channel below.
            </p>
          </div>
        </motion.div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ x: index % 2 === 0 ? -100 : 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group"
            >
              <div className="bg-pixel-black border-4 border-pixel-white shadow-pixel hover:shadow-pixel-lg transition-all duration-200">
                <div className="absolute inset-2 border-2 border-pixel-gray group-hover:border-pixel-yellow transition-colors"></div>

                <div className={`relative bg-gradient-to-r from-${link.color} to-pixel-blue p-6 flex items-center gap-4`}>
                  <div className="w-16 h-16 bg-pixel-yellow border-4 border-pixel-orange shadow-pixel flex items-center justify-center flex-shrink-0">
                    <link.icon className="w-10 h-10 text-pixel-black" strokeWidth={2.5} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-game text-lg text-pixel-yellow mb-1">
                      {link.label}
                    </h3>
                    <p className="font-pixel text-xl text-pixel-white">
                      {link.value}
                    </p>
                  </div>

                  <motion.span
                    className="font-game text-2xl text-pixel-yellow"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ▶
                  </motion.span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
          className="text-center"
        >
          <div className="inline-block bg-gradient-to-r from-pixel-pink to-pixel-red border-4 border-pixel-white p-8 shadow-pixel-lg">
            <h3 className="font-game text-2xl md:text-3xl text-pixel-white text-outline mb-4 leading-relaxed">
              QUEST AWAITS!
            </h3>
            <p className="font-pixel text-xl text-pixel-white mb-6">
              Response time: Usually within 24 hours
            </p>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-6xl">💌</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
