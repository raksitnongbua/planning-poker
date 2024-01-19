'use client'
import React, { useEffect, useState } from 'react'
import { RoomHistory } from '../RoomHistory'
import { httpClient } from '@/utils/httpClient'
import { useLoadingStore, useUserInfoStore } from '@/store/zustand'
import { Room } from '../RoomHistory/RoomHistory'
import { useRouter } from 'next/navigation'

const RecentRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const { uid } = useUserInfoStore()
  const { setLoadingOpen } = useLoadingStore()
  const router = useRouter()

  const transformRoom = (data: any): Room[] => {
    const rooms: Room[] = data.map((room: any) => ({
      id: room.id,
      createdAt: new Date(room.created_at),
      updatedAt: new Date(room.updated_at),
      name: room.name,
      totalMembers: room.members.length,
    }))

    return rooms
  }

  useEffect(() => {
    if (!uid) return
    const fetchRooms = async () => {
      try {
        setLoadingOpen(true)
        const res = await httpClient.get(`/api/v1/room/recent-rooms/${uid}`)
        if (res.status === 200) {
          const newRooms = transformRoom(res.data.data)
          setRooms(newRooms)
        }
      } catch (error) {
        console.log(error)
      }
      setLoadingOpen(false)
    }
    fetchRooms()
  }, [setLoadingOpen, uid])

  const handleClickJoinRoom = (roomId: string) => {
    router.push(`/room/${roomId}`)
  }

  return (
    <main className="px-2 sm:px-8 gap-y-2 items-start max-w-screen-lg mx-auto flex flex-col justify-center">
      <h2 className="text-2xl">Recent Rooms</h2>
      <RoomHistory rooms={rooms} onClickJoinRoom={handleClickJoinRoom} />
    </main>
  )
}

export default RecentRooms
