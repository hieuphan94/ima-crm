import { authApi } from '@/services/api/auth';
import {
  changePasswordFailure,
  changePasswordStart,
  changePasswordSuccess,
  updateProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
} from '@/store/slices/profileSlice';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './useAuth';
import { useUI } from './useUI';

export const useProfile = () => {
  const dispatch = useDispatch();
  const { notifyError, notifySuccess } = useUI();
  const { logout } = useAuth();
  const { loading, error } = useSelector((state) => state.profile);

  const updateProfile = useCallback(
    async (userData) => {
      dispatch(updateProfileStart());
      try {
        const response = await authApi.updateProfile(userData);
        dispatch(updateProfileSuccess());
        notifySuccess('Cập nhật thông tin thành công');
        return response.data;
      } catch (error) {
        dispatch(updateProfileFailure(error.message));
        notifyError('Không thể cập nhật thông tin');
        throw error;
      }
    },
    [dispatch, notifySuccess, notifyError]
  );

  const changePassword = useCallback(
    async (passwordData) => {
      dispatch(changePasswordStart());
      try {
        const response = await authApi.changePassword(passwordData);
        dispatch(changePasswordSuccess());
        notifySuccess('Đổi mật khẩu thành công');
        return response.data;
      } catch (error) {
        dispatch(changePasswordFailure(error.message));
        notifyError('Không thể đổi mật khẩu');
        throw error;
      }
    },
    [dispatch, notifySuccess, notifyError]
  );

  return {
    loading,
    error,
    updateProfile,
    changePassword,
  };
};
