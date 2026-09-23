import { marqueeItems } from '@/lib/hero';

/** A mango strip of the tools I use, scrolling forever. Doubled so the loop has no seam. */
export default function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div aria-label="Tools I work with" className="marquee overflow-hidden border-y-2 border-black bg-sun py-5 text-black">
      <ul className="marquee-track flex w-max items-center gap-10">
        {items.map((item, i) => (
          <li
            key={`${item}-${i}`}
            aria-hidden={i >= marqueeItems.length}
            className="flex items-center gap-10 whitespace-nowrap text-3xl font-extrabold tracking-tight sm:text-5xl"
          >
            <span className={i % 2 ? 'text-transparent [-webkit-text-stroke:1.5px_black]' : ''}>{item}</span>
            <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" className="shrink-0">
              <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" fill="currentColor" />
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
}
