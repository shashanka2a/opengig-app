import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OpenGig - AI-Powered Project Briefing Platform',
  description: 'Transform your project ideas into comprehensive briefs with our AI-powered platform. Get detailed project specifications, timelines, and deliverables.',
  keywords: ['AI', 'project management', 'briefing', 'automation', 'productivity', 'Next.js', 'React'],
  authors: [{ name: 'OpenGig Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'OpenGig - AI-Powered Project Briefing Platform',
    description: 'Transform your project ideas into comprehensive briefs with our AI-powered platform.',
    type: 'website',
    locale: 'en_US',
    url: 'https://opengig.app',
    siteName: 'OpenGig',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenGig - AI-Powered Project Briefing Platform',
    description: 'Transform your project ideas into comprehensive briefs with our AI-powered platform.',
    creator: '@opengig',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
