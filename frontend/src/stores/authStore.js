import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await axios.post(`${API_URL}/auth/login`, { email, password });
          const { access_token, user } = response.data;
          set({ token: access_token, user, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.detail || 'Login failed' };
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await axios.post(`${API_URL}/auth/register`, userData);
          const { access_token, user } = response.data;
          set({ token: access_token, user, isLoading: false });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.response?.data?.detail || 'Registration failed' };
        }
      },

      logout: () => {
        set({ user: null, token: null });
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          set({ isLoading: false });
          return;
        }

        try {
          const response = await axios.get(`${API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ user: response.data, isLoading: false });
        } catch (error) {
          set({ user: null, token: null, isLoading: false });
        }
      },

      updateProfile: async (updates) => {
        const token = get().token;
        try {
          const response = await axios.put(`${API_URL}/users/me`, updates, {
            headers: { Authorization: `Bearer ${token}` }
          });
          set({ user: response.data });
          return { success: true };
        } catch (error) {
          return { success: false, error: error.response?.data?.detail };
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
