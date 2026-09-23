'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { profile } from '@/lib/profile';
import LogoMark from './LogoMark';

const links = [
  { href: '#work', label: 'Work' },
  { href: '#day-job', label: 'Day job' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
];

/**
 * A floating pill that tightens once the page scrolls. On small screens the
 * links move into a full-screen menu that slides down from the top.
 */
export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4">
        <div
          className={`pointer-events-auto flex w-full items-center justify-between gap-3 rounded-full border border-white/15 bg-black/70 p-2 text-white backdrop-blur-xl transition-[max-width,box-shadow] duration-500 ${
            scrolled ? 'max-w-3xl shadow-[0_18px_40px_-20px_rgba(0,0,0,0.9)]' : 'max-w-page'
          }`}
        >
          <a href="#top" className="flex items-center gap-2.5 rounded-full pr-2" aria-label={`${profile.name}, home`}>
            <LogoMark size={38} tone="sun" />
            <span className="text-[15px] font-extrabold tracking-tight">
              Loan Ladiff<span className="hidden text-white/50 sm:inline"> Sedo-Ta</span>
            </span>
          </a>

          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-[15px] text-white/70 transition-colors hover:bg-white hover:text-black"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href="#contact" className="btn min-h-[42px] rounded-full bg-white px-5 text-black hover:bg-sun">
              Let’s talk
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid h-[42px] w-[42px] place-items-center rounded-full border border-white/20 md:hidden"
            >
              <span className="sr-only">Open menu</span>
              <span aria-hidden className="flex flex-col gap-1.5">
                <span className="h-0.5 w-5 bg-white" />
                <span className="h-0.5 w-3.5 self-end bg-white" />
              </span>
            </button>
          </div>
        </div>
      </header>
      {open && createPortal(<MobileMenu onClose={close} />, document.body)}
    </>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = panel.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tl = gsap.timeline({ paused: reduce });
    tl.from(el, { yPercent: -100, duration: 0.55, ease: 'power4.out' }).from(
      el.querySelectorAll('[data-menu-link]'),
      { y: 60, autoAlpha: 0, stagger: 0.06, duration: 0.5, ease: 'power3.out' },
      '-=0.2',
    );
    if (reduce) tl.progress(1);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    el.querySelector<HTMLElement>('button')?.focus();
    return () => {
      tl.kill();
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      ref={panel}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[60] flex flex-col bg-sun p-6 text-black"
    >
      <div className="flex items-center justify-between">
        <LogoMark size={44} tone="dark" />
        <button type="button" onClick={onClose} className="grid h-12 w-12 place-items-center rounded-full bg-black text-2xl text-white">
          <span className="sr-only">Close menu</span>
          <span aria-hidden>×</span>
        </button>
      </div>
      <nav aria-label="Mobile" className="mt-auto flex flex-col gap-1">
        {[...links, { href: '#contact', label: 'Contact' }].map((l) => (
          <a
            key={l.href}
            href={l.href}
            data-menu-link
            onClick={onClose}
            className="text-6xl font-extrabold leading-[1.05]"
            style={{ letterSpacing: '-0.05em' }}
          >
            {l.label}
          </a>
        ))}
      </nav>
      <p className="mt-10 font-semibold">{profile.contacts.email}</p>
    </div>
  );
}
