import type { Metadata } from 'next'
import { Coda } from 'next/font/google'
import './globals.css'
import Layout from '@/components/Layout'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/Navbar'
import { Analytics } from '@vercel/analytics/react'

const coda = Coda({ weight: '400', display: 'swap', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Corgi Planning Poker | Make Estimating Agile Projects Accurate & Fun',
  description: 'Make Estimating Agile Projects Accurate & Fun',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <meta name="google-site-verification" content="DXrV5U7unID-E-I0UuoEMG_HupQaJbUrwhwTPMOTE54" />

      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content="corgi-planning-poker.vercel.app" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="Corgi Planning Poker | Make Estimating Agile Projects Accurate & Fun"
      />
      <meta
        name="title"
        content="Corgi Planning Poker | Make Estimating Agile Projects Accurate & Fun"
      />
      <meta
        name="description"
        content="Agile teams use this gamified technique to estimate task effort collaboratively, fostering consensus and efficient planning."
      />
      <meta
        name="keywords"
        content="planning poker, corgi planning poker,estimating poker, estimate points, agile, planning, Scrum poker, estimate task effort, estimating"
      />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="English" />
      <body className={coda.className}>
        <Navbar />
        <Layout>{children}</Layout>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
