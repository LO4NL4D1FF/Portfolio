'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Facebook, MessageCircle, ArrowUpRight } from 'lucide-react';

const links = [
  { icon: Mail,          label: 'Email',    value: 'difflad@gmail.com',   href: 'mailto:difflad@gmail.com' },
  { icon: Github,        label: 'GitHub',   value: 'LO4NL4D1FF',          href: 'https://github.com/LO4NL4D1FF' },
  { icon: Facebook,      label: 'Facebook', value: 'Loan Ladiff',         href: 'https://www.facebook.com/Anonn.005/' },
  { icon: MessageCircle, label: 'WhatsApp', value: '+231 555 666 157',    href: 'https://wa.me/231555666157' },
];

export default function ContactSection() {
  return (
    <div className="min-h-[80vh] max-w-3xl mx-auto px-5 md:px-8 py-6 pb-24 space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-3xl p-8 md:p-10"
      >
        <p className="text-xs tracking-[0.3em] text-g-700 uppercase mb-3">
          Channel
        </p>
        <h1 className="font-sans font-light text-3xl md:text-4xl tracking-tight text-white mb-4">
          Let&apos;s work together
        </h1>
        <p className="text-sm md:text-base text-g-800 leading-relaxed">
          Open to collaboration on AI-powered apps, full-stack builds, and cinematic edits. Responses usually within 24 hours.
        </p>

        <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-subtle">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inset-0 rounded-full bg-white/60 animate-ping" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-white" />
          </span>
          <span className="text-[11px] tracking-[0.2em] text-white uppercase">
            Available for work
          </span>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {links.map((link, i) => {
          const Icon = link.icon;
          return (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              className="group glass glass-hover rounded-2xl p-5 flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-xl glass-subtle flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[11px] tracking-[0.25em] text-g-700 uppercase">
                  {link.label}
                </p>
                <p className="text-base text-white truncate">
                  {link.value}
                </p>
              </div>

              <ArrowUpRight
                className="w-4 h-4 text-g-700 shrink-0 transition-all group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.75}
              />
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
