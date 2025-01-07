import { Inter } from 'next/font/google';
import Providers from './providers';
import { Toast } from '@/components/common/Toast'; // Import named
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'IMA CRM',
  description: 'Tour Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="light" suppressHydrationWarning>
      <body className={`${inter.className} relative min-h-screen`} suppressHydrationWarning>
        <Providers>
          <Toast />
          {children}
        </Providers>
      </body>
    </html>
  );
}
