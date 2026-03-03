'use client'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getCookie } from 'cookies-next'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode, useEffect } from 'react'

import { UID_KEY } from '@/constant/cookies'
import { useLoadingStore, useUserInfoStore } from '@/store/zustand'
import { httpClient } from '@/utils/httpClient'
import { SECONDS } from '@/utils/time'

import { Footer } from '../Footer'
import Loading from '../Loading'
import Navbar from '../Navbar'
import ServiceStatus from '../ServiceStatus'

const AppShell = ({ children }: { children: ReactNode }) => {
  const { open: isLoadingOpen } = useLoadingStore()
  const { setUid, uid } = useUserInfoStore()
  const cookieUID = String(getCookie(UID_KEY))

  const { isSuccess, isFetched } = useQuery({
    queryKey: ['health-check'],
    queryFn: async () => httpClient('/health'),
    refetchInterval: 20 * SECONDS,
    retry: false,
  })
  const status = !isFetched ? 'connecting' : isSuccess ? 'available' : 'unavailable'

  useEffect(() => {
    if (!uid && cookieUID || uid !== cookieUID) {
      setUid(cookieUID)
    }
  }, [cookieUID, setUid, uid])

  return (
    <>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className="container mx-auto flex-1 px-4 sm:px-6 md:px-8">{children}</main>
        <Footer />
      </div>
      <Loading open={isLoadingOpen} />
      <ServiceStatus status={status} />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

const Layout = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    <SessionProvider>
      <AppShell>{children}</AppShell>
    </SessionProvider>
  </QueryClientProvider>
)

export default Layout
