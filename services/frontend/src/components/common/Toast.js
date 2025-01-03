'use client';

import { useUI } from '@/hooks/useUI';
import { useEffect } from 'react';

export function Toast() {
  const { notification, clearNotification } = useUI();

  console.log('Current notification:', notification); // Debug log

  useEffect(() => {
    if (notification) {
      console.log('Notification received:', notification); // Debug log
      const timer = setTimeout(() => {
        clearNotification();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white px-6 py-3 rounded-lg shadow-lg`}>
      {notification.message}
    </div>
  );
} 