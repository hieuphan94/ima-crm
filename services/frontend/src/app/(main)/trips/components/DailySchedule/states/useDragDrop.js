'use client';

import { reorderDays } from '@/store/slices/useDailyScheduleSlice';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

export function useDragDrop() {
  const dispatch = useDispatch();
  const [draggedDay, setDraggedDay] = useState(null);

  // Regular drag handlers cho services (không animation)
  const handleDragOver = useCallback((e) => {
    if (!e?.currentTarget) return;
    e.preventDefault();
    // Chỉ thêm highlight nhẹ cho drop zone của services
    e.currentTarget.classList?.add('bg-gray-100');
  }, []);

  const handleDragLeave = useCallback((e) => {
    if (!e?.currentTarget) return;
    e.preventDefault();
    e.currentTarget.classList?.remove('bg-gray-100');
  }, []);

  const handleDrop = useCallback((day, time, e, addService, removeService) => {
    if (!e?.currentTarget) return;
    e.preventDefault();
    e.currentTarget.classList?.remove('bg-gray-100');

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

  // Day reorder handlers (có animation)
  const handleDayDragStart = useCallback((e, dayId, order) => {
    if (!e?.currentTarget) return;

    // Kiểm tra xem có phải đang kéo DayCard không
    const isDayCard = e.currentTarget.closest('.day-card-container');
    if (!isDayCard) return;

    setDraggedDay({ dayId, order });

    const dayCard = isDayCard.querySelector('.day-card');
    if (dayCard) {
      dayCard.classList?.add('dragging');
      try {
        dayCard.style.transform = 'scale(0.95)';
        dayCard.style.opacity = '0.7';
      } catch (error) {
        console.error('Error setting style:', error);
      }
    }

    const dragData = {
      type: 'moveDay',
      data: { dayId, order },
    };
    e.dataTransfer?.setData('text/plain', JSON.stringify(dragData));
  }, []);

  const handleDayDragEnd = useCallback((e) => {
    if (!e?.currentTarget) return;

    const isDayCard = e.currentTarget.closest('.day-card-container');
    if (!isDayCard) return;

    const dayCard = isDayCard.querySelector('.day-card');
    if (dayCard) {
      dayCard.classList?.remove('dragging');
      try {
        dayCard.style.transform = '';
        dayCard.style.opacity = '';
      } catch (error) {
        console.error('Error resetting style:', error);
      }
    }
    setDraggedDay(null);
  }, []);

  const handleDayHeaderDragOver = useCallback((e) => {
    if (!e?.currentTarget) return;
    e.preventDefault();

    try {
      const dragData = e.dataTransfer?.getData('text/plain');
      if (dragData && JSON.parse(dragData).type === 'moveDay') {
        const target = e.currentTarget;
        target.classList?.add('drag-over');
        target.style.transform = 'scale(1.02)';
      }
    } catch (error) {
      console.error('Error in dragOver:', error);
    }
  }, []);

  const handleDayHeaderDragLeave = useCallback((e) => {
    if (!e?.currentTarget) return;
    e.preventDefault();

    const target = e.currentTarget;
    target.classList?.remove('drag-over');
    try {
      target.style.transform = '';
    } catch (error) {
      console.error('Error resetting style:', error);
    }
  }, []);

  const handleDayHeaderDrop = useCallback(
    (e, targetDayId, targetOrder) => {
      if (!e?.currentTarget) return;
      e.preventDefault();

      const target = e.currentTarget;
      target.classList?.remove('drag-over');
      try {
        target.style.transform = '';
      } catch (error) {
        console.error('Error resetting style:', error);
      }

      try {
        const dropData = JSON.parse(e.dataTransfer?.getData('text/plain') || '{}');

        if (dropData.type === 'moveDay') {
          const { dayId: sourceDayId, order: sourceOrder } = dropData.data;

          if (sourceDayId === targetDayId) return;

          target.classList?.add('drop-success');
          setTimeout(() => {
            target.classList?.remove('drop-success');
          }, 300);

          dispatch(
            reorderDays({
              sourceDayId,
              targetDayId,
              sourceOrder,
              targetOrder,
            })
          );
        }
      } catch (error) {
        console.error('Error handling day drop:', error);
      }
    },
    [dispatch]
  );

  return {
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDayDragStart,
    handleDayDragEnd,
    handleDayHeaderDragOver,
    handleDayHeaderDragLeave,
    handleDayHeaderDrop,
    draggedDay,
  };
}
