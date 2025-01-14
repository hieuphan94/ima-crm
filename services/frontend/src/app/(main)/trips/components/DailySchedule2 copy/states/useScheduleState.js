'use client';

import { useCallback, useState } from 'react';

export function useScheduleState() {
  const [scheduleItems, setScheduleItems] = useState({});
  const [modalData, setModalData] = useState({ isOpen: false });
  const [expandedSlots, setExpandedSlots] = useState({});

  const toggleTimeSlot = useCallback((time) => {
    setExpandedSlots((prev) => ({
      ...prev,
      [time]: !prev[time],
    }));
  }, []);

  const isTimeExpanded = useCallback(
    (time) => {
      return expandedSlots[time] || false;
    },
    [expandedSlots]
  );

  const addService = useCallback((day, time, service) => {
    const slotKey = `${day}-${time}`;
    setScheduleItems((prev) => {
      if (prev[slotKey]?.some((s) => s.id === service.id)) {
        return prev;
      }
      return {
        ...prev,
        [slotKey]: [...(prev[slotKey] || []), service],
      };
    });
  }, []);

  const removeService = useCallback(
    (day, time, index) => {
      const slotKey = `${day}-${time}`;

      setScheduleItems((prev) => {
        // Early return nếu slot không tồn tại
        if (!prev[slotKey]) return prev;

        const currentServices = [...prev[slotKey]];
        currentServices.splice(index, 1);

        // Cập nhật modalData nếu đang mở
        if (modalData?.day === day && modalData?.time === time) {
          if (currentServices.length <= 1) {
            setModalData(null); // Đóng modal nếu còn ≤ 1 service
          } else {
            setModalData({
              ...modalData,
              services: currentServices,
            });
          }
        }

        // Nếu không còn services, xóa slot
        if (currentServices.length === 0) {
          const { [slotKey]: _, ...rest } = prev;
          return rest;
        }

        // Return new state với services đã cập nhật
        return {
          ...prev,
          [slotKey]: currentServices,
        };
      });
    },
    [modalData]
  );

  const reorderServices = useCallback(
    (day, time, newServices) => {
      const slotKey = `${day}-${time}`;

      setScheduleItems((prev) => {
        // Early return nếu không có thay đổi thực sự
        const currentServices = prev[slotKey] || [];
        if (JSON.stringify(currentServices) === JSON.stringify(newServices)) {
          return prev;
        }

        return {
          ...prev,
          [slotKey]: newServices,
        };
      });

      // Cập nhật modal nếu đang mở
      if (modalData?.day === day && modalData?.time === time) {
        setModalData((prev) => ({
          ...prev,
          services: newServices,
        }));
      }
    },
    [modalData]
  );

  const openModal = useCallback((day, time, services) => {
    if (services.length > 0) {
      // Chỉ mở khi có services
      setModalData({
        isOpen: true,
        day,
        time,
        services,
      });
    }
  }, []);

  const closeModal = useCallback(() => {
    setModalData(null);
  }, []);

  return {
    scheduleItems,
    modalData,
    expandedSlots,
    toggleTimeSlot,
    isTimeExpanded,
    addService,
    removeService,
    reorderServices,
    openModal,
    closeModal,
  };
}
