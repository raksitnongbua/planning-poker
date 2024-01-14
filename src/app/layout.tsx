import type { Metadata } from 'next'
import { Coda } from 'next/font/google'
import './globals.css'
import Layout from '@/components/Layout'
import { Toaster } from '@/components/ui/toaster'
import Navbar from '@/components/Navbar'

const coda = Coda({ weight: '400', display: 'swap', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Planning Poker Online',
  description: 'Make Estimating Agile Projects Accurate & Fun',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={coda.className}>
        <Navbar />
        <Layout>{children}</Layout>
        <Toaster />
      </body>
    </html>
  )
}
