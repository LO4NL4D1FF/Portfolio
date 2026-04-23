import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sedo-Ta · Software Engineer Portfolio',
  description: 'Minimal cyberpunk portfolio of Loan Ladiff Sedo-Ta — software engineer building AI-powered products (Zenix, CORELM, Audify), full-stack apps, and cinematic video work.',
  keywords: ['Loan Ladiff', 'Sedo-Ta', 'Software Engineer', 'React', 'React Native', 'AI Integration', 'GPT', 'Claude', 'Next.js', 'TypeScript', 'Adobe Premiere Pro', 'Video Editing', 'Mobile Apps', 'Web Development', 'Liberia', 'Cameroon'],
  authors: [{ name: 'Loan Ladiff Sedo-Ta' }],
  creator: 'Loan Ladiff Sedo-Ta',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sedo-Ta',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0b0c0f',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
