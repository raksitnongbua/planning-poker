'use client'

import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

import { useCustomSWR } from '@/lib/swr'
import { TO_SECONDS } from '@/utils/time'

import ServiceStatus from '../ServiceStatus'
import { Button } from '../ui/button'

const Home = () => {
  const router = useRouter()

  const { error, isLoading, data } = useCustomSWR(
    { url: '/health' },
    { refreshInterval: 20 * TO_SECONDS, revalidateOnFocus: false }
  )
  const status = isLoading
    ? 'connecting'
    : Boolean(error) || !Boolean(data)
      ? 'unavailable'
      : 'available'

  useEffect(() => router.prefetch('/new-room'), [router])

  return (
    <main className="flex h-[75vh] flex-col justify-center px-4">
      <div className="mt-2 flex h-full items-center justify-center sm:mt-6">
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
    </main>
  )
}

export default Home
