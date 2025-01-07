import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { showNotification } from '@/store/slices/uiSlice';
import axios from 'axios';

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
      showNotification({
        message: error.response?.data?.message || 'An error occurred',
        type: 'error',
      })
    );

    return Promise.reject(error);
  }
);

export default axiosInstance;
