'use client';

import { reorderDays } from '@/store/slices/useDailyScheduleSlice';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

export function useDragDrop() {
  const dispatch = useDispatch();
  const [draggedDay, setDraggedDay] = useState(null);

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

  // Xử lý khi di chuột qua DayHeader
  const handleDayHeaderDragOver = useCallback((e) => {
    e.preventDefault();

    try {
      // Không thể đọc getData trong dragOver event
      // Thay vào đó, kiểm tra type từ dataTransfer.types
      if (e.dataTransfer.types.includes('text/plain')) {
        e.currentTarget.classList.add('bg-blue-100');
      }
    } catch (error) {
      console.error('Error in dragOver:', error);
    }
  }, []);

  // Xử lý khi rời khỏi vùng DayHeader
  const handleDayHeaderDragLeave = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-100');
  }, []);

  // Xử lý khi bắt đầu kéo một ngày
  const handleDayDragStart = useCallback((e, dayId, order) => {
    setDraggedDay({ dayId, order });
    e.currentTarget.classList.add('opacity-50');

    // Lưu thông tin ngày đang kéo
    const dragData = {
      type: 'moveDay',
      data: { dayId, order },
    };
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
  }, []);

  // Xử lý khi kết thúc kéo
  const handleDayDragEnd = useCallback((e) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedDay(null);
  }, []);

  // Xử lý khi thả vào DayHeader
  const handleDayHeaderDrop = useCallback(
    (e, targetDayId, targetOrder) => {
      e.preventDefault();
      e.currentTarget.classList.remove('bg-blue-100');

      try {
        const dropData = JSON.parse(e.dataTransfer.getData('text/plain'));

        if (dropData.type === 'moveDay') {
          const { dayId: sourceDayId, order: sourceOrder } = dropData.data;

          // Không làm gì nếu thả vào chính nó
          if (sourceDayId === targetDayId) return;

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
