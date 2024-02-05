import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import React from 'react'

import { RecentRooms as Component } from '@/components/RecentRooms'

import { authOptions } from '../api/auth/[...nextauth]/route'

export const metadata: Metadata = {
  title: 'Recent Rooms',
}

const RecentRooms = async () => {
  const token = await getServerSession(authOptions)

  return <Component authId={token?.user?.id} />
}

export default RecentRooms
