'use client';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';

export default function MainLayoutWrapper({ children }) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
} 