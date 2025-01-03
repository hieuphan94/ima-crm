'use client';
import { Button, Result } from 'antd';

export default function Error({ error, reset }) {
  return (
    <Result
      status="error"
      title="Đã có lỗi xảy ra"
      subTitle={error.message}
      extra={[
        <Button key="retry" type="primary" onClick={reset}>
          Thử lại
        </Button>,
      ]}
    />
  );
} 