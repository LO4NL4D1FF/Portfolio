'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Facebook, MessageCircle } from 'lucide-react';

const links = [
  { icon: Mail,           label: 'Email',    value: 'difflad@gmail.com',  href: 'mailto:difflad@gmail.com' },
  { icon: Github,         label: 'GitHub',   value: 'LO4NL4D1FF',         href: 'https://github.com/LO4NL4D1FF' },
  { icon: Facebook,       label: 'Facebook', value: 'Loan Ladiff',        href: 'https://www.facebook.com/Anonn.005/' },
  { icon: MessageCircle,  label: 'WhatsApp', value: '+231 555 666 157',   href: 'https://wa.me/231555666157' },
];

export default function ContactSection() {
  return (
    <div className="min-h-[80vh] max-w-3xl mx-auto px-6 py-10 space-y-10">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="font-mono text-[11px] tracking-[0.3em] text-slate mb-3">
          / / CHANNEL
        </p>
        <h1 className="font-sans font-light text-3xl md:text-4xl tracking-[0.15em] text-bone uppercase">
          Contact
        </h1>
        <div className="mt-5 h-px bg-ink-line" />
      </motion.header>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="font-sans text-base md:text-lg text-bone/85 leading-relaxed"
      >
        Open to collaboration on AI-powered apps, full-stack builds, and cinematic edits. Pick a channel below — responses usually within 24 hours.
      </motion.p>

      <ul className="border-y border-ink-line divide-y divide-ink-line">
        {links.map((link, i) => {
          const Icon = link.icon;
          return (
            <motion.li
              key={link.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-5 py-5"
              >
                <div className="w-10 h-10 border border-ink-line flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-bone/80 group-hover:text-amber transition-colors" strokeWidth={1.5} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] tracking-[0.3em] text-dim uppercase">
                    {link.label}
                  </p>
                  <p className="font-sans text-base md:text-lg text-bone group-hover:text-amber transition-colors truncate">
                    {link.value}
                  </p>
                </div>

                <span className="font-mono text-sm text-dim group-hover:text-amber transition-colors">
                  →
                </span>
              </a>
            </motion.li>
          );
        })}
      </ul>

      <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-dim">
        <span className="w-1.5 h-1.5 bg-amber" />
        AVAILABLE FOR WORK
      </div>
    </div>
  );
}
