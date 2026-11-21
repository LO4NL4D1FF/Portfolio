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
  'Loan Ladiff Sedo-Ta is a software engineer in Monrovia, Liberia, founder and CEO of AnonTech, and a BSc IT graduate of BlueCrest University College. Mobile and web apps: Karrio, Gamefy, Audify and more.';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Loan Ladiff Sedo-Ta',
  alternateName: ['Loan Sedo-Ta', 'Loan Ladiff'],
  url: 'https://loansedota.com',
  jobTitle: 'Software engineer, Founder and CEO of AnonTech',
  description,
  worksFor: { '@type': 'Organization', name: 'AnonTech', url: 'https://www.anontech.website' },
  founder: { '@type': 'Organization', name: 'AnonTech', url: 'https://www.anontech.website' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'BlueCrest University College' },
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'degree',
    name: 'BSc in Information Technology',
    recognizedBy: { '@type': 'CollegeOrUniversity', name: 'BlueCrest University College' },
  },
  address: { '@type': 'PostalAddress', addressLocality: 'Monrovia', addressCountry: 'LR' },
  nationality: 'Cameroon',
  knowsAbout: ['Software engineering', 'React', 'Next.js', 'React Native', 'TypeScript', 'Supabase', 'Mobile Money integration'],
  sameAs: ['https://github.com/LO4NL4D1FF', 'https://www.anontech.website'],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://loansedota.com'),
  title: {
    default: 'Loan Ladiff Sedo-Ta | Software engineer, founder of AnonTech',
    template: '%s | Loan Ladiff Sedo-Ta',
  },
  description,
  keywords: ['Loan Ladiff Sedo-Ta', 'Loan Sedo-Ta', 'AnonTech', 'AnonTech founder', 'BlueCrest University College', 'BSc IT', 'Software Engineer', 'Liberia', 'Monrovia', 'React Native', 'Next.js', 'TypeScript', 'Supabase'],
  authors: [{ name: 'Loan Ladiff Sedo-Ta' }],
  creator: 'Loan Ladiff Sedo-Ta',
  manifest: '/manifest.json',
  icons: { icon: '/favicon.svg' },
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Loan Ladiff Sedo-Ta | Software engineer, founder of AnonTech',
    description,
    url: 'https://loansedota.com',
    siteName: 'Loan Ladiff Sedo-Ta',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={schibsted.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
