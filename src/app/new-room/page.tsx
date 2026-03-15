import type { Metadata } from 'next'
import { Viewport } from 'next'
import React from 'react'

import { NewRoom as NewRoomComponent } from '@/components/NewRoom'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'Create Room',
  description:
    'Create a free planning poker room in seconds. Invite your agile team with a single link — no registration required.',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/new-room',
    languages: {
      en: 'https://www.corgiplanningpoker.com/new-room',
      th: 'https://www.corgiplanningpoker.com/new-room?hl=th',
    },
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.corgiplanningpoker.com' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Create Room',
      item: 'https://www.corgiplanningpoker.com/new-room',
    },
  ],
}

const NewRoom = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <NewRoomComponent />
    </>
  )
}

export default NewRoom
