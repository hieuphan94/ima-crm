import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  filteredUsers: [],
  loading: false,
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
    updateUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserSuccess: (state, action) => {
      state.loading = false;
      const updatedUser = action.payload;
      if (!updatedUser?.id) return;
      state.users = state.users.map((user) => (user.id === updatedUser.id ? updatedUser : user));
      state.filteredUsers = state.filteredUsers.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update user status
    updateUserStatusStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateUserStatusSuccess: (state, action) => {
      state.loading = false;
      const { userId, status } = action.payload;
      if (!userId || !status) return;
      state.users = state.users.map((user) => (user.id === userId ? { ...user, status } : user));
      state.filteredUsers = state.filteredUsers.map((user) =>
        user.id === userId ? { ...user, status } : user
      );
    },
    updateUserStatusFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete user
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteUserSuccess: (state, action) => {
      state.loading = false;
      // Xóa user khỏi cả hai mảng
      const userId = action.payload;
      state.users = state.users.filter((user) => user.id !== userId);
      state.filteredUsers = state.filteredUsers.filter((user) => user.id !== userId);
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Change password
    adminChangeUserPasswordStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    adminChangeUserPasswordSuccess: (state, action) => {
      state.loading = false;
      const { userId, updatedAt } = action.payload;
      state.users = state.users.map((user) => (user.id === userId ? { ...user, updatedAt } : user));
    },
    adminChangeUserPasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Check user exists
    checkUserExistsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    checkUserExistsSuccess: (state) => {
      state.loading = false;
    },
    checkUserExistsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
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
