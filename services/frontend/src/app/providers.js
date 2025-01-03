'use client';

import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 4,
  },
};

export function Providers({ children }) {
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