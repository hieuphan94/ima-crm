import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  filteredUsers: [],
  loading: false,
  loadingUserIds: {
    edit: [], // Chỉnh sửa user
    status: [], // Thay đổi trạng thái
    password: [], // Đổi mật khẩu
    delete: [], // Xóa user
    check: [], // Check user exists
  },
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // Fetch users
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = Array.isArray(action.payload) ? action.payload : [];
      state.filteredUsers = Array.isArray(action.payload) ? action.payload : [];
    },
    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update user
    updateUserStart: (state, action) => {
      state.loadingUserIds.edit.push(action.payload);
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      const updatedUser = action.payload;
      state.loadingUserIds.edit = state.loadingUserIds.edit.filter((id) => id !== updatedUser.id);
      if (!updatedUser?.id) return;
      state.users = state.users.map((user) => (user.id === updatedUser.id ? updatedUser : user));
      state.filteredUsers = state.filteredUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
    },
    updateUserFailure: (state, action) => {
      const { userId, error } = action.payload;
      state.loadingUserIds.edit = state.loadingUserIds.edit.filter((id) => id !== userId);
      state.error = error;
    },

    // Update user status
    updateUserStatusStart: (state, action) => {
      state.loadingUserIds.status.push(action.payload);
      state.error = null;
    },
    updateUserStatusSuccess: (state, action) => {
      const { userId, status } = action.payload;
      state.loadingUserIds.status = state.loadingUserIds.status.filter((id) => id !== userId);
      if (!userId || !status) return;
      state.users = state.users.map((user) => (user.id === userId ? { ...user, status } : user));
      state.filteredUsers = state.filteredUsers.map((user) =>
        user.id === userId ? { ...user, status } : user
      );
    },
    updateUserStatusFailure: (state, action) => {
      const { userId, error } = action.payload;
      state.loadingUserIds.status = state.loadingUserIds.status.filter((id) => id !== userId);
      state.error = error;
    },

    // Delete user
    deleteUserStart: (state, action) => {
      state.loadingUserIds.delete.push(action.payload);
      state.error = null;
    },
    deleteUserSuccess: (state, action) => {
      const userId = action.payload;
      state.loadingUserIds.delete = state.loadingUserIds.delete.filter((id) => id !== userId);
      state.users = state.users.filter((user) => user.id !== userId);
      state.filteredUsers = state.filteredUsers.filter((user) => user.id !== userId);
    },
    deleteUserFailure: (state, action) => {
      const { userId, error } = action.payload;
      state.loadingUserIds.delete = state.loadingUserIds.delete.filter((id) => id !== userId);
      state.error = error;
    },

    // Change password
    adminChangeUserPasswordStart: (state, action) => {
      state.loadingUserIds.password.push(action.payload);
      state.error = null;
    },
    adminChangeUserPasswordSuccess: (state, action) => {
      const { userId, updatedAt } = action.payload;
      state.loadingUserIds.password = state.loadingUserIds.password.filter((id) => id !== userId);
      state.users = state.users.map((user) => (user.id === userId ? { ...user, updatedAt } : user));
      state.filteredUsers = state.filteredUsers.map((user) =>
        user.id === userId ? { ...user, updatedAt } : user
      );
    },
    adminChangeUserPasswordFailure: (state, action) => {
      const { userId, error } = action.payload;
      state.loadingUserIds.password = state.loadingUserIds.password.filter((id) => id !== userId);
      state.error = error;
    },

    // Check user exists
    checkUserExistsStart: (state, action) => {
      state.loadingUserIds.check.push(action.payload);
      state.error = null;
    },
    checkUserExistsSuccess: (state, action) => {
      const userId = action.payload;
      state.loadingUserIds.check = state.loadingUserIds.check.filter((id) => id !== userId);
    },
    checkUserExistsFailure: (state, action) => {
      const { userId, error } = action.payload;
      state.loadingUserIds.check = state.loadingUserIds.check.filter((id) => id !== userId);
      state.error = error;
    },
  },
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  updateUserStatusStart,
  updateUserStatusSuccess,
  updateUserStatusFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  adminChangeUserPasswordStart,
  adminChangeUserPasswordSuccess,
  adminChangeUserPasswordFailure,
  checkUserExistsStart,
  checkUserExistsSuccess,
  checkUserExistsFailure,
} = userSlice.actions;

export default userSlice.reducer;
