export const validateEmail = (email, setErrors, notifyError) => {
  if (!email) {
    setErrors((prev) => ({
      ...prev,
      email: 'Vui lòng nhập email',
    }));
    notifyError('Vui lòng nhập email');
    return false;
  }
  if (!email.includes('@')) {
    setErrors((prev) => ({
      ...prev,
      email: 'Email không hợp lệ',
    }));
    notifyError('Email không hợp lệ');
    return false;
  }
  setErrors((prev) => ({
    ...prev,
    email: '',
  }));
  return true;
};

export const validatePassword = (password, setErrors, notifyError) => {
  if (!password) {
    setErrors((prev) => ({
      ...prev,
      password: 'Vui lòng nhập mật khẩu',
    }));
    notifyError('Vui lòng nhập mật khẩu');
    return false;
  }
  if (password.length < 6) {
    setErrors((prev) => ({
      ...prev,
      password: 'Mật khẩu phải có ít nhất 6 ký tự',
    }));
    notifyError('Mật khẩu phải có ít nhất 6 ký tự');
    return false;
  }
  setErrors((prev) => ({
    ...prev,
    password: '',
  }));
  return true;
};

export const validateRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};
