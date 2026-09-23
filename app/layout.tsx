import type { Metadata, Viewport } from 'next';
import { Schibsted_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const schibsted = Schibsted_Grotesk({
  subsets: ['latin'],
  variable: '--font-schibsted',
  display: 'swap',
});

const description =
  'Loan Ladiff Sedo-Ta is a software engineer in Monrovia, Liberia, building mobile and web apps: Karrio, Gamefy, Audify and more.';

export const metadata: Metadata = {
  metadataBase: new URL('https://loansedota.com'),
  title: {
    default: 'Loan Ladiff Sedo-Ta, software engineer',
    template: '%s | Loan Ladiff Sedo-Ta',
  },
  description,
  keywords: ['Loan Ladiff Sedo-Ta', 'Software Engineer', 'Liberia', 'Monrovia', 'React Native', 'Next.js', 'TypeScript', 'Supabase'],
  authors: [{ name: 'Loan Ladiff Sedo-Ta' }],
  creator: 'Loan Ladiff Sedo-Ta',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.svg' },
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Loan Ladiff Sedo-Ta, software engineer',
    description,
    url: 'https://loansedota.com',
    siteName: 'Loan Ladiff Sedo-Ta',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E6EAEE' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1422' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={schibsted.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
