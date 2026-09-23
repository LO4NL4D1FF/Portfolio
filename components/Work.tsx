'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { featured, others } from '@/lib/projects';
import FeaturedProject from './FeaturedProject';
import ProjectItem from './ProjectItem';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Work() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        animateFeatured(root);
        ScrollTrigger.batch(root.querySelectorAll('[data-item]'), {
          start: 'top 88%',
          once: true,
          onEnter: (batch) =>
            gsap.fromTo(batch, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' }),
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} id="work" className="py-20 sm:py-28">
      <div className="page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-5xl font-extrabold leading-[0.95] sm:text-8xl" style={{ letterSpacing: '-0.05em' }}>
            Selected
            <br />
            <span className="text-transparent [-webkit-text-stroke:2px_rgb(var(--ink))]">work</span>
          </h2>
          <p className="max-w-sm text-lg leading-relaxed text-slate">
            Three projects I’d walk you through first, then everything else I’ve built over the last two years.
          </p>
        </div>

        <div className="mt-14 space-y-8 sm:space-y-12">
          {featured.map((project, i) => (
            <FeaturedProject key={project.id} project={project} flip={i % 2 === 1} />
          ))}
        </div>

        <h3 className="mt-24 text-3xl font-extrabold tracking-tight sm:text-4xl">More projects</h3>
        <ul className="mt-10 grid gap-x-12 gap-y-12 md:grid-cols-2">
          {others.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Each featured card rises in; its big logo scales and turns as the card scrolls through. */
function animateFeatured(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[data-featured]').forEach((card) => {
    gsap.from(card, {
      y: 80,
      autoAlpha: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 85%' },
    });
    gsap.fromTo(
      card.querySelector('[data-logo]'),
      { scale: 0.75, rotate: -12 },
      { scale: 1.05, rotate: 6, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
    gsap.fromTo(
      card.querySelector('[data-watermark]'),
      { xPercent: 10 },
      { xPercent: -25, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });
}
