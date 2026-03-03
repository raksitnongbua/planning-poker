import { Metadata } from 'next'
import React from 'react'

import { RecentRooms as Component } from '@/components/RecentRooms'

export const metadata: Metadata = {
  title: 'Recent Rooms',
  alternates: {
    canonical: 'https://www.corgiplanningpoker.com/recent-rooms',
  },
  robots: { index: false, follow: false },
}

const RecentRooms = async () => {
  return <Component />
}

export default RecentRooms
