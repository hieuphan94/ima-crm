import { useSelector, useDispatch } from 'react-redux';
import { setUser, logout } from '@/store/slices/authSlice';
import { authApi } from '@/services/api/auth';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const login = async (credentials) => {
    try {
      const response = await authApi.login(credentials);
      dispatch(setUser(response.data));
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await authApi.logout();
      dispatch(logout());
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout: logoutUser,
  };
}; 