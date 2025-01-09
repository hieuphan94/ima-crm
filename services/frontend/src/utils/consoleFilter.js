'use client';

// Đảm bảo code chỉ chạy ở client side và trong development mode
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Lưu lại các hàm console gốc
  const originalConsoleWarn = console.warn.bind(console);
  const originalConsoleError = console.error.bind(console);

  // Override console.warn
  console.warn = (...args) => {
    // Lọc các warning về auto-scroll
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Skipping auto-scroll') ||
        args[0].includes('<Item> with non-plain text contents is unsupported'))
    ) {
      return;
    }
    originalConsoleWarn(...args);
  };

  // Override console.error với xử lý đặc biệt cho redux-persist
  console.error = (...args) => {
    const errorMessage = args[0]?.toString() || '';

    // Kiểm tra cụ thể message của redux-persist
    if (
      errorMessage.includes(
        'redux-persist failed to create sync storage. falling back to noop storage.'
      )
    ) {
      return;
    }

    originalConsoleError(...args);
  };
}
