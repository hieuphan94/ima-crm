'use client';
import { Component } from 'react';
import { Button } from '@nextui-org/react';

/**
 * ErrorBoundary Component để bắt lỗi trong React tree
 * Được sử dụng bằng cách wrap các components cần catch error
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  // Được gọi khi có lỗi xảy ra trong child components
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Được gọi sau khi có lỗi, dùng để log error
  componentDidCatch(error, errorInfo) {
    // Log error vào service như Sentry hoặc console
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  // Hàm reset lại error state
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-4">Đã có lỗi xảy ra</h1>
          <p className="mb-8">Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.</p>
          <Button color="primary" onClick={this.handleReset}>
            Tải lại trang
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
