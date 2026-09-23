'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import PhoneMock from './PhoneMock';
import CodeWindow from './CodeWindow';
import EditTimeline from './EditTimeline';
import SpinBadge from './SpinBadge';
import ClockChip from './ClockChip';
import DeployToast from './DeployToast';

gsap.registerPlugin(useGSAP);

/**
 * A collage of the things I spend my days in: an app on a phone, an editor,
 * a video timeline. Layers drift against the pointer by their data-depth.
 */
export default function HeroStage() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(root.querySelectorAll('[data-depth]'), {
          y: 60,
          autoAlpha: 0,
          scale: 0.92,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.12,
          delay: 0.3,
        });
        return bindParallax(root);
      });
    },
    { scope },
  );

  return (
    <div ref={scope} aria-hidden className="relative mx-auto h-[500px] w-full max-w-[560px] sm:h-[580px]">
      <div data-depth="0.6" className="absolute left-0 top-2 z-10 hidden w-[330px] sm:block">
        <CodeWindow />
      </div>
      <div data-depth="1.2" className="absolute inset-x-0 top-6 z-20 flex justify-center sm:inset-x-auto sm:right-10">
        <PhoneMock />
      </div>
      <div data-depth="0.9" className="absolute bottom-0 left-0 z-30 w-full sm:bottom-2 sm:w-[380px]">
        <EditTimeline />
      </div>
      <div data-depth="1.6" className="absolute -right-2 -top-4 z-30 sm:-right-4">
        <SpinBadge />
      </div>
      <div data-depth="1.4" className="absolute left-0 top-[38%] z-30 sm:left-4 sm:top-[46%]">
        <ClockChip />
      </div>
      <div data-depth="1.8" className="absolute bottom-[30%] right-0 z-30 sm:bottom-[24%]">
        <DeployToast />
      </div>
    </div>
  );
}

/** Returns a cleanup so gsap.matchMedia can remove the listener when motion is turned off. */
function bindParallax(root: HTMLElement) {
  const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-depth]')).map((el) => ({
    depth: Number(el.dataset.depth),
    x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }),
    y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' }),
  }));

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const dx = e.clientX / window.innerWidth - 0.5;
    const dy = e.clientY / window.innerHeight - 0.5;
    layers.forEach((l) => {
      l.x(dx * 28 * l.depth);
      l.y(dy * 20 * l.depth);
    });
  };

  window.addEventListener('pointermove', onMove);
  return () => window.removeEventListener('pointermove', onMove);
}
