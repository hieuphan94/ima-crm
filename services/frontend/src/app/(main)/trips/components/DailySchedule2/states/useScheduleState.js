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
    setScheduleItems((prev) => {
      if (prev[day]?.[time]?.some((s) => s.id === service.id)) {
        return prev;
      }

      return {
        ...prev,
        [day]: {
          ...prev[day],
          [time]: [...(prev[day]?.[time] || []), service],
        },
      };
    });
  }, []);

  const removeService = useCallback(
    (day, time, index) => {
      setScheduleItems((prev) => {
        if (!prev[day]?.[time]) return prev;

        const currentServices = [...prev[day][time]];
        currentServices.splice(index, 1);

        if (modalData?.day === day && modalData?.time === time) {
          if (currentServices.length <= 1) {
            setModalData(null);
          } else {
            setModalData({
              ...modalData,
              services: currentServices,
            });
          }
        }

        const newState = { ...prev };

        if (currentServices.length === 0) {
          const { [time]: _, ...restTime } = prev[day];

          if (Object.keys(restTime).length === 0) {
            const { [day]: __, ...restDays } = newState;
            return restDays;
          }

          newState[day] = restTime;
          return newState;
        }

        return {
          ...prev,
          [day]: {
            ...prev[day],
            [time]: currentServices,
          },
        };
      });
    },
    [modalData]
  );

  const reorderServices = useCallback(
    (day, time, newServices) => {
      setScheduleItems((prev) => {
        const currentServices = prev[day]?.[time] || [];
        if (JSON.stringify(currentServices) === JSON.stringify(newServices)) {
          return prev;
        }

        return {
          ...prev,
          [day]: {
            ...prev[day],
            [time]: newServices,
          },
        };
      });

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
