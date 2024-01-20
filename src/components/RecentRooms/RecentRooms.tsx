'use client'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { useLoadingStore, useUserInfoStore } from '@/store/zustand'
import { httpClient } from '@/utils/httpClient'

import NewRoomDialog from '../NewRoomDialog'
import { RoomInfo } from '../NewRoomDialog/types'
import { RoomHistory } from '../RoomHistory'
import { Room } from '../RoomHistory/RoomHistory'
import { Button } from '../ui/button'
import { useToast } from '../ui/use-toast'

const RecentRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [openNewRoomDialog, setOpenNewRoomDialog] = useState<boolean>(false)
  const { uid } = useUserInfoStore()
  const { setLoadingOpen } = useLoadingStore()
  const router = useRouter()
  const { toast } = useToast()

  const transformRoom = (data: any): Room[] => {
    if (!data) return []
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
        const errorMessage = (error as AxiosError).message

        toast({
          variant: 'destructive',
          title: 'Error',
          description: errorMessage,
          duration: 4000,
        })
      }
      setLoadingOpen(false)
    }
    fetchRooms()
  }, [setLoadingOpen, toast, uid])

  const handleClickJoinRoom = (roomId: string) => {
    router.push(`/room/${roomId}`)
  }

  const handleClickNewRoom = async (room: RoomInfo) => {
    setLoadingOpen(true)
    try {
      const res = await httpClient.post('/api/v1/new-room', {
        room_name: room.name,
        hosting_id: uid,
      })
      if (res.status === 200) {
        const roomId = res.data.room_id
        router.push(`/room/${roomId}`)
        setOpenNewRoomDialog(false)
      }
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.code === 'ERR_NETWORK') {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Sorry, the service is currently unavailable. Please try again later.',
          duration: 4000,
        })
      }
    }
    setLoadingOpen(false)
  }
  return (
    <main className="mx-auto flex max-w-screen-lg flex-col items-start justify-center gap-y-2 px-2 sm:px-8">
      <div className="flex w-full justify-between">
        <h2 className="text-2xl">Recent Rooms</h2>
        <Button onClick={() => setOpenNewRoomDialog(true)} variant="outline">
          New Room
        </Button>
      </div>
      <RoomHistory rooms={rooms} onClickJoinRoom={handleClickJoinRoom} />
      <NewRoomDialog
        open={openNewRoomDialog}
        onClose={() => setOpenNewRoomDialog(false)}
        onCreate={handleClickNewRoom}
      />
    </main>
  )
}

export default RecentRooms
