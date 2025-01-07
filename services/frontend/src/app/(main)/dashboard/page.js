'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user, getUserFromToken } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        if (!user) {
          await getUserFromToken();
        }
      } catch (error) {
        console.error('Dashboard initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeDashboard();
  }, []);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative overflow-auto space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="font-bold">Thống kê</CardHeader>
          <CardBody>
            <p>Chào mừng, {user.username}!</p>
            <p>Role: {user.role}</p>
            <p>Department: {user.department}</p>
          </CardBody>
        </Card>
        {/* ... rest of your components ... */}
      </div>
    </div>
  );
}
