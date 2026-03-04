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
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.corgiplanningpoker.com/?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
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
  foundingDate: '2024',
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
  description: 'Free online planning poker for agile teams. Estimate story points collaboratively in real-time with your scrum team — no account, no install, ready in seconds.',
  openGraph: {
    title: 'Free Online Planning Poker | Corgi Planning Poker',
    description: 'Free online planning poker for agile teams. Estimate story points collaboratively in real-time — no registration required.',
    locale: 'en_US',
    siteName: 'Corgi Planning Poker',
    type: 'website',
    images: [
      {
        url: '/images/corgi-planning-poker-preview.png',
        width: 1200,
        height: 630,
        alt: 'Corgi Planning Poker — Free Online Planning Poker Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Planning Poker | Corgi Planning Poker',
    description: 'Free online planning poker for agile teams. Estimate story points collaboratively in real-time — no registration required.',
    images: ['/images/corgi-planning-poker-preview.png'],
  },
  keywords: 'planning poker, online planning poker, free planning poker, scrum poker, agile estimation, story points, sprint planning, planning poker online, scrum estimation',
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
