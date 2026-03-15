import { Metadata } from 'next'
import React from 'react'

import { RecentRooms as Component } from '@/components/RecentRooms'

export const metadata: Metadata = {
  title: 'Recent Rooms',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/recent-rooms',
    languages: {
      en: 'https://www.corgiplanningpoker.com/recent-rooms',
      th: 'https://www.corgiplanningpoker.com/recent-rooms?hl=th',
    },
  },
  robots: { index: false, follow: false },
}

const RecentRooms = async () => {
  return <Component />
}

export default RecentRooms
