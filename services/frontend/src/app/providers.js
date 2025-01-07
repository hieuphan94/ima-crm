'use client';

import { NextUIProvider } from '@nextui-org/react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { I18nextProvider } from 'react-i18next';
import { store, persistor } from '@/store';
import i18n from '@/i18n';
import { useEffect, useState } from 'react';
import { Toast } from '@/components/common/Toast';

import '@/utils/consoleFilter';

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
      <PersistGate loading={null} persistor={persistor}>
        <I18nextProvider i18n={i18n}>
          <NextUIProvider>
            {children}
            <Toast />
          </NextUIProvider>
        </I18nextProvider>
      </PersistGate>
    </Provider>
  );
}
