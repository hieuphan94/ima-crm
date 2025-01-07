export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN');
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const formatPhoneNumber = (phone) => {
  return phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
};
