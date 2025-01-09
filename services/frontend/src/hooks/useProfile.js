import { authApi } from '@/services/api/auth';
import { loginSuccess } from '@/store/slices/authSlice';
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
import { useUI } from './useUI';

export const useProfile = () => {
  const dispatch = useDispatch();
  const { notifyError, notifySuccess } = useUI();
  const currentUser = useSelector((state) => state.auth.user);

  const updateProfile = useCallback(
    async (userData) => {
      dispatch(updateProfileStart());
      try {
        const response = await authApi.updateProfile(userData);
        dispatch(updateProfileSuccess());

        const updatedUser = {
          ...currentUser,
          ...userData,
        };

        dispatch(
          loginSuccess({
            user: updatedUser,
            token: localStorage.getItem('token'),
          })
        );

        notifySuccess('Cập nhật thông tin thành công');
        return response.data;
      } catch (error) {
        dispatch(updateProfileFailure(error.message));
        notifyError('Không thể cập nhật thông tin');
        throw error;
      }
    },
    [dispatch, notifySuccess, notifyError, currentUser]
  );

  const changePassword = useCallback(
    async ({ currentPassword, newPassword }) => {
      dispatch(changePasswordStart());
      try {
        const response = await authApi.changePassword({
          currentPassword,
          newPassword,
        });
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
    updateProfile,
    changePassword,
  };
};
