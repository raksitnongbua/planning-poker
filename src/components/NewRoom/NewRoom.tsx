'use client'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import { useUserInfoStore } from '@/store/zustand'
import { httpClient } from '@/utils/httpClient'

import { Button } from '../ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Input } from '../ui/input'
import { useToast } from '../ui/use-toast'

const NewRoom = ({}) => {
  const [roomName, setRoomName] = useState<string>('')
  const { uid } = useUserInfoStore()
  const { toast } = useToast()
  const router = useRouter()

  const { mutate, isPending } = useMutation<{ room_id: string }, unknown, Record<string, unknown>>({
    mutationFn: (variables) =>
      httpClient.post('/api/v1/new-room', variables).then((res) => res.data),
    onSuccess(data) {
      const roomId = data.room_id
      router.push(`/room/${roomId}`)
    },
    onError(error) {
      const axiosError = error as AxiosError
      if (axiosError.code === 'ERR_NETWORK') {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Sorry, the service is currently unavailable. Please try again later.',
          duration: 4000,
        })
      }
    },
  })

  const createRoom = () => {
    mutate({
      room_name: roomName,
      hosting_id: uid,
    })
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <Card className="w-full max-w-prose">
        <CardHeader>
          <h2 className="text-xl">Create Room</h2>
        </CardHeader>
        <CardContent>
          <Input
            maxLength={25}
            placeholder="Room Name"
            onChange={(e) => setRoomName(e.target.value)}
            disabled={isPending}
            onKeyDown={(e) => e.code === 'Enter' && !isPending && createRoom()}
          />
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full gap-2" onClick={createRoom} disabled={isPending}>
            {isPending && <FontAwesomeIcon icon={faRotateRight} className="size-5 animate-spin" />}
            Create Room
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NewRoom
