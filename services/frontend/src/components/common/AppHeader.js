'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@nextui-org/react';

export function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.username || 'User'}</span>
            <Button 
              color="danger" 
              variant="light"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
} 