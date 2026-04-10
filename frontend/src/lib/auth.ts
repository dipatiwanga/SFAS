import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface User {
  id: number;
  name: string;
  role: 'sales' | 'admin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialAuth: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false
};

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(initialAuth);

  // Load from localStorage on init
  if (browser) {
    const storedAuth = localStorage.getItem('sfas_auth');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        set({ ...parsed, isAuthenticated: !!parsed.token });
      } catch (e) {
        console.error('Failed to parse stored auth', e);
      }
    }
  }

  return {
    subscribe,
    login: (user: User, token: string) => {
      const newState = { user, token, isAuthenticated: true };
      set(newState);
      if (browser) {
        localStorage.setItem('sfas_auth', JSON.stringify(newState));
      }
    },
    logout: () => {
      set(initialAuth);
      if (browser) {
        localStorage.removeItem('sfas_auth');
      }
    }
  };
}

export const auth = createAuthStore();
