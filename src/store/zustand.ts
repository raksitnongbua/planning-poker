import { getCookie } from 'cookies-next'
import { create } from 'zustand'

type Loading = {
  open: boolean
  setLoadingOpen: (isOpen: boolean) => void
}

export const useLoadingStore = create<Loading>((set) => ({
  open: false,
  setLoadingOpen: (isOpen) => set({ open: isOpen }),
}))

type UserInfo = {
  uid: string | null
  setUid: (uid: string) => void
}

export const useUserInfoStore = create<UserInfo>((set) => ({
  uid: `${getCookie('CPPUniID')}`,
  setUid: (id) => set({ uid: id }),
}))
