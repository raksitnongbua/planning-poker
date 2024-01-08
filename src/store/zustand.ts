import { create } from 'zustand';

type UserInfo = {
  uid: string | null;
  setUid: (uid: string) => void;
};

export const useUserInfoStore = create<UserInfo>((set) => ({
  uid: null,
  setUid: (id) => set({ uid: id }),
}));
