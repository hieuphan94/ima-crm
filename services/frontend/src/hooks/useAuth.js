import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout } from '@/store/slices/authSlice';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = useSelector((state) => {
    console.log('Auth state:', state.auth);
    return state.auth;
  });

  const login = async ({ email, password }) => {
    try {
      dispatch(loginStart());
      
      const response = await axios.post('http://localhost:3000/api/users/login', {
        email,
        password
      });

      console.log('API Response:', response);

      // Xử lý thành công
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      Cookies.set('token', token);
      dispatch(loginSuccess({ token, user }));
      return response.data;

    } catch (error) {
      console.error('Auth Error:', error);
      
      // Xử lý lỗi 401 (Unauthorized)
      if (error.response?.status === 401) {
        const errorMessage = 'Email hoặc mật khẩu không đúng';
        dispatch(loginFailure(errorMessage));
        throw new Error(errorMessage);
      }
      
      // Xử lý lỗi 404 (Not Found)
      if (error.response?.status === 404) {
        const errorMessage = 'Tài khoản không tồn tại';
        dispatch(loginFailure(errorMessage));
        throw new Error(errorMessage);
      }

      // Các lỗi khác
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
      dispatch(loginFailure(errorMessage));
      throw new Error(errorMessage);
    }
  };

  const handleLogout = () => {
    try {
      // Xóa token
      localStorage.removeItem('token');
      Cookies.remove('token');
      
      // Clear auth state
      dispatch(logout());
      
      // Redirect về trang login
      router.push('/login');
      
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    login,
    logout: handleLogout,
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    loading: auth.loading,
    error: auth.error
  };
}; 