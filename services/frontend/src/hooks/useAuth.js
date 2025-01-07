'use client';

import { URLS } from '@/configs/urls';
import { useUI } from '@/hooks/useUI';
import axiosInstance from '@/services/axios';
import {
  loginFailure,
  loginStart,
  loginSuccess,
  logout as logoutAction,
} from '@/store/slices/authSlice';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => state.auth);
  const { notifySuccess, notifyError } = useUI();
  const { t } = useTranslation();

  // Hàm lấy token từ storage
  const getStoredToken = useCallback(() => {
    const token = Cookies.get('token') || localStorage.getItem('token');
    return token;
  }, []);

  // Hàm lấy thông tin user từ token
  const getUserFromToken = useCallback(async () => {
    const token = getStoredToken();

    if (!token) {
      dispatch(logoutAction());
      return null;
    }

    try {
      const response = await axiosInstance.get(URLS.AUTH.PROFILE);

      const userData = response.data;
      dispatch(loginSuccess({ token, user: userData }));
      return userData;
    } catch (error) {
      dispatch(logoutAction());
      return null;
    }
  }, [dispatch, getStoredToken]);

  // Kiểm tra và load user data khi component mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStoredToken();
      if (token && !auth.user) {
        await getUserFromToken();
      }
    };

    initializeAuth();
  }, [getUserFromToken, auth.user]); // Thêm dependencies

  const login = async ({ email, password }) => {
    try {
      dispatch(loginStart());

      const response = await axiosInstance.post(URLS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('token', token);
      Cookies.set('token', token);
      dispatch(loginSuccess({ token, user }));

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.log('Login error:', error);

      let errorMessage;

      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = t('auth.invalidCredentials');
            break;
          case 404:
            errorMessage = t('auth.userNotFound');
            break;
          default:
            errorMessage = error.response.data?.message || t('auth.loginFailed');
        }
      } else if (error.request) {
        errorMessage = t('errors.networkError');
      } else {
        errorMessage = t('auth.loginFailed');
      }

      dispatch(loginFailure(errorMessage));
      notifyError(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logoutHandler = useCallback(async () => {
    try {
      localStorage.removeItem('token');
      Cookies.remove('token');
      dispatch(logoutAction());
      notifySuccess(t('auth.logoutSuccess'));
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      notifyError(t('errors.logoutFailed'));
    }
  }, [dispatch, router, notifySuccess, notifyError, t]);

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    login,
    logout: logoutHandler,
    getUserFromToken,
  };
};
