import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="surface-strong max-w-md p-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-300">
          404
        </p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-cream-50">
          That page does not exist.
        </h1>
        <p className="mt-3 text-sm text-cream-300">
          The link is dead, but the rest of the site is alive.
        </p>
        <Link href="/" className="btn-primary mt-6">
          Back home
        </Link>
      </div>
    </main>
  );
}
