'use client'

import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

import { httpClient } from '@/utils/httpClient'
import { SECONDS } from '@/utils/time'

import ServiceStatus from '../ServiceStatus'
import { Button } from '../ui/button'

const Home = () => {
  const router = useRouter()

  const { isSuccess, isFetched } = useQuery({
    queryKey: ['health-check'],
    queryFn: async () => httpClient('/health'),
    refetchInterval: 20 * SECONDS,
    retry: false,
  })
  const status = !isFetched ? 'connecting' : isSuccess ? 'available' : 'unavailable'
  useEffect(() => router.prefetch('/new-room'), [router])

  return (
    <>
      <div className="flex min-h-[calc(100dvh-92px*2)] items-center justify-center">
        <div>
          <div className="my-5 grid max-w-[500px] gap-4">
            <h1 className="text-7xl font-bold">Corgi Planning Poker</h1>
            <h2 className="text-lg font-light">
              Agile teams use this gamified technique to estimate task effort collaboratively,
              fostering consensus and efficient planning.
            </h2>
          </div>
          <div className="flex gap-2">
            <Button className="h-11 w-52" onClick={() => router.push('/new-room')}>
              Create Room
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="size-11"
              id="button-recent-rooms"
              aria-label="Recent Rooms"
              onClick={() => router.push('/recent-rooms')}
            >
              <FontAwesomeIcon icon={faClockRotateLeft} className="size-5" />
            </Button>
          </div>
        </div>
        <Image
          src="/images/corgi-banner.png"
          className="invisible w-0 lg:visible lg:h-[477px] lg:w-[600px]"
          alt="corgi-logo"
          priority
          width={600}
          height={477}
        />
      </div>
      <ServiceStatus status={status} />
    </>
  )
}

export default Home
