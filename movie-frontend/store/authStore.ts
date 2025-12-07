import { create } from 'zustand';

type AuthState = {
  user: any;
  accessToken: string | null;
  refreshToken: string | null;
  hydrated: boolean;
  setAuth: (data: any) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  hydrated: false,

  setAuth: (data) => {
    set({
      user: data.user ?? data,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      hydrated: true,
    });
  },

logout: () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  set({
    user: null,
    accessToken: null,
    refreshToken: null,
    hydrated: true,
  });
},


  hydrate: () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    set({
      accessToken,
      refreshToken,
      user: accessToken ? { loggedIn: true } : null,
      hydrated: true,
    });
  },
}));
