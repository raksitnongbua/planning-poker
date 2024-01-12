'use client'

import RoomComponent from '@/components/Room'
import { useParams } from 'next/navigation'
import React from 'react'

const Room = () => {
  const params = useParams()
  return <RoomComponent roomId={params.id.toString()} />
}

export default Room
