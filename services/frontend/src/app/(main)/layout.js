'use client';
import Providers from '@/app/providers';
import MainLayout from '@/components/layouts/MainLayout';

export default function MainAppLayout({ children }) {
  return (
    <Providers>
      <MainLayout>{children}</MainLayout>
    </Providers>
  );
}
