import HeroCopy from './HeroCopy';
import HeroStage from './HeroStage';

/** Always-dark opening section: the copy on the left, a moving workspace on the right. */
export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy text-mist">
      <HeroBackdrop />
      <div className="page relative grid items-center gap-14 pb-20 pt-28 sm:pt-32 lg:min-h-[100svh] lg:grid-cols-12 lg:gap-8 lg:pb-24">
        <div className="lg:col-span-6">
          <HeroCopy />
        </div>
        <div className="lg:col-span-6">
          <HeroStage />
        </div>
      </div>
    </section>
  );
}

/** Oversized outline monogram and Monrovia's coordinates: quiet texture behind the busy stage. */
function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
      <svg
        viewBox="0 0 48 48"
        className="absolute -right-[12%] top-[8%] h-[120%] w-auto opacity-[0.06]"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="0.35"
        strokeLinecap="round"
      >
        <path d="M11 11 V35 H21" />
        <path d="M36 14 C31 10 24 12 25.5 18 C27 23 36 22 36 29 C36 35.5 28.5 37 24.5 33.5" />
      </svg>
      <p className="absolute bottom-5 left-4 font-mono text-[11px] text-mist/35 sm:left-8">
        6.30° N, 10.80° W / Monrovia
      </p>
    </div>
  );
}
