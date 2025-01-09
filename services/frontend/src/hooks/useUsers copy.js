import { authApi } from '@/services/api/auth';
import {
  adminChangeUserPasswordFailure,
  adminChangeUserPasswordStart,
  adminChangeUserPasswordSuccess,
  checkUserExistsFailure,
  checkUserExistsStart,
  checkUserExistsSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  fetchUsersFailure,
  fetchUsersStart,
  fetchUsersSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserStatusFailure,
  updateUserStatusStart,
  updateUserStatusSuccess,
  updateUserSuccess,
} from '@/store/slices/userSlice';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUI } from './useUI';

export const useUsers = () => {
  const dispatch = useDispatch();
  const { notifyError, notifySuccess } = useUI();
  const { users, filteredUsers, loading, error } = useSelector((state) => state.users);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    dispatch(fetchUsersStart());
    try {
      const response = await authApi.getUsers();
      const users = response?.data?.data?.users;
      if (!Array.isArray(users)) {
        throw new Error('Dữ liệu không hợp lệ');
      }
      const filteredUsers = users.filter((user) => user.role !== 'admin');
      dispatch(fetchUsersSuccess(filteredUsers));
    } catch (error) {
      dispatch(fetchUsersFailure(error.message));
      notifyError('Không thể tải danh sách người dùng');
    }
  }, [dispatch, notifyError]);

  // Update User
  const updateUser = useCallback(
    async (userId, userData) => {
      dispatch(updateUserStart());
      try {
        const response = await authApi.updateUser(userId, userData);
        const updatedUser = response?.data?.data;
        if (!updatedUser?.id) {
          throw new Error('Dữ liệu cập nhật không hợp lệ');
        }
        dispatch(updateUserSuccess(updatedUser));
        notifySuccess('Cập nhật thành công');
      } catch (error) {
        dispatch(updateUserFailure(error.message));
        notifyError('Không thể cập nhật người dùng');
      }
    },
    [dispatch, notifySuccess, notifyError]
  );

  // Update User Status
  const updateUserStatus = useCallback(
    async (userId, status) => {
      dispatch(updateUserStatusStart());
      try {
        const response = await authApi.updateUserStatus(userId, { status });
        if (!response?.data?.data?.status) {
          throw new Error('Trạng thái cập nhật không hợp lệ');
        }
        dispatch(updateUserStatusSuccess({ userId, status: response.data.data.status }));
        notifySuccess('Cập nhật trạng thái thành công');
      } catch (error) {
        dispatch(updateUserStatusFailure(error.message));
        notifyError('Không thể cập nhật trạng thái');
      }
    },
    [dispatch, notifySuccess, notifyError]
  );

  // Delete User
  const deleteUser = useCallback(
    async (userId) => {
      dispatch(deleteUserStart());
      try {
        await authApi.deleteUser(userId);
        dispatch(deleteUserSuccess(userId));
        notifySuccess('User deleted successfully');
      } catch (error) {
        console.error('Failed to delete user:', error);
        dispatch(deleteUserFailure(error.message));
        notifyError(error.message);
      }
    },
    [dispatch, notifySuccess, notifyError]
  );

  // Change Password
  const adminChangeUserPassword = useCallback(
    async (userId, passwordData) => {
      dispatch(adminChangeUserPasswordStart());
      try {
        const response = await authApi.changeUserPassword(userId, passwordData);
        console.log('Password change response:', response.data);

        const updatedAt = response.data.updatedAt || new Date().toISOString();

        dispatch(
          adminChangeUserPasswordSuccess({
            userId,
            updatedAt: updatedAt,
          })
        );
        notifySuccess('Đổi mật khẩu thành công');
        return response.data;
      } catch (error) {
        console.error('Failed to change password:', error);
        dispatch(adminChangeUserPasswordFailure(error.message));
        notifyError(error.message);
        throw error;
      }
    },
    [dispatch, notifySuccess, notifyError]
  );

  // Check User Exists
  const checkUserExists = useCallback(
    async (userId) => {
      dispatch(checkUserExistsStart());
      try {
        const response = await authApi.getUserById(userId);

        if (response?.data?.success === false) {
          dispatch(checkUserExistsFailure('User không tồn tại'));
          return false;
        }

        dispatch(checkUserExistsSuccess());
        return true;
      } catch (error) {
        dispatch(checkUserExistsFailure(error.message));

        // Kiểm tra các trường hợp lỗi cụ thể
        if (error.response?.status === 404 || error.response?.data?.success === false) {
          return false;
        }
        throw error;
      }
    },
    [dispatch]
  );

  return {
    users,
    filteredUsers,
    loading,
    error,
    fetchUsers,
    updateUser,
    updateUserStatus,
    deleteUser,
    adminChangeUserPassword,
    checkUserExists,
  };
};
