'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { profile } from '@/lib/profile';
import { rotatingWords, stats } from '@/lib/hero';
import MagneticLink from './MagneticLink';

gsap.registerPlugin(useGSAP);

const HOLD = 1.8;

export default function HeroCopy() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const root = scope.current;
      if (!root) return;
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        introTimeline(root);
        rotateWords(root);
        countUp(root);
      });
    },
    { scope },
  );

  return (
    <div ref={scope}>
      <p data-intro className="text-[15px] font-semibold text-mist/70">
        Software engineer and video editor, open to new work
      </p>

      <h1 className="mt-6 text-[2.5rem] font-extrabold leading-[0.98] sm:text-6xl xl:text-[4.1rem]" style={{ letterSpacing: '-0.045em' }}>
        <span data-intro className="block">I build</span>
        <span data-intro className="relative block h-[1.05em] overflow-hidden text-[0.9em] text-sun" aria-live="off">
          <span className="sr-only">{rotatingWords.join(', ')}</span>
          <span aria-hidden data-words className="block">
            {[...rotatingWords, rotatingWords[0]].map((w, i) => (
              <span key={`${w}-${i}`} className="block h-[1.05em] whitespace-nowrap">
                {w}
              </span>
            ))}
          </span>
        </span>
        <span data-intro className="block">that hold up on slow networks.</span>
      </h1>

      <p data-intro className="mt-7 max-w-[34rem] text-lg leading-relaxed text-mist/75">
        {profile.intro}
      </p>

      <div data-intro className="mt-9 flex flex-wrap gap-3">
        <MagneticLink href="#work" className="btn bg-sun px-6 text-black">
          See my work
        </MagneticLink>
        <MagneticLink href={`mailto:${profile.contacts.email}`} className="btn border border-mist/30 px-6 hover:border-mist">
          Email me
        </MagneticLink>
      </div>

      <dl data-intro className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-mist/15 pt-6">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="sr-only">{s.label}</dt>
            <dd className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              <span data-count={s.value}>{s.value}</span>
              <span className="text-sun">{s.suffix}</span>
            </dd>
            <p aria-hidden className="mt-1 text-sm leading-snug text-mist/60">
              {s.label}
            </p>
          </div>
        ))}
      </dl>
    </div>
  );
}

function introTimeline(root: HTMLElement) {
  gsap.from(root.querySelectorAll('[data-intro]'), {
    y: 36,
    autoAlpha: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.09,
  });
}

/** Slides the word list up one slot at a time; the duplicated first word makes the loop seamless. */
function rotateWords(root: HTMLElement) {
  const list = root.querySelector<HTMLElement>('[data-words]');
  if (!list) return;
  const steps = rotatingWords.length;
  const tl = gsap.timeline({ repeat: -1, delay: 1.2 });
  for (let i = 1; i <= steps; i += 1) {
    tl.to(list, { yPercent: (-100 / (steps + 1)) * i, duration: 0.55, ease: 'power3.inOut' }, `+=${HOLD}`);
  }
  tl.set(list, { yPercent: 0 });
}

function countUp(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const counter = { n: 0 };
    gsap.to(counter, {
      n: target,
      duration: 1.6,
      delay: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = String(Math.round(counter.n));
      },
    });
  });
}
