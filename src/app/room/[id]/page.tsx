import RoomComponent from '@/components/Room'
import { Metadata } from 'next'
import React from 'react'

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

const Room = ({ params }: Props) => {
  return <RoomComponent roomId={params.id.toString()} />
}

export default Room
