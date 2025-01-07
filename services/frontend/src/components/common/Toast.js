'use client';

import { useUI } from '@/hooks/useUI';
import { useEffect } from 'react';

export function Toast() {
  const { notification, clearNotification } = useUI();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, notification.duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  const toastColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] pointer-events-none flex items-end justify-center bg-transparent">
      <div className="w-full max-w-md mb-4 px-4 bg-transparent">
        <div
          key={notification.id}
          className={`
            px-6 py-3 rounded-lg shadow-lg 
            ${toastColors[notification.type] || toastColors.info}
            text-white
            animate-slide-up
          `}
        >
          {notification.message}
        </div>
      </div>
    </div>
  );
}
