export const validateEmail = (email, setErrors, notify) => {
  if (!email) {
    setErrors(prev => ({
      ...prev,
      email: 'Vui lòng nhập email'
    }));
    notify('Vui lòng nhập email', 'error');
    return false;
  }
  if (!email.includes('@')) {
    setErrors(prev => ({
      ...prev,
      email: 'Email không hợp lệ'
    }));
    notify('Email không hợp lệ', 'error');
    return false;
  }
  setErrors(prev => ({
    ...prev,
    email: ''
  }));
  return true;
};

export const validatePassword = (password, setErrors, notify) => {
  if (!password) {
    setErrors(prev => ({
      ...prev,
      password: 'Vui lòng nhập mật khẩu'
    }));
    notify('Vui lòng nhập mật khẩu', 'error');
    return false;
  }
  if (password.length < 6) {
    setErrors(prev => ({
      ...prev,
      password: 'Mật khẩu phải có ít nhất 6 ký tự'
    }));
    notify('Mật khẩu phải có ít nhất 6 ký tự', 'error');
    return false;
  }
  setErrors(prev => ({
    ...prev,
    password: ''
  }));
  return true;
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
}; 