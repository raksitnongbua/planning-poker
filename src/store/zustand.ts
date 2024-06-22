import { getCookie } from 'cookies-next'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { UID_KEY } from '@/constant/cookies'
interface Loading  {
  open: boolean
  setLoadingOpen: (isOpen: boolean) => void
}

export const useLoadingStore = create<Loading>()(
  devtools(
    persist(
      (set) => ({
        open: false,
        setLoadingOpen: (isOpen: boolean) => set({ open: isOpen }),
      }),
      {
        name: 'loading-store',
      }
    ),
    {
      anonymousActionType: 'Loading Store',
    }
  )
)

interface UserInfo  {
  uid: string | null
  setUid: (uid: string) => void
}

export const useUserInfoStore = create<UserInfo>()(
  devtools(
    persist(
      (set) => ({
        uid: `${getCookie(UID_KEY)}`,
        setUid: (id) => set({ uid: id }),
      }),
      {
        name: 'user-info-store',
      }
    ),
    {
      anonymousActionType: 'User info Store',
    }
  )
)

