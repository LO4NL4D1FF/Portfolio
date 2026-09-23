'use client';

import { useEffect, useState } from 'react';
import { profile } from '@/lib/profile';

/** Live Monrovia time; renders a placeholder until mounted so server and client markup match. */
export default function ClockChip() {
  const [time, setTime] = useState('--:--');

  useEffect(() => {
    const format = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: profile.timeZone,
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#F4F6F8] px-4 py-3 text-black shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]">
      <LiberianFlag />
      <div className="leading-tight">
        <p className="text-[11px] font-semibold text-[#4C5A6B]">Monrovia now</p>
        <p className="font-mono text-lg font-bold">{time}</p>
      </div>
    </div>
  );
}

/** Simplified Liberian flag: stripes plus the blue canton and star. */
function LiberianFlag() {
  const stripes = Array.from({ length: 11 }, (_, i) => i);
  return (
    <svg viewBox="0 0 38 20" width="34" height="18" aria-hidden className="shrink-0 rounded-[3px]">
      {stripes.map((i) => (
        <rect key={i} y={(i * 20) / 11} width="38" height={20 / 11} fill={i % 2 ? '#fff' : '#BF0A30'} />
      ))}
      <rect width="10" height={(20 / 11) * 5} fill="#002868" />
      <path d="M5 1.6l1.3 3.9-3.3-2.4h4l-3.3 2.4z" fill="#fff" />
    </svg>
  );
}
