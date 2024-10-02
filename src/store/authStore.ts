import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, PersistStorage } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    picture: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  hydrated: boolean;
  setUser: (userData: User, token: string) => void;
  clearUser: () => void;
  setHydrated: (state: boolean) => void;
}

const asyncStorage: PersistStorage<AuthState> = {
  getItem: async (name) => {
    const item = await AsyncStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hydrated: false,
      setUser: (userData: User, token: string) => set({ user: userData, token }),
      clearUser: () => set({ user: null, token: null }),
      setHydrated: (state: boolean) => set({ hydrated: state }),
    }),
    {
      name: 'auth-storage',
      storage: asyncStorage,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
