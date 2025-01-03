'use client';

import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { I18nextProvider } from 'react-i18next';
import { store } from '@/store';
import { theme } from '@/theme';
import i18n from '@/i18n';

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ConfigProvider theme={theme}>
          {children}
        </ConfigProvider>
      </I18nextProvider>
    </Provider>
  );
} 