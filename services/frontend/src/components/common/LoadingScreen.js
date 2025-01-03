'use client';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';

/**
 * LoadingScreen Component hiển thị trạng thái loading
 * Có thể sử dụng độc lập hoặc kết hợp với Redux state
 * @param {Object} props
 * @param {boolean} props.loading - Optional prop để control loading state
 */
const LoadingScreen = ({ loading: propLoading }) => {
  // Lấy loading state từ Redux store (optional)
  const globalLoading = useSelector((state) => state.ui?.isLoading);
  
  // Ưu tiên prop loading, nếu không có thì dùng global loading
  const isLoading = propLoading !== undefined ? propLoading : globalLoading;

  // Nếu không loading thì return null
  if (!isLoading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
        zIndex: 9999, // Ensure it's above other elements
      }}
    >
      <Spin 
        size="large"
        tip="Đang tải..."
      />
    </div>
  );
};

export default LoadingScreen;
