'use client';

import { Card, CardBody, CardHeader, Input, Button } from '@nextui-org/react';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { validateEmail, validatePassword } from '@/utils/validation';
import { handleLoginError } from '@/utils/errorHandler';
import { ImageOptimized } from '@/components/common/ImageOptimized';

export default function LoginPage() {
  const { login, loading: authLoading } = useAuth();
  const { notify } = useUI();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = () => {
    const isEmailValid = validateEmail(email, setErrors, notify);
    const isPasswordValid = validatePassword(password, setErrors, notify);
    return isEmailValid && isPasswordValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!validateForm()) {
        return;
      }

      const success = await login({ email, password });
      if (success) {
        notify('Đăng nhập thành công!', 'success');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      handleLoginError(error, notify);
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center min-h-screen">
      {/* Container cho cả logo và form */}
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo */}
        <div className="mb-8">
          <ImageOptimized
            src="/images/logo-ima.png"
            alt="IMA Logo"
            width={120}
            height={40}
            priority={true}
          />
        </div>

        {/* Form đăng nhập */}
        <Card className="w-full bg-transparent shadow-none">
          <CardHeader className="flex justify-center p-5">
            <h1 className="text-2xl font-bold">Đăng nhập</h1>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label="Email"
                placeholder="Nhập email của bạn"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => validateEmail(email, setErrors, notify)}
                isDisabled={authLoading}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
                required
                classNames={{
                  input: 'bg-white',
                  inputWrapper: 'bg-white',
                }}
              />
              <Input
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validatePassword(password, setErrors, notify)}
                isDisabled={authLoading}
                isInvalid={!!errors.password}
                errorMessage={errors.password}
                required
                classNames={{
                  input: 'bg-white',
                  inputWrapper: 'bg-white',
                }}
              />
              <Button type="submit" color="primary" className="w-full" isLoading={authLoading}>
                {authLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
