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
  const handleDrop = (day, time, e, addService) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100');

    try {
      const droppedData = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (!droppedData.type || !droppedData.data) {
        console.error('Invalid drop data format');
        return;
      }

      // Kiểm tra type để xử lý phù hợp
      if (droppedData.type === 'service' || droppedData.type === 'guide') {
        const serviceWithTime = {
          ...droppedData.data,
          scheduledDay: day,
          scheduledTime: time,
          itemType: droppedData.type, // Thêm type để phân biệt khi render
        };

        addService(day, time, serviceWithTime);
      }
    } catch (error) {
      console.error('Error processing dropped item:', error);
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
