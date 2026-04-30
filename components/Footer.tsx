import { profile } from '@/lib/profile';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container-page flex flex-col items-start justify-between gap-3 text-sm text-cream-300 sm:flex-row sm:items-center">
        <p>
          {year} {profile.name}. Built with Next.js.
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cream-400">
          Monrovia · Liberia
        </p>
      </div>
    </footer>
  );
}
