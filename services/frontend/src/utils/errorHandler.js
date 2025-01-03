export const handleLoginError = (error, notify) => {
    if (error.response) {
        switch (error.response.status) {
            case 401:
                notify('Email hoặc mật khẩu không đúng', 'error');
                break;
            case 404:
                notify('Tài khoản không tồn tại', 'error');
                break;
            case 429:
                notify('Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau', 'error');
                break;
            default:
                notify('Đăng nhập thất bại. Vui lòng thử lại', 'error');
        }
    } else if (error.request) {
        notify('Không thể kết nối đến server', 'error');
    } else {
        notify(error.message || 'Đăng nhập thất bại', 'error');
    }
}; 