import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import React from 'react'

import { authOptions } from '@/app/api/auth/[...nextauth]/option'
import RoomComponent from '@/components/Room'

interface Props {
  params: { id: string }
}

export const metadata: Metadata = {
  title: 'Room',
  alternates: {
    canonical: '/room',
  },
  openGraph: {
    title: 'Corgi Planning Poker | Room',
    description: `Agile teams use this gamified technique to estimate task effort collaboratively,
    fostering consensus and efficient planning.`,
    locale: 'en_US',
    siteName: 'www.corgiplanningpoker.com/room',
    type: 'website',
    images: ['/images/corgi-planning-poker-room-preview.png'],
  },
}

const Room = async ({ params }: Props) => {
  const session = await getServerSession(authOptions)
  const user = session?.user

  return (
    <RoomComponent
      roomId={params.id.toString()}
      sessionId={user?.id}
      avatar={user?.image}
      userName={user?.name}
    />
  )
}

export default Room
