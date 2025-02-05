import axiosInstance from '@/api/config/axios';

export const authApi = {
  // Public routes
  login: (data) => axiosInstance.post('/users/login', data),
  register: (data) => axiosInstance.post('/users/register', data),

  // Protected routes (require auth)
  getProfile: () => axiosInstance.get('/users/profile'),
  updateProfile: (data) => axiosInstance.put('/users/profile', data),
  changePassword: (data) => axiosInstance.put('/users/change-password', data),

  // Admin only routes
  getUsers: () => axiosInstance.get('/users/users'),
  getUserById: (userId) => axiosInstance.get(`/users/users/${userId}`),
  updateUser: (userId, data) => axiosInstance.put(`/users/users/${userId}`, data),
  updateUserStatus: (userId, data) => axiosInstance.put(`/users/users/${userId}/status`, data),
  deleteUser: (userId) => axiosInstance.delete(`/users/users/${userId}`),
  changeUserPassword: (userId, data) =>
    axiosInstance.put(`/users/users/${userId}/change-password`, data),
};
