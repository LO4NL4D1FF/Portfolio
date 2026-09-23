'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

/** A build notification that pops up, holds, and slides away on a loop. */
export default function DeployToast() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ repeat: -1, repeatDelay: 3.5, delay: 2.5 })
          .fromTo(root, { x: 40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.7)' })
          .fromTo(root.querySelector('[data-check]'), { scale: 0 }, { scale: 1, duration: 0.35, ease: 'back.out(3)' }, '<0.25')
          .to(root, { x: 40, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, '+=2.6');
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="flex items-center gap-3 rounded-xl bg-[#F4F6F8] px-3.5 py-2.5 text-black shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]">
      <span data-check className="grid h-7 w-7 place-items-center rounded-full bg-[#28C840] text-sm font-bold text-white">
        ✓
      </span>
      <div className="leading-tight">
        <p className="text-[13px] font-bold">Deployed to production</p>
        <p className="text-[11px] text-[#4C5A6B]">loansedota.com in 38s</p>
      </div>
    </div>
  );
}
