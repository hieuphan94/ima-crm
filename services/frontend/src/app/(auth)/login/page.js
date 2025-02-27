'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Input, Button } from '@nextui-org/react';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { validateEmail, validatePassword } from '@/utils/validation';
import { ImageOptimized } from '@/components/common/ImageOptimized';

export default function LoginPage() {
  const { login, loading: authLoading } = useAuth();
  const { notifySuccess, notifyError } = useUI();
  const router = useRouter();
  const { t } = useTranslation();
  const SUPPORT_EMAIL = 'dev@example.com';

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
    const isEmailValid = validateEmail(email, setErrors, notifyError);
    const isPasswordValid = validatePassword(password, setErrors, notifyError);
    return isEmailValid && isPasswordValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!validateForm()) {
        return;
      }

      const result = await login({ email, password });

      if (result.success) {
        notifySuccess(t('auth.loginSuccess'));
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.message?.includes('ERR_CONNECTION_REFUSED')) {
        notifyError(`${t('errors.serverError')}\n${t('errors.contactSupport')} ${SUPPORT_EMAIL}`);
      } else {
        notifyError(t('errors.loginFailed'));
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="relative overflow-hidden flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-8">
          <ImageOptimized
            src="/images/logo-ima.png"
            alt="IMA Logo"
            width={120}
            height={40}
            priority={true}
          />
        </div>

        <Card className="w-full bg-transparent shadow-none">
          <CardHeader className="flex justify-center p-5">
            <h1 className="text-2xl font-bold">{t('auth.login')}</h1>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                label={t('auth.email')}
                placeholder={t('auth.emailPlaceholder')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => validateEmail(email, setErrors, notifyError)}
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
                label={t('auth.password')}
                placeholder={t('auth.passwordPlaceholder')}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validatePassword(password, setErrors, notifyError)}
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
                {authLoading ? t('common.loading') : t('auth.login')}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
