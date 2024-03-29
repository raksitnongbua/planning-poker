import './globals.css'

import { config } from '@fortawesome/fontawesome-svg-core'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Coda } from 'next/font/google'

import Layout from '@/components/Layout'
import { Toaster } from '@/components/ui/toaster'

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
    icon: ['/favicon-48.ico', '/favicon-96.ico', '/favicon-144.ico'],
  },
  applicationName: 'Corgi Planning Poker',
  title: {
    default: 'Corgi Planning Poker',
    template: 'Corgi Planning Poker | %s',
  },
  description: `Agile teams use this gamified technique to estimate task effort collaboratively,
  fostering consensus and efficient planning.`,
  openGraph: {
    title: 'Corgi Planning Poker | The Easiest Way To Explain Story Points',
    description: `Agile teams use this gamified technique to estimate task effort collaboratively,
    fostering consensus and efficient planning.`,
    locale: 'en_US',
    siteName: 'Corgi Planning Poker',
    type: 'website',
    images: [
      '/images/corgi-planning-poker-preview.png',
      '/images/corgi-planning-poker-room-preview.png',
    ],
  },
  keywords:
    'planning poker, corgi planning poker,estimating poker, estimate points, agile, planning, scrum poker, estimate task effort, estimating, service, room, create, efficient, consensus, fostering, agile, gamified, corgi game, planningpoker, nextjs, corgiplanningpoker, story points estimates',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={coda.className}>
        <Layout>{children}</Layout>
        <SpeedInsights />
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
