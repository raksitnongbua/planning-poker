import type { Metadata } from 'next'
import { Coda } from 'next/font/google'
import './globals.css'
import Layout from '@/components/Layout'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/Navbar'
import { Analytics } from '@vercel/analytics/react'

import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false

const coda = Coda({ weight: '400', display: 'swap', subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.corgiplanningpoker.com'),
  alternates: {
    canonical: '/',
  },
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  creator: 'Raksit Nongbua',
  publisher: 'Raksit Nongbua',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: 'gPypTdWFwPXznnMm9vXjsR0CVA_-qx-JjzBSky6CgLY',
  },
  authors: {
    name: 'Raksit Nongbua',
  },
  icons: {
    icon: [
      '/favicon-16x16.ico',
      '/favicon-32x32.ico',
      '/favicon-60x60.ico',
      '/favicon-128x128.ico',
      '/favicon-160x160.ico',
      '/favicon-180x180.ico',
      '/favicon.ico',
    ],
  },
  applicationName: 'Corgi Planning Poker',
  title: {
    default: 'Corgi Planning Poker',
    template: 'Corgi Planning Poker | %s',
  },
  description: `Agile teams use this gamified technique to estimate task effort collaboratively,
  fostering consensus and efficient planning.`,
  openGraph: {
    title: 'Corgi Planning Poker',
    description: `Agile teams use this gamified technique to estimate task effort collaboratively,
    fostering consensus and efficient planning.`,
    locale: 'en_US',
    siteName: 'www.corgiplanningpoker.com/',
    type: 'website',
    images: [
      '/images/corgi-planning-poker-preview.png',
      '/images/corgi-planning-poker-room-preview.png',
    ],
  },
  keywords:
    'planning poker, corgi planning poker,estimating poker, estimate points, agile, planning, Scrum poker, estimate task effort, estimating, service, room, create, efficient, consensus, fostering, agile, gamified, corgi game, planningpoker, nextjs, corgiplanningpoker',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={coda.className}>
        <Navbar />
        <Layout>{children}</Layout>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
