import Providers from './providers';
import 'antd/dist/reset.css';
import '@/styles/globals.css';

export const metadata = {
  title: 'IMA CRM',
  description: 'Tour Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}