'use client';

import { useCallback, useState } from 'react';
import { ScheduleContext } from '../contexts/ScheduleContext';
import Day from '../models/Day';

export function ScheduleProvider({ children, initialData = {} }) {
  // Core States
  const [settings, setSettings] = useState(() => ({
    globalPax: null,
    numberOfDays: 0,
    ...initialData.settings,
  }));

  const [scheduleInfo, setScheduleInfo] = useState(() => ({
    code: '',
    title: '',
    startDate: null,
    endDate: null,
    version: 1,
    status: { current: 'draft', history: [] },
    internalInfo: { createdBy: '', createdAt: null },
    customerInfo: { name: '', nationality: '', language: '', specialRequests: '' },
    groupInfo: { guests: [] },
    scheduleTransport: {
      vehicles: [],
      totalDistance: 0,
      totalTransportPrice: 0,
      transportNote: '',
    },
    scheduleImages: [],
    totalPrice: 0,
    additionalPrice: { value: 0, note: '' },
    finalPrice: 0,
    scheduleNotes: [],
    ...initialData.scheduleInfo,
  }));

  const [scheduleItems, setScheduleItems] = useState(() => ({
    ...initialData.scheduleItems,
  }));

  // UI States
  const [modalData, setModalData] = useState({ isOpen: false });
  const [expandedSlots, setExpandedSlots] = useState({});

  // 1. Schedule Basic Actions
  const updateScheduleCode = useCallback((code) => {
    setScheduleInfo((prev) => ({ ...prev, code }));
  }, []);

  const updateScheduleTitle = useCallback((title) => {
    setScheduleInfo((prev) => ({ ...prev, title }));
  }, []);

  const updateScheduleDates = useCallback((startDate, endDate) => {
    setScheduleInfo((prev) => ({ ...prev, startDate, endDate }));
  }, []);

  const updateScheduleVersion = useCallback((version) => {
    setScheduleInfo((prev) => ({ ...prev, version }));
  }, []);

  const updateScheduleStatus = useCallback((newStatus) => {
    setScheduleInfo((prev) => ({
      ...prev,
      status: {
        current: newStatus,
        history: [
          ...prev.status.history,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            updatedBy: prev.internalInfo.createdBy,
          },
        ],
      },
    }));
  }, []);

  const updateScheduleImages = useCallback((images) => {
    setScheduleInfo((prev) => ({ ...prev, scheduleImages: images }));
  }, []);

  const updateScheduleNote = useCallback((note) => {
    setScheduleInfo((prev) => ({
      ...prev,
      scheduleNotes: [
        ...prev.scheduleNotes,
        {
          content: note,
          createdBy: prev.internalInfo.createdBy,
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }, []);

  const updateAdditionalPrice = useCallback((price, note) => {
    setScheduleInfo((prev) => ({
      ...prev,
      additionalPrice: { value: price, note },
      finalPrice: prev.totalPrice + price,
    }));
  }, []);

  // 2. Info Update Actions
  const updateInternalInfo = useCallback((field, value) => {
    setScheduleInfo((prev) => ({
      ...prev,
      internalInfo: { ...prev.internalInfo, [field]: value },
    }));
  }, []);

  const updateCustomerInfo = useCallback((field, value) => {
    setScheduleInfo((prev) => ({
      ...prev,
      customerInfo: { ...prev.customerInfo, [field]: value },
    }));
  }, []);

  // 3. Group Actions
  const updateGuests = useCallback((guests) => {
    setScheduleInfo((prev) => ({
      ...prev,
      groupInfo: { ...prev.groupInfo, guests },
    }));
  }, []);

  const updateGuestInfo = useCallback((guestId, field, value) => {
    setScheduleInfo((prev) => ({
      ...prev,
      groupInfo: {
        ...prev.groupInfo,
        guests: prev.groupInfo.guests.map((guest) =>
          guest.id === guestId ? { ...guest, [field]: value } : guest
        ),
      },
    }));
  }, []);

  // 4. Transport Actions
  const updateScheduleTransport = useCallback((field, value) => {
    setScheduleInfo((prev) => ({
      ...prev,
      scheduleTransport: { ...prev.scheduleTransport, [field]: value },
    }));
  }, []);

  // 5. Day Actions
  const updateDayTitle = useCallback((day, title) => {
    setScheduleItems((prev) => {
      const dayData = new Day(prev[day] || {});
      dayData.updateTitle(title);
      return { ...prev, [day]: dayData.toJSON() };
    });
  }, []);

  // 6. Service Actions
  const addService = useCallback((day, time, service) => {
    setScheduleItems((prev) => {
      const dayData = new Day(prev[day] || {});
      dayData.addService(time, service);
      return { ...prev, [day]: dayData.toJSON() };
    });
  }, []);

  const removeService = useCallback(
    (day, time, index) => {
      setScheduleItems((prev) => {
        const dayData = new Day(prev[day] || {});
        const success = dayData.removeService(time, index);
        if (!success) return prev;

        // Handle modal update if needed
        if (modalData?.day === day && modalData?.time === time) {
          const updatedServices = dayData.getTimeSlot(time);
          if (updatedServices.length <= 1) {
            setModalData({ isOpen: false });
          } else {
            setModalData((prev) => ({
              ...prev,
              services: updatedServices,
            }));
          }
        }

        // Remove day if empty
        if (Object.keys(dayData.getAllTimeSlots()).length === 0) {
          const { [day]: _, ...rest } = prev;
          return rest;
        }

        return {
          ...prev,
          [day]: dayData.toJSON(),
        };
      });
    },
    [modalData]
  );

  // 7. Settings Actions
  const updateGlobalPax = useCallback((newPax) => {
    setSettings((prev) => ({ ...prev, globalPax: newPax }));
  }, []);

  const updateNumberOfDays = useCallback((days) => {
    setSettings((prev) => ({ ...prev, numberOfDays: days }));
  }, []);

  // 8. UI Actions
  const toggleTimeSlot = useCallback((time) => {
    setExpandedSlots((prev) => ({
      ...prev,
      [time]: !prev[time],
    }));
  }, []);

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
    setModalData({ isOpen: false });
  }, []);

  // 9. Export Actions
  const exportDayData = useCallback(
    (day) => {
      return scheduleItems[day];
    },
    [scheduleItems]
  );

  const exportAllData = useCallback(() => {
    return {
      settings,
      scheduleInfo,
      scheduleItems,
    };
  }, [settings, scheduleInfo, scheduleItems]);

  // Context value
  const value = {
    // States
    settings,
    scheduleInfo,
    scheduleItems,
    modalData,
    expandedSlots,

    // 1. Schedule Basic Actions
    updateScheduleCode,
    updateScheduleTitle,
    updateScheduleDates,
    updateScheduleVersion,
    updateScheduleStatus,
    updateScheduleImages,
    updateScheduleNote,
    updateAdditionalPrice,

    // 2. Info Update Actions
    updateInternalInfo,
    updateCustomerInfo,

    // 3. Group Actions
    updateGuests,
    updateGuestInfo,
    updateGuestPassport,
    updateGuestImages,

    // 4. Transport Actions
    updateScheduleTransport,
    updateDayTransport,
    updateTransportVehicles,
    updateDayVehicles,
    updateDriverInfo,

    // 5. Day Actions
    updateDayTitle,
    updateDayImages,
    updateDayNote,
    updateDayAdditionalPrice,
    updateDayParagraph,
    getDayLocations,
    updateDayPax,
    updateDistance,

    // 6. Service Actions
    addService,
    removeService,
    reorderServices,
    updateServicePrice,
    updateServiceNote,
    updateServiceSentence,

    // 7. Settings Actions
    updateGlobalPax,
    updateNumberOfDays,

    // 8. UI Actions
    toggleTimeSlot,
    openModal,
    closeModal,

    // 9. Export Actions
    exportDayData,
    exportAllData,
    exportScheduleItems,
  };

  return <ScheduleContext.Provider value={value}>{children}</ScheduleContext.Provider>;
}
