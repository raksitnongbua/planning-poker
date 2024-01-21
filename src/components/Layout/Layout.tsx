'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getCookie, hasCookie } from 'cookies-next'
import React, { ReactNode, useEffect } from 'react'

import { UID_COOKIE_KEY } from '@/constant/cookies'
import { useLoadingStore, useUserInfoStore } from '@/store/zustand'

import Loading from '../Loading'
import Navbar from '../Navbar'

const Layout = ({ children }: { children: ReactNode }) => {
  const { open: isLoadingOpen } = useLoadingStore()
  const { setUid } = useUserInfoStore()
  const uid = String(getCookie(UID_COOKIE_KEY))

  useEffect(() => {
    if (!hasCookie(UID_COOKIE_KEY)) {
      setUid(uid)
    }
  }, [setUid, uid])

  return (
    <QueryClientProvider client={new QueryClient()}>
      <Navbar />
      {children}
      <Loading open={isLoadingOpen} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default Layout
