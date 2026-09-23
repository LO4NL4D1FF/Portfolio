'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import gsap from 'gsap';
import type { Project } from '@/lib/projects';
import PhoneFrame from './devices/PhoneFrame';
import BrowserFrame from './devices/BrowserFrame';

interface DemoButtonProps {
  project: Project;
  className?: string;
}

/** "See it" button that opens the project's live demo or real screenshots. */
export default function DemoButton({ project, className = '' }: DemoButtonProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  if (!project.demo) return null;

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {project.demo.kind === 'live' ? 'Try it live' : 'See it'}
      </button>
      {/* Portal to <body>: cards are GSAP-transformed, which would trap a fixed overlay inside them. */}
      {open && createPortal(<DemoViewer project={project} onClose={close} />, document.body)}
    </>
  );
}

function DemoViewer({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const demo = project.demo;

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      gsap.from(el, { autoAlpha: 0, duration: 0.3 });
      gsap.from(el.querySelectorAll('[data-device]'), { y: 60, autoAlpha: 0, stagger: 0.08, duration: 0.6, ease: 'power3.out' });
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    el.querySelector<HTMLElement>('[data-close]')?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!demo) return null;
  // Screens were captured from the apps running locally, so the address bar says so.
  const host = 'localhost:3000';

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} demo`}
      className="fixed inset-0 z-[70] overflow-y-auto bg-black/90 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="page flex min-h-full flex-col py-6">
        <div className="flex items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3">
            {project.logo && <Image src={project.logo} alt="" width={40} height={40} unoptimized={project.logo.endsWith('.svg')} className="rounded-[22%]" />}
            <div>
              <p className="text-xl font-extrabold tracking-tight">{project.name}</p>
              <p className="text-sm text-white/60">{demo.kind === 'live' ? 'The real app, running right here. Go ahead and type.' : 'Real screens, captured from the running app.'}</p>
            </div>
          </div>
          <button type="button" data-close onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-white text-xl text-black">
            <span className="sr-only">Close demo</span>
            <span aria-hidden>×</span>
          </button>
        </div>

        <div className="my-auto flex flex-wrap items-center justify-center gap-8 py-8" onClick={(e) => e.target === e.currentTarget && onClose()}>
          {demo.kind === 'live' ? (
            <div data-device className="w-full max-w-5xl">
              <BrowserFrame url={`loansedota.com${demo.url.replace('/index.html', '')}`} title={project.name} favicon={project.logo}>
                <iframe src={demo.url} title={`${project.name} live demo`} className="block h-[70vh] w-full" />
              </BrowserFrame>
            </div>
          ) : (
            <>
              {demo.desktop?.map((src, i) => (
                <div key={src} data-device className="w-full max-w-3xl">
                  <BrowserFrame url={host} title={project.name} favicon={project.logo}>
                    <Image src={src} alt={`${project.name} screen ${i + 1}`} width={1280} height={800} className="block h-auto w-full" />
                  </BrowserFrame>
                </div>
              ))}
              {demo.phone?.map((src, i) => (
                <div key={src} data-device>
                  <PhoneFrame src={src} alt={`${project.name} phone screen ${i + 1}`} width={240} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
