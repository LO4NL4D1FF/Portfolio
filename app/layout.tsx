import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://loanladiff.dev'),
  title: {
    default: 'Loan Ladiff Sedo-Ta — Software Engineer',
    template: '%s — Loan Ladiff Sedo-Ta',
  },
  description:
    'Software engineer focused on the frontend, learning the backend, and editing video on the side. Based in Monrovia, Liberia.',
  keywords: [
    'Loan Ladiff',
    'Sedo-Ta',
    'Software Engineer',
    'Frontend Engineer',
    'Liberia',
    'Next.js',
    'React',
    'TypeScript',
    'Videography',
  ],
  authors: [{ name: 'Loan Ladiff Sedo-Ta' }],
  creator: 'Loan Ladiff Sedo-Ta',
  openGraph: {
    title: 'Loan Ladiff Sedo-Ta — Software Engineer',
    description:
      'Frontend specialist, backend in progress. Video work on the side. Based in Monrovia.',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0B0D14',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
