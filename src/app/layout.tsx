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

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Corgi Planning Poker',
  url: 'https://www.corgiplanningpoker.com',
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Corgi Planning Poker',
  url: 'https://www.corgiplanningpoker.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.corgiplanningpoker.com/images/corgi-logo.png',
    width: 60,
    height: 60,
  },
  founder: { '@type': 'Person', name: 'Raksit Nongbua' },
  sameAs: ['https://github.com/raksitnongbua/planning-poker'],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'tan.raksit@gmail.com',
    contactType: 'customer support',
  },
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.corgiplanningpoker.com'),
  alternates: {
    canonical: '/',
  },
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
    default: 'Free Online Planning Poker | Corgi Planning Poker',
    template: 'Corgi Planning Poker | %s',
  },
  description: 'Free online planning poker tool for agile teams. Estimate story points collaboratively in real-time with your scrum team — no registration required.',
  openGraph: {
    title: 'Corgi Planning Poker | The Easiest Way To Explain Story Points',
    description: 'Free online planning poker tool for agile teams. Estimate story points collaboratively in real-time — no registration required.',
    locale: 'en_US',
    siteName: 'Corgi Planning Poker',
    type: 'website',
    images: ['/images/corgi-planning-poker-preview.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/images/corgi-planning-poker-preview.png'],
  },
  keywords: 'planning poker, scrum poker, story points, agile estimation, sprint planning, free planning poker, online planning poker',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={coda.className}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <Layout>{children}</Layout>
        <SpeedInsights />
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
