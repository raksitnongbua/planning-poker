import { Metadata } from 'next'
import React from 'react'

import { RecentRooms as Component } from '@/components/RecentRooms'

export const metadata: Metadata = {
  title: 'Recent Rooms',
}

const RecentRooms = async () => {
  return <Component />
}

export default RecentRooms
