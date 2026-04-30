'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { profile } from '@/lib/profile';

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled
          ? 'border-b border-white/5 bg-ink-900/70 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="#top"
          className="group flex items-center gap-2 font-display text-sm font-semibold tracking-tight text-cream-50"
        >
          <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-accent-400 to-accent-700 text-[10px] font-bold text-white">
            LL
          </span>
          <span className="hidden sm:inline">{profile.shortName}</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-cream-200 transition hover:text-cream-50"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="btn-primary hidden md:inline-flex">
          Hire me
        </a>

        <a href="#contact" className="btn-primary md:hidden">
          Hire
        </a>
      </div>
    </header>
  );
}
