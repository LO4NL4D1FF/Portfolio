'use client';

import { useRef, type ReactNode, type PointerEvent } from 'react';
import gsap from 'gsap';

interface MagneticLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

const PULL = 0.3;

/** A link that leans toward the pointer while hovered, then springs back. */
export default function MagneticLink({ href, className = '', children }: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - (r.left + r.width / 2)) * PULL,
      y: (e.clientY - (r.top + r.height / 2)) * PULL,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const onLeave = () => {
    if (ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <a ref={ref} href={href} onPointerMove={onMove} onPointerLeave={onLeave} className={className}>
      {children}
    </a>
  );
}
