import { profile } from '@/lib/profile';

export default function SiteFooter() {
  return (
    <footer className="page flex flex-col gap-2 py-8 text-sm text-slate sm:flex-row sm:justify-between">
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <p>Designed and built in {profile.location}.</p>
    </footer>
  );
}
