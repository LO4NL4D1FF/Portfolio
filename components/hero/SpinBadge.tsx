import LogoMark from '../LogoMark';

const RING = 'SOFTWARE ENGINEER • VIDEO EDITOR • MONROVIA • ';

/** A slowly spinning sticker with the monogram in the middle. */
export default function SpinBadge() {
  return (
    <div className="relative grid h-[118px] w-[118px] place-items-center rounded-full bg-sun text-black shadow-[0_20px_40px_-18px_rgba(240,180,41,0.7)]">
      <svg viewBox="0 0 120 120" className="badge-spin absolute inset-0 h-full w-full">
        <defs>
          <path id="badge-ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
        </defs>
        <text className="fill-current text-[10.5px] font-bold" letterSpacing="1.6">
          <textPath href="#badge-ring">{RING}</textPath>
        </text>
      </svg>
      <LogoMark size={42} tone="dark" />
    </div>
  );
}
