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
  title: 'Corgi Planning Poker | Make Estimating Agile Projects Accurate & Fun',
  description: 'Make Estimating Agile Projects Accurate & Fun',
  openGraph: {
    title: 'Corgi Planning Poker | Make Estimating Agile Projects Accurate & Fun',
    description: 'Make Estimating Agile Projects Accurate & Fun',
    locale: 'en_US',
    siteName: 'corgi-planning-poker.vercel.app',
    type: 'website',
  },
  keywords:
    'planning poker, corgi planning poker,estimating poker, estimate points, agile, planning, Scrum poker, estimate task effort, estimating',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta
          name="google-site-verification"
          content="DXrV5U7unID-E-I0UuoEMG_HupQaJbUrwhwTPMOTE54"
        />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </head>
      <body className={coda.className}>
        <Navbar />
        <Layout>{children}</Layout>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
