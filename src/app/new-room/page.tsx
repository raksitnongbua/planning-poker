import { Viewport } from 'next'
import React from 'react'

import { NewRoom as NewRoomComponent } from '@/components/NewRoom'


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

const NewRoom = () => {
  return <NewRoomComponent />
}

export default NewRoom
