'use client';

import { useEffect, useState } from 'react';

const formatter = (timeZone: string) =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone });

/** Live local time for the given zone; renders nothing until mounted to avoid hydration drift. */
export default function MonroviaTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = formatter(timeZone);
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  if (!time) return null;

  return (
    <p className="text-sm text-slate">
      It’s <time className="font-semibold text-ink">{time}</time> in Monrovia right now.
    </p>
  );
}
