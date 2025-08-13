// stores/useUserStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userId: string | null;
  phoneNumber: number;
  fcmToken?: string;
  setUserId: (id: string) => void;
  setPhoneNumber: (phoneNumber: number) => void;
  setFcmToken: (token: string) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: null,
      phoneNumber: 0,
      fcmToken: undefined,

      setUserId: (id) => set({ userId: id }),
      setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
      setFcmToken: (token) => set({ fcmToken: token }),

      reset: () =>
        set({
          userId: null,
          phoneNumber: 0,
          fcmToken: undefined,
        }),
    }),
    {
      name: 'user-storage', // localStorage/AsyncStorage key
    }
  )
);
