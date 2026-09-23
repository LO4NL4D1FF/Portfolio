import { profile } from '@/lib/profile';

const links = [
  { href: '#work', label: 'Work' },
  { href: '#services', label: 'Services' },
  { href: '#about', label: 'About' },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="page flex h-16 items-center justify-between gap-4">
        <a href="#top" className="text-[15px] font-extrabold tracking-tight">
          {profile.name}
        </a>
        <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hidden rounded-md px-3 py-2 text-[15px] text-slate transition-colors hover:text-ink sm:inline-block"
            >
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn min-h-[40px] bg-sun px-4 text-[rgb(14_26_43)] hover:brightness-95">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
