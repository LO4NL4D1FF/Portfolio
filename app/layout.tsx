import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sedo-Ta // Night City Netrunner · Software Engineer Portfolio',
  description: 'Cyberpunk 2077-inspired portfolio of Loan Ladiff Sedo-Ta — software engineer, netrunner, builder of AI-powered constructs (Zenix, CORELM, Audify). Jack in to see the gigs, cyberware loadout, and open the uplink.',
  keywords: ['Loan Ladiff', 'Sedo-Ta', 'Cyberpunk Portfolio', 'Software Engineer', 'Netrunner', 'React', 'React Native', 'AI Integration', 'GPT', 'Claude', 'Next.js', 'TypeScript', 'Adobe Premiere Pro', 'Video Editing', 'Mobile Apps', 'Web Development', 'Liberia', 'Cameroon'],
  authors: [{ name: 'Loan Ladiff Sedo-Ta' }],
  creator: 'Loan Ladiff Sedo-Ta',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sedo-Ta · Night City',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#05050a',
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
