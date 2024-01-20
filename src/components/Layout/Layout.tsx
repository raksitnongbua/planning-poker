'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getCookie, hasCookie, setCookie } from 'cookies-next'
import React, { ReactNode, useEffect } from 'react'

import { useCustomSWR } from '@/lib/swr'
import { useLoadingStore, useUserInfoStore } from '@/store/zustand'

import Loading from '../Loading'

const UID_COOKIE_KEY = 'CPPUniID'

const Layout = ({ children }: { children: ReactNode }) => {
  const { setUid } = useUserInfoStore()
  const { open: isLoadingOpen, setLoadingOpen } = useLoadingStore()

  const { data, isLoading } = useCustomSWR(
    { url: '/api/v1/guest/sign-in' },
    {
      revalidateOnMount: !hasCookie(UID_COOKIE_KEY),
      fallbackData: { uuid: getCookie(UID_COOKIE_KEY) },
    }
  )

  useEffect(() => {
    if (!hasCookie(UID_COOKIE_KEY)) {
      setCookie(UID_COOKIE_KEY, data.uuid)
    }
    setUid(data.uuid)
  }, [data.uuid, setUid])

  useEffect(() => {
    setLoadingOpen(isLoading)
  }, [isLoading, setLoadingOpen])

  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
      <Loading open={isLoadingOpen} />
    </QueryClientProvider>
  )
}

export default Layout
