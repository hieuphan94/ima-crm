import { useState } from 'react';

export function useScheduleState() {
  const [scheduleItems, setScheduleItems] = useState({});
  const [modalData, setModalData] = useState(null);

  const addService = (day, time, service) => {
    const slotKey = `${day}-${time}`;

    setScheduleItems((prev) => {
      const currentServices = prev[slotKey] || [];

      // Kiểm tra xem service đã tồn tại chưa
      const isDuplicate = currentServices.some(
        (existingService) =>
          existingService.id === service.id && existingService.name === service.name
      );

      // Nếu đã tồn tại, không thêm nữa
      if (isDuplicate) {
        return prev;
      }

      // Nếu chưa tồn tại, thêm mới
      const newServices = [...currentServices, service];

      // Nếu slot đã có services, mở modal
      if (currentServices.length > 0) {
        setModalData({
          isOpen: true,
          day,
          time,
          services: newServices,
        });
      }

      return {
        ...prev,
        [slotKey]: newServices,
      };
    });
  };

  const removeService = (day, time, index) => {
    const slotKey = `${day}-${time}`;

    setScheduleItems((prev) => {
      const newItems = { ...prev };
      if (newItems[slotKey]) {
        newItems[slotKey] = newItems[slotKey].filter((_, idx) => idx !== index);
        if (newItems[slotKey].length === 0) {
          delete newItems[slotKey];
        }
      }
      return newItems;
    });

    // Cập nhật lại modalData sau khi xóa
    if (modalData && modalData.day === day && modalData.time === time) {
      const updatedServices = scheduleItems[slotKey]?.filter((_, idx) => idx !== index) || [];

      if (updatedServices.length === 0) {
        // Đóng modal nếu không còn service nào
        setModalData(null);
      } else {
        // Cập nhật lại services trong modal
        setModalData({
          ...modalData,
          services: updatedServices,
        });
      }
    }
  };

  const openModal = (day, time, services) => {
    setModalData({
      isOpen: true,
      day,
      time,
      services,
    });
  };

  const closeModal = () => {
    setModalData(null);
  };

  const reorderServices = (day, time, newServices) => {
    const slotKey = `${day}-${time}`;

    setScheduleItems((prev) => ({
      ...prev,
      [slotKey]: newServices,
    }));

    // Cập nhật lại modalData
    if (modalData && modalData.day === day && modalData.time === time) {
      setModalData({
        ...modalData,
        services: newServices,
      });
    }
  };

  return {
    scheduleItems,
    modalData,
    addService,
    removeService,
    openModal,
    closeModal,
    reorderServices,
  };
}
