'use client'
import { ReactNode, useEffect, useState } from 'react'

// Delays rendering until MSW is ready so the first requests are always intercepted.
// Only active in development — production renders children immediately.
export default function MSWProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(process.env.NEXT_PUBLIC_MSW_ENABLED !== 'true')

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_MSW_ENABLED !== 'true') return

    import('@/mocks').then(({ initMocks }) =>
      initMocks().then(() => setReady(true)),
    )
  }, [])

  if (!ready) return null

  return <>{children}</>
}
