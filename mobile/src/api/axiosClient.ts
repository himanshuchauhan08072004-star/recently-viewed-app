import axios from 'axios';
import { API_BASE_URL } from '@/constants/config';
import { useAuthStore } from '@/store/useAuthStore';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

axiosClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Invalid/expired token: drop session, fall back to guest mode
      // rather than crashing the app or looping requests.
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);
