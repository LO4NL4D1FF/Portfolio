'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Facebook, MessageCircle, ArrowUpRight } from 'lucide-react';

const links = [
  { icon: Mail,          label: 'Email',    value: 'difflad@gmail.com',  href: 'mailto:difflad@gmail.com' },
  { icon: Github,        label: 'GitHub',   value: 'LO4NL4D1FF',         href: 'https://github.com/LO4NL4D1FF' },
  { icon: Facebook,      label: 'Facebook', value: 'Loan Ladiff',        href: 'https://www.facebook.com/Anonn.005/' },
  { icon: MessageCircle, label: 'WhatsApp', value: '+231 555 666 157',   href: 'https://wa.me/231555666157' },
];

export default function ContactSection() {
  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-6 pb-20 space-y-4">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-3xl p-6 md:p-8"
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="relative flex w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-fg/30 animate-ping" />
            <span className="relative w-2 h-2 rounded-full bg-fg" />
          </span>
          <span className="text-[11px] font-medium tracking-[0.2em] text-fg uppercase">
            Available for work
          </span>
        </div>
        <h1 className="headline font-semibold text-3xl md:text-4xl text-fg mb-2">
          Let&apos;s build something.
        </h1>
        <p className="text-sm md:text-base text-muted">
          AI-powered apps, full-stack web &amp; mobile, cinematic edits. Usually responds within 24 hours.
        </p>
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04, duration: 0.35 }}
              className="group glass glass-hover rounded-2xl p-4 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl glass-subtle flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-fg" strokeWidth={1.75} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-sub">
                  {link.label}
                </p>
                <p className="text-sm text-fg font-medium truncate">
                  {link.value}
                </p>
              </div>
              <ArrowUpRight
                className="w-4 h-4 text-muted shrink-0 transition-all group-hover:text-fg group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.75}
              />
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
