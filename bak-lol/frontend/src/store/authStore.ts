import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student } from '../types';
import { MOCK_ME } from '../data/mock';

interface AuthState {
  user: Student | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: Student, token: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<Student>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),

      updateProfile: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'bak-lol-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Demo login helper — logs in with mock user without an API call
export const demoLogin = () => {
  useAuthStore.getState().login(MOCK_ME, 'demo-token');
};
