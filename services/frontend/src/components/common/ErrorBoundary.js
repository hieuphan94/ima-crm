'use client';
import { Component } from 'react';
import { Button, Result } from 'antd';

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
      errorInfo: null
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
      errorInfo: errorInfo
    });
  }

  // Hàm reset lại error state
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Đã có lỗi xảy ra"
          subTitle="Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại."
          extra={[
            <Button 
              key="reload" 
              type="primary" 
              onClick={this.handleReset}
            >
              Tải lại trang
            </Button>
          ]}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
