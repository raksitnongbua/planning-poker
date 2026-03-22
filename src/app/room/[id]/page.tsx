import type { Metadata } from 'next'
import { Viewport } from 'next'
import { getServerSession } from 'next-auth'
import React from 'react'

import { authOptions } from '@/app/api/auth/[...nextauth]/option'
import RoomComponent from '@/components/Room'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  return {
    title: 'Room',
    alternates: {
      canonical: `https://www.corgiplanningpoker.com/room/${params.id}`,
    },
    robots: { index: false, follow: false },
    openGraph: {
      title: 'Corgi Planning Poker | Room',
      description:
        'Join this planning poker room to estimate story points with your agile team in real-time. Supports Jira integration.',
      locale: 'en_US',
      siteName: 'Corgi Planning Poker',
      type: 'website',
      images: ['/images/corgi-planning-poker-room-preview.png'],
    },
  }
}

const Room = async (props: Props) => {
  const params = await props.params;
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
