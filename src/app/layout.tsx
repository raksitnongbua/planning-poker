import type { Metadata } from 'next'
import { Coda } from 'next/font/google'
import './globals.css'
import Layout from '@/components/Layout'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/Navbar'
import { Analytics } from '@vercel/analytics/react'

import { config } from '@fortawesome/fontawesome-svg-core'
import Head from 'next/head'
config.autoAddCss = false

const coda = Coda({ weight: '400', display: 'swap', subsets: ['latin'] })

export const metadata: Metadata = {
  verification: {
    google: 'gPypTdWFwPXznnMm9vXjsR0CVA_-qx-JjzBSky6CgLY',
  },
  authors: {
    name: 'Raksit Nongbua',
  },
  applicationName: 'Corgi Planning Poker',
  icons: ['/favicon.ico', 'https://corgi-planning-poker.vercel.app/images/corgi-logo.png'],
  title: 'Corgi Planning Poker | Make Estimating Agile Projects',
  description: `Agile teams use this gamified technique to estimate task effort collaboratively,
  fostering consensus and efficient planning.`,
  openGraph: {
    title: 'Corgi Planning Poker | Make Estimating Agile Projects',
    description: `Agile teams use this gamified technique to estimate task effort collaboratively,
    fostering consensus and efficient planning.`,
    locale: 'en_US',
    siteName: 'corgi-planning-poker.vercel.app',
    type: 'website',
    images: ['https://corgi-planning-poker.vercel.app/images/corgi-logo.png'],
  },
  keywords:
    'planning poker, corgi planning poker,estimating poker, estimate points, agile, planning, Scrum poker, estimate task effort, estimating, service, room, create, efficient, consensus, fostering, agile, gamified, corgi game',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <Head>
        <meta itemProp="name">Corgi Planning Poker</meta>
        <meta
          itemProp="image"
          content="https://corgi-planning-poker.vercel.app/images/corgi-logo.png"
        />
      </Head>
      <body className={coda.className}>
        <Navbar />
        <Layout>{children}</Layout>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
