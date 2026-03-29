'use client'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { getCookie } from 'cookies-next'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode, useEffect, useState } from 'react'

import { UID_KEY } from '@/constant/cookies'
import { useLoadingStore, useUserInfoStore } from '@/store/zustand'
import { httpClient } from '@/utils/httpClient'
import { SECONDS } from '@/utils/time'

import { Footer } from '../Footer'
import Loading from '../Loading'
import Navbar from '../Navbar'

const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? dynamic(() => import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })), { ssr: false })
    : () => null

// Routes that render bare — no navbar, footer, or status overlay
const BARE_ROUTES = ['/jira/callback', '/auth/callback']

const AppShell = ({ children }: { children: ReactNode }) => {
  const { open: isLoadingOpen } = useLoadingStore()
  const { setUid, uid } = useUserInfoStore()
  const cookieUID = String(getCookie(UID_KEY))
  const pathname = usePathname()
  const isBare = BARE_ROUTES.some((r) => pathname.startsWith(r))
  const isRoom = pathname.startsWith('/room/')

  const { isSuccess, isFetched } = useQuery({
    queryKey: ['health-check'],
    queryFn: async () => httpClient('/health'),
    refetchInterval: 20 * SECONDS,
    retry: false,
    enabled: !isBare,
  })
  const status = !isFetched ? 'connecting' : isSuccess ? 'available' : 'unavailable'

  useEffect(() => {
    if (cookieUID && cookieUID !== uid) {
      setUid(cookieUID)
    }
  }, [cookieUID, setUid, uid])

  if (isBare) {
    return <>{children}</>
  }

  return (
    <>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className={isRoom ? 'flex flex-1 flex-col overflow-hidden' : 'container mx-auto flex-1 px-4 sm:px-6 md:px-8'}>{children}</main>
        {!isRoom && <Footer status={status} />}
      </div>
      <Loading open={isLoadingOpen} />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}

const Layout = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider refetchOnWindowFocus={true}>
        <AppShell>{children}</AppShell>
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default Layout
