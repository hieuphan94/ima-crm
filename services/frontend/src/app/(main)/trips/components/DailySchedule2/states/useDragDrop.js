import { useState } from 'react';

export function useDragDrop() {
  // State để lưu trữ item đang được kéo
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handler cho việc kéo qua slot
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-100');
  };

  // Handler cho việc rời khỏi slot
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-gray-100');
  };

  // Handler cho việc thả vào slot
  const handleDrop = (day, time, e, addService, removeService) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100');

    try {
      const dropData = JSON.parse(e.dataTransfer.getData('text/plain'));

      switch (dropData.type) {
        // Xử lý kéo từ sidebar (code cũ)
        case 'service':
        case 'guide':
          const serviceWithTime = {
            ...dropData.data,
            scheduledDay: day,
            scheduledTime: time,
          };
          addService(day, time, serviceWithTime);
          break;

        // Thêm case xử lý kéo từ slot khác
        case 'moveService':
          const { service, sourceDay, sourceTime } = dropData.data;

          // Nếu kéo vào chính slot cũ -> không làm gì
          if (sourceDay === day && sourceTime === time) return;

          // Remove from old slot
          removeService(sourceDay, sourceTime, 0); // 0 là index của service trong slot cũ

          // Add to new slot
          addService(day, time, {
            ...service,
            scheduledDay: day,
            scheduledTime: time,
          });
          break;
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  return {
    draggedItem,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isDragging,
  };
}
