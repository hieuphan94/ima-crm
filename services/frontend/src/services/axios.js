import axios from 'axios';
import { store } from '@/store';
import { setError } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
    }

    store.dispatch(
      setError({
        message: error.response?.data?.message || 'An error occurred',
        status: error.response?.status,
      })
    );

    return Promise.reject(error);
  }
);

export default axiosInstance;
