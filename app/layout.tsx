import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Loan Ladiff Sedo-Ta | Software Engineer Portfolio',
  description: 'Retro pixel art portfolio showcasing AI-powered apps (Zenix, CORELM, Audify), full-stack development, and cinematic video editing by Loan Ladiff Sedo-Ta. Cameroonian software engineer based in Monrovia, Liberia.',
  keywords: ['Loan Ladiff', 'Sedo-Ta', 'Software Engineer', 'React', 'React Native', 'AI Integration', 'GPT', 'Claude', 'Next.js', 'TypeScript', 'Adobe Premiere Pro', 'Video Editing', 'Mobile Apps', 'Web Development', 'Liberia', 'Cameroon'],
  authors: [{ name: 'Loan Ladiff Sedo-Ta' }],
  creator: 'Loan Ladiff Sedo-Ta',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Sedo-Ta Portfolio',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1a1c2c',
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
      </body>
    </html>
  )
}
