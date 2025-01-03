'use client';

import { NextUIProvider } from '@nextui-org/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { store } from '@/store';
import i18n from '@/i18n';
import { useEffect, useState } from 'react';
import { Toast } from '@/components/common/Toast';

export default function Providers({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <NextUIProvider>
          {children}
          <Toast />
        </NextUIProvider>
      </I18nextProvider>
    </Provider>
  );
} 