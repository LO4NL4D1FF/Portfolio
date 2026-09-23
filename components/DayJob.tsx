'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { dayJob } from '@/lib/dayJob';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Always-dark band about the bank role; each duty slides in as it scrolls into view. */
export default function DayJob() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(root.querySelectorAll('[data-role]'), {
          x: -40,
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: root, start: 'top 65%' },
        });
        gsap.from(root.querySelector('[data-vault]'), {
          rotate: -90,
          scale: 0.6,
          autoAlpha: 0,
          duration: 1.2,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: root, start: 'top 70%' },
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} id="day-job" className="relative overflow-hidden bg-white py-20 text-black sm:py-28">
      <VaultDial />
      <div className="page relative grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div>
          <p className="inline-block rounded-full bg-black px-3 py-1 text-sm font-semibold text-sun">Day job</p>
          <h2 className="heading mt-3">{dayJob.title}</h2>
          <p className="mt-6 max-w-prose text-lg leading-relaxed text-neutral-600">{dayJob.intro}</p>
          <p className="mt-8 max-w-prose border-l-2 border-sun pl-4 text-[15px] leading-relaxed text-neutral-500">
            {dayJob.note}
          </p>
        </div>

        <ol className="grid gap-4 sm:grid-cols-2">
          {dayJob.roles.map((role, i) => (
            <li
              key={role.name}
              data-role
              className="group rounded-3xl border border-neutral-200 bg-neutral-50 p-6 transition-colors hover:border-black hover:bg-white"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-sm font-extrabold text-sun transition-transform group-hover:rotate-12">
                {i + 1}
              </span>
              <h3 className="mt-5 text-xl font-bold tracking-tight">{role.name}</h3>
              <p className="mt-2 leading-relaxed text-neutral-600">{role.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** A big vault-door dial behind the section, slowly turning. */
function VaultDial() {
  const ticks = Array.from({ length: 60 }, (_, i) => i);
  return (
    <svg
      data-vault
      aria-hidden
      viewBox="0 0 200 200"
      className="badge-spin pointer-events-none absolute -right-40 -top-32 h-[560px] w-[560px] opacity-[0.07] [animation-duration:60s]"
      fill="none"
      stroke="#000000"
    >
      <circle cx="100" cy="100" r="96" strokeWidth="2" />
      <circle cx="100" cy="100" r="70" strokeWidth="1" />
      <circle cx="100" cy="100" r="22" strokeWidth="6" />
      {ticks.map((t) => (
        <line key={t} x1="100" y1="6" x2="100" y2={t % 5 ? 14 : 22} strokeWidth={t % 5 ? 1 : 2} transform={`rotate(${t * 6} 100 100)`} />
      ))}
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line key={a} x1="100" y1="78" x2="100" y2="32" strokeWidth="5" strokeLinecap="round" transform={`rotate(${a} 100 100)`} />
      ))}
    </svg>
  );
}
