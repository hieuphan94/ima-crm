export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN');
};

export const formatPhoneNumber = (phone) => {
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
};
