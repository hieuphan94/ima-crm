import { Providers } from './providers';
import '@/styles/globals.css';

export const metadata = {
  title: 'IMA CRM',
  description: 'Tour Management System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}