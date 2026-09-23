'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { phoneScreens, type PhoneScreen } from '@/lib/hero';
import { FRAME_SRC, SCREEN_INSET, SCREEN_RADIUS } from '../devices/PhoneFrame';

gsap.registerPlugin(useGSAP);

const HOLD = 2.4;

/** A real iPhone 17 frame flipping through screens of apps I've built. */
export default function PhoneMock() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const screens = Array.from(root.querySelectorAll<HTMLElement>('[data-screen]'));
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ repeat: -1, delay: 1.4 });
        screens.forEach((screen, i) => {
          const next = screens[(i + 1) % screens.length];
          // Like an app switch: the next screen slides in while the current one slides out.
          tl.to(screen, { xPercent: -100, duration: 0.6, ease: 'power3.inOut' }, `+=${HOLD}`)
            .fromTo(next, { xPercent: 100, autoAlpha: 1 }, { xPercent: 0, duration: 0.6, ease: 'power3.inOut' }, '<')
            .set(screen, { autoAlpha: 0, xPercent: 0 });
        });
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative aspect-[388/800] w-[220px] drop-shadow-[0_40px_50px_rgba(0,0,0,0.7)] sm:w-[236px]">
      <div className="absolute overflow-hidden bg-black" style={{ ...SCREEN_INSET, borderRadius: SCREEN_RADIUS }}>
        {phoneScreens.map((s, i) => (
          <div key={s.id} data-screen className="absolute inset-0" style={{ visibility: i === 0 ? 'visible' : 'hidden' }}>
            {s.shot ? (
              <Image src={s.shot} alt="" fill sizes="236px" className="object-cover object-top" priority={i === 0} />
            ) : (
              <Splash screen={s} />
            )}
          </div>
        ))}
      </div>
      <Image
        src={FRAME_SRC}
        alt=""
        width={388}
        height={800}
        priority
        className="pointer-events-none absolute inset-0 h-full w-full select-none"
      />
    </div>
  );
}

/** Launch screen in the app's own colors, used where no real screenshot exists yet. */
function Splash({ screen }: { screen: PhoneScreen }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center text-white" style={{ background: screen.bg }}>
      <Image src={screen.logo} alt="" width={84} height={84} className="rounded-[22%]" />
      <p className="mt-4 text-xl font-extrabold tracking-tight">{screen.name}</p>
      <p className="mt-1 text-[13px] opacity-75">{screen.line}</p>
    </div>
  );
}
