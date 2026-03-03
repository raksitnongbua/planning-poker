import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import React from 'react'

import { authOptions } from '@/app/api/auth/[...nextauth]/option'
import RoomComponent from '@/components/Room'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Room',
    alternates: {
      canonical: `https://www.corgiplanningpoker.com/room/${params.id}`,
    },
    robots: { index: false, follow: false },
    openGraph: {
      title: 'Corgi Planning Poker | Room',
      description:
        'Join this planning poker room to estimate story points with your agile team in real-time.',
      locale: 'en_US',
      siteName: 'Corgi Planning Poker',
      type: 'website',
      images: ['/images/corgi-planning-poker-room-preview.png'],
    },
  }
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
