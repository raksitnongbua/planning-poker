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
  metadataBase: new URL('https://corgi-planning-poker.vercel.app'),
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
  applicationName: 'Corgi Planning Poker',
  title: {
    default: 'Corgi Planning Poker | Make Estimating Agile Projects',
    template: 'Corgi Planning Poker | %s',
  },
  description: `Agile teams use this gamified technique to estimate task effort collaboratively,
  fostering consensus and efficient planning.`,
  openGraph: {
    title: 'Corgi Planning Poker | Make Estimating Agile Projects',
    description: `Agile teams use this gamified technique to estimate task effort collaboratively,
    fostering consensus and efficient planning.`,
    locale: 'en_US',
    siteName: 'corgi-planning-poker.vercel.app',
    type: 'website',
    images: ['/images/Bitkub-Thailand-Cryptocurrency-Bitcoin-Exchange.jpg'],
  },
  keywords:
    'planning poker, corgi planning poker,estimating poker, estimate points, agile, planning, Scrum poker, estimate task effort, estimating, service, room, create, efficient, consensus, fostering, agile, gamified, corgi game, planningpoker, nextjs',
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
