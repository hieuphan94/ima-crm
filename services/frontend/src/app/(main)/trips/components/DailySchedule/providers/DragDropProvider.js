'use client';
import { useCallback, useState } from 'react';
import { DragDropContext } from '../contexts/DragDropContext';
import { useSchedule } from '../hooks/useSchedule';

export function DragDropProvider({ children }) {
  // States
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragSource, setDragSource] = useState(null);

  // Get schedule actions
  const { addService, removeService } = useSchedule();

  // Handlers
  const handleDragStart = useCallback((e, service, sourceInfo) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        type: sourceInfo?.type || 'service',
        data:
          sourceInfo?.type === 'moveService'
            ? { service, sourceDay: sourceInfo.day, sourceTime: sourceInfo.time }
            : service,
      })
    );
    setDraggedItem(service);
    setDragSource(sourceInfo);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-100');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100');
  }, []);

  const handleDrop = useCallback(
    (day, time, e) => {
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

      // Reset states
      setDraggedItem(null);
      setDragSource(null);
    },
    [addService, removeService]
  );

  const value = {
    // States
    draggedItem,
    dragSource,

    // Actions
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };

  return <DragDropContext.Provider value={value}>{children}</DragDropContext.Provider>;
}
