import { useState } from 'react';

export function useScheduleState() {
  const [scheduleItems, setScheduleItems] = useState({});

  const addService = (day, time, service) => {
    const slotKey = `${day}-${time}`;
    setScheduleItems((prev) => ({
      ...prev,
      [slotKey]: [...(prev[slotKey] || []), service],
    }));
  };

  const removeService = (day, time, serviceIndex) => {
    const slotKey = `${day}-${time}`;
    setScheduleItems((prev) => {
      const newItems = { ...prev };
      newItems[slotKey] = prev[slotKey].filter((_, idx) => idx !== serviceIndex);
      if (newItems[slotKey].length === 0) {
        delete newItems[slotKey];
      }
      return newItems;
    });
  };

  return {
    scheduleItems,
    addService,
    removeService,
  };
}
