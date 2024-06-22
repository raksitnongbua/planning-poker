'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getCookie, hasCookie } from 'cookies-next'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode, useEffect } from 'react'

import { UID_KEY } from '@/constant/cookies'
import { useLoadingStore, useUserInfoStore } from '@/store/zustand'

import { Footer } from '../Footer'
import Loading from '../Loading'
import Navbar from '../Navbar'

const Layout = ({ children }: { children: ReactNode }) => {
  const { open: isLoadingOpen } = useLoadingStore()
  const { setUid, uid } = useUserInfoStore()

  const cookieUID = String(getCookie(UID_KEY))

  useEffect(() => {
    if (!uid && cookieUID || uid !== cookieUID) {
      setUid(cookieUID)
    }

  }, [cookieUID, setUid, uid])

  return (
    <QueryClientProvider client={new QueryClient()}>
      <SessionProvider>
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 md:px-8">{children}</main>
        <Footer />
        <Loading open={isLoadingOpen} />
        <ReactQueryDevtools initialIsOpen={false} />
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default Layout
