import type { Metadata } from 'next'
import { Coda } from 'next/font/google'
import './globals.css'
import Layout from '@/components/Layout'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/Navbar'
import { Analytics } from '@vercel/analytics/react'

const coda = Coda({ weight: '400', display: 'swap', subsets: ['latin'] })

export const metadata: Metadata = {
  verification: {
    google: 'gPypTdWFwPXznnMm9vXjsR0CVA_-qx-JjzBSky6CgLY',
  },
  authors: {
    name: 'Raksit Nongbua',
  },
  applicationName: 'Corgi Planning Poker',
  icons: {
    icon: 'https://corgi-planning-poker.vercel.app/_next/image?url=%2Fimages%2Fcorgi-logo.png&w=128&q=75',
    apple:
      'https://corgi-planning-poker.vercel.app/_next/image?url=%2Fimages%2Fcorgi-logo.png&w=128&q=75',
  },
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
  },
  keywords:
    'planning poker, corgi planning poker,estimating poker, estimate points, agile, planning, Scrum poker, estimate task effort, estimating, service, room, create, efficient, consensus, fostering, agile, gamified, corgi game',
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
