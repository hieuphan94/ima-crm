import { Inter } from 'next/font/google';
import Providers from './providers';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'IMA CRM',
  description: 'Tour Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="light" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}