'use client'
import { faRotateRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { getCookie, hasCookie, setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { DESK_CONFIG_KEY } from '@/constant/cookies'
import { useUserInfoStore } from '@/store/zustand'
import { httpClient } from '@/utils/httpClient'

import { CardConfigSelect } from '../CardConfigSelect'
import { DeskConfig } from '../CardConfigSelect/CardConfigSelect'
import { Button } from '../ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { useToast } from '../ui/use-toast'

const DEFAULT_DESK_CONFIG: DeskConfig = {
  id: 'default',
  displayName: '🃏 Default',
  value: '0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6',
}

const NewRoom = ({ }) => {
  const { uid } = useUserInfoStore()
  const { toast } = useToast()
  const router = useRouter()

  const [roomName, setRoomName] = useState<string>('Planning Room')
  const [deskSelectedId, setDeskSelectedId] = useState<string>('default')
  const [isRouting, setIsRouting] = useState<boolean>(false)
  const [options, setOptions] = useState<DeskConfig[]>([DEFAULT_DESK_CONFIG])

  const { mutate, isPending } = useMutation<{ room_id: string }, unknown, Record<string, unknown>>({
    mutationFn: (variables) =>
      httpClient.post('/api/v1/new-room', variables).then((res) => res.data),
    onSuccess(data) {
      const roomId = data.room_id
      router.push(`/room/${roomId}`)
      setIsRouting(true)
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

  useEffect(() => {
    if (!hasCookie(DESK_CONFIG_KEY) || options.length > 1) {
      return
    }
    try {
      const deskConfigCookie = getCookie(DESK_CONFIG_KEY)
      const cookieOptions = deskConfigCookie
        ?.split('&')
        .map((config) => JSON.parse(config) as DeskConfig)

      if (cookieOptions && cookieOptions.length > 0) {
        setOptions([...options, ...cookieOptions])
      }
    } catch (error) {
      console.error('Cannot fetch desk custom config:', error)
    }
  }, [options])

  const createRoom = () => {
    mutate({
      room_name: roomName,
      hosting_id: uid,
      desk_config: options.find((option) => option.id === deskSelectedId)?.value.trim(),
    })
  }

  const disabledInputs = isPending || isRouting

  const handleCreateCustomDesk = (deskName: string, deskValue: string) => {
    const newDeskConfig: DeskConfig = {
      id: uuidv4(),
      value: deskValue,
      displayName: deskName,
    }
    setOptions([...options, newDeskConfig])
    setDeskSelectedId(newDeskConfig.id)
    const deskConfig = getCookie(DESK_CONFIG_KEY)
    const mergedDeskConfig =
      (Boolean(deskConfig) ? `${deskConfig}&` : '') + JSON.stringify(newDeskConfig)
    setCookie(DESK_CONFIG_KEY, mergedDeskConfig)
  }
  return (
    <div className="flex min-h-[calc(100dvh-92px*2)] items-center justify-center">
      <Card className="w-full max-w-screen-sm">
        <CardHeader>
          <h2 className="text-xl">Create Room</h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label htmlFor="room-name">Room name</Label>
            <Input
              id="room-name"
              maxLength={25}
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              autoFocus
              disabled={disabledInputs}
              onKeyDown={(e) => e.code === 'Enter' && !isPending && createRoom()}
            />
            <Input
              id="room-name-forced-scale"
              className="scale-100"
              maxLength={25}
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              autoFocus
              disabled={disabledInputs}
              onKeyDown={(e) => e.code === 'Enter' && !isPending && createRoom()}
            />
          </div>
          <div>
            <Label>Desk</Label>
            <CardConfigSelect
              value={deskSelectedId}
              options={options}
              onValueChange={setDeskSelectedId}
              disabled={disabledInputs}
              onCreateCustomDesk={handleCreateCustomDesk}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={createRoom}
            disabled={disabledInputs || roomName === ''}
          >
            {disabledInputs && (
              <FontAwesomeIcon icon={faRotateRight} className="size-5 animate-spin" />
            )}
            Create Room
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default NewRoom
