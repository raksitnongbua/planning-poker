import React from 'react'
import { RecentRooms as Component } from '@/components/RecentRooms'

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recent Rooms',
}

const RecentRooms = () => {
  return <Component />
}

export default RecentRooms
