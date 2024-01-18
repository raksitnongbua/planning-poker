'use client'
import React from 'react'
import { RoomHistory } from '../RoomHistory'

export interface RecentRoomsProps {
  // types...
}

const RecentRooms: React.FC<RecentRoomsProps> = ({}) => {
  return (
    <main className="px-2 sm:px-8 gap-y-2 items-start max-w-screen-lg mx-auto flex flex-col justify-center">
      <h2 className="text-2xl">RecentRooms</h2>
      <RoomHistory />
    </main>
  )
}

export default RecentRooms
