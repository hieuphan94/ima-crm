'use client';

import { useCallback } from 'react';

export function useDragDrop() {
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-100');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100');
  }, []);

  const handleDrop = useCallback((day, time, e, addService, removeService) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100');

    try {
      const dropData = JSON.parse(e.dataTransfer.getData('text/plain'));

      switch (dropData.type) {
        case 'service':
          addService(day, time, dropData.data);
          break;

        case 'guide':
          addService(day, time, {
            ...dropData.data,
            type: 'guide',
            icon: dropData.data.icon || '👨‍🦱',
            name: `HDV: ${dropData.data.name}`,
          });
          break;

        case 'moveService': {
          const { service, sourceDay, sourceTime } = dropData.data;
          if (sourceDay === day && sourceTime === time) return;

          removeService(sourceDay, sourceTime, 0);
          addService(day, time, service);
          break;
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  }, []);

  return {
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}
