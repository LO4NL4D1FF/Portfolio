import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page flex min-h-screen flex-col justify-center py-20">
      <p className="font-semibold text-slate">Error 404</p>
      <h1 className="heading mt-3 max-w-[16ch]">There’s no page at this address.</h1>
      <p className="mt-5 max-w-prose text-lg text-slate">
        The link may be old or mistyped. Everything on the site is on the home page.
      </p>
      <Link href="/" className="btn-solid mt-8 self-start">
        Go to the home page
      </Link>
    </main>
  );
}
