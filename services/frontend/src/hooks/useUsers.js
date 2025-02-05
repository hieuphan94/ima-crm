import { authApi } from '@/api/auth/auth';
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
  const { users, filteredUsers, loading, loadingUserIds, error } = useSelector(
    (state) => state.users
  );

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
      dispatch(updateUserStart(userId));
      try {
        const response = await authApi.updateUser(userId, userData);
        const updatedUser = response?.data?.data;
        if (!updatedUser?.id) {
          throw new Error('Dữ liệu cập nhật không hợp lệ');
        }
        dispatch(updateUserSuccess(updatedUser));
        notifySuccess('Cập nhật thành công');
      } catch (error) {
        dispatch(updateUserFailure({ userId, error: error.message }));
        notifyError('Không thể cập nhật người dùng');
      }
    },
    [dispatch, notifySuccess, notifyError]
  );

  // Update User Status
  const updateUserStatus = useCallback(
    async (userId, status) => {
      if (loadingUserIds.status.includes(userId)) return false;

      dispatch(updateUserStatusStart(userId));
      try {
        const response = await authApi.updateUserStatus(userId, { status });

        // Kiểm tra response status thay vì response.data.success
        if (response.status >= 200 && response.status < 300) {
          dispatch(
            updateUserStatusSuccess({
              userId,
              status,
              updatedAt: new Date().toISOString(),
            })
          );

          notifySuccess('Thay đổi trạng thái thành công');
          await fetchUsers(); // Refresh lại danh sách để đồng bộ
          return true;
        } else {
          throw new Error('Không thể thay đổi trạng thái');
        }
      } catch (error) {
        dispatch(updateUserStatusFailure({ userId, error: error.message }));
        notifyError(error.message || 'Không thể thay đổi trạng thái');
        return false;
      }
    },
    [dispatch, notifySuccess, notifyError, fetchUsers]
  );

  // Delete User
  const deleteUser = useCallback(
    async (userId) => {
      dispatch(deleteUserStart(userId));
      try {
        await authApi.deleteUser(userId);
        dispatch(deleteUserSuccess(userId));
        notifySuccess('Xóa người dùng thành công');
      } catch (error) {
        dispatch(deleteUserFailure({ userId, error: error.message }));
        notifyError('Không thể xóa người dùng');
      }
    },
    [dispatch, notifySuccess, notifyError]
  );

  // Change Password
  const adminChangeUserPassword = useCallback(
    async (userId, passwordData) => {
      dispatch(adminChangeUserPasswordStart(userId));
      try {
        const response = await authApi.changeUserPassword(userId, passwordData);
        const updatedAt = response.data.updatedAt || new Date().toISOString();

        dispatch(
          adminChangeUserPasswordSuccess({
            userId,
            updatedAt,
          })
        );
        notifySuccess('Đổi mật khẩu thành công');
        return response.data;
      } catch (error) {
        dispatch(adminChangeUserPasswordFailure({ userId, error: error.message }));
        notifyError('Không thể đổi mật khẩu');
        throw error;
      }
    },
    [dispatch, notifySuccess, notifyError]
  );

  // Check User Exists
  const checkUserExists = useCallback(
    async (userId) => {
      dispatch(checkUserExistsStart(userId));
      try {
        const response = await authApi.getUserById(userId);
        if (response?.data?.success === false) {
          dispatch(checkUserExistsFailure({ userId, error: 'User không tồn tại' }));
          return false;
        }
        dispatch(checkUserExistsSuccess(userId));
        return true;
      } catch (error) {
        dispatch(checkUserExistsFailure({ userId, error: error.message }));
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
    loadingUserIds,
    error,
    fetchUsers,
    updateUser,
    updateUserStatus,
    deleteUser,
    adminChangeUserPassword,
    checkUserExists,
  };
};
