'use client';
import { useEffect, useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onFinish = async (values) => {
    try {
      await login(values);
      router.push('/dashboard');
    } catch (error) {
      message.error('Đăng nhập thất bại');
    }
  };

  if (!mounted) {
    return null; // hoặc loading placeholder
  }

  return (
    <Card title="Đăng nhập" className="w-full shadow-md">
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
        >
          <Input size="large" placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password size="large" placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" size="large" block>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
} 