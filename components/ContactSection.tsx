'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Facebook, MessageCircle } from 'lucide-react';

export default function ContactSection() {
  const socialLinks = [
    { icon: Mail, label: 'EMAIL.UPLINK', value: 'difflad@gmail.com', href: 'mailto:difflad@gmail.com', color: '#fcee0a', border: 'border-neon-yellow', text: 'text-neon-yellow' },
    { icon: Github, label: 'GIT.REPO', value: 'LO4NL4D1FF', href: 'https://github.com/LO4NL4D1FF', color: '#00f0ff', border: 'border-neon-cyan', text: 'text-neon-cyan' },
    { icon: Facebook, label: 'SOCIAL.NET', value: 'Loan Ladiff', href: 'https://www.facebook.com/Anonn.005/', color: '#ff003c', border: 'border-neon-magenta', text: 'text-neon-magenta' },
    { icon: MessageCircle, label: 'DIRECT.COMMS', value: '+231 555 666 157', href: 'https://wa.me/231555666157', color: '#fcee0a', border: 'border-neon-yellow', text: 'text-neon-yellow' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="cyber-panel cyber-panel-magenta cyber-corners p-6 mb-8 text-center"
        >
          <p className="font-mono tracking-[0.4em] text-xs text-neon-cyan mb-2" style={{ textShadow: '0 0 6px #00f0ff' }}>
            /// OPEN COMMS CHANNEL ///
          </p>
          <h2 className="glitch font-cyber font-black text-3xl md:text-5xl tracking-widest" data-text="INITIATE UPLINK">
            INITIATE UPLINK
          </h2>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="cyber-panel cyber-panel-cyan p-5 md:p-6 mb-8"
        >
          <div className="border-l-2 border-neon-cyan pl-4 space-y-3">
            <p className="font-hud text-base md:text-lg text-cyber-bone leading-relaxed">
              Ready to run a gig together? Whether it&apos;s an AI-powered construct, a full-stack rig, or cinematic brain-dance — jack in and let&apos;s make Night City take notice.
            </p>
            <p className="font-hud text-sm md:text-base text-neon-cyan leading-relaxed">
              &gt; Pick your preferred frequency below and send word.
            </p>
          </div>
        </motion.div>

        {/* Comms channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {socialLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group relative"
              >
                <div
                  className="absolute -inset-0.5 opacity-50 group-hover:opacity-100 blur-md transition-opacity"
                  style={{ background: `linear-gradient(135deg, ${link.color}, transparent 70%)` }}
                />

                <div
                  className={`relative cyber-clip bg-cyber-dark border-2 ${link.border} p-4 md:p-5 flex items-center gap-4`}
                  style={{
                    backgroundImage: 'linear-gradient(135deg, rgba(18,18,31,0.95), rgba(5,5,10,0.95))',
                    boxShadow: `inset 0 0 16px rgba(0,0,0,0.5)`,
                  }}
                >
                  {/* Scanline */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-10"
                    style={{ background: 'repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,240,255,0.3) 2px 3px)' }}
                  />

                  <div
                    className={`relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center border-2 ${link.border} bg-cyber-void flex-shrink-0`}
                    style={{
                      clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                      boxShadow: `0 0 12px ${link.color}, inset 0 0 8px ${link.color}33`,
                    }}
                  >
                    <Icon className={`w-7 h-7 md:w-8 md:h-8 ${link.text}`} strokeWidth={1.5} />
                  </div>

                  <div className="relative flex-1 min-w-0">
                    <p className="font-mono text-[10px] md:text-xs tracking-widest text-cyber-ash">
                      [{link.label}]
                    </p>
                    <p className={`font-cyber font-bold text-base md:text-lg tracking-wider truncate ${link.text}`} style={{ textShadow: '0 0 6px currentColor' }}>
                      {link.value}
                    </p>
                  </div>

                  <motion.span
                    className={`relative font-mono text-lg ${link.text} flex-shrink-0`}
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    ▶▶
                  </motion.span>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="relative"
        >
          <div className="absolute -inset-0.5 bg-neon-yellow opacity-30 blur-lg" />
          <div
            className="relative cyber-clip-lg bg-cyber-dark border-2 border-neon-yellow p-6 md:p-8 text-center"
            style={{
              backgroundImage: 'linear-gradient(135deg, rgba(18,18,31,0.95), rgba(5,5,10,0.95))',
            }}
          >
            <h3 className="font-cyber font-black text-xl md:text-3xl tracking-widest text-neon-yellow mb-3" style={{ textShadow: '0 0 8px #fcee0a' }}>
              ◆ READY TO RUN A GIG? ◆
            </h3>
            <p className="font-hud tracking-widest text-sm md:text-base text-cyber-ash mb-2">
              Response window · &lt; 24 hours standard
            </p>
            <p className="font-mono text-xs tracking-widest text-neon-magenta">
              [ ENCRYPTED CHANNEL · END-TO-END SECURE ]
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
