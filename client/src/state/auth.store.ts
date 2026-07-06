import { create } from 'zustand';
import type { AuthResponse, UserProfile } from '@aegis/shared';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  setSession: (session: AuthResponse) => void;
  logout: () => void;
};

const stored = localStorage.getItem('aegis.session');
const parsed = stored ? (JSON.parse(stored) as Pick<AuthState, 'accessToken' | 'refreshToken' | 'user'>) : null;

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: parsed?.accessToken ?? null,
  refreshToken: parsed?.refreshToken ?? null,
  user: parsed?.user ?? null,
  setSession: (session) => {
    localStorage.setItem('aegis.session', JSON.stringify(session));
    set(session);
  },
  logout: () => {
    localStorage.removeItem('aegis.session');
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));
