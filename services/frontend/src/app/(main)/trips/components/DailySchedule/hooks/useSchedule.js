'use client';

import { useContext } from 'react';
import { ScheduleContext } from '../contexts/ScheduleContext';

export function useSchedule() {
  const context = useContext(ScheduleContext);

  if (!context) {
    throw new Error('useSchedule phải được sử dụng trong ScheduleProvider');
  }

  // Tách các giá trị từ context để dễ sử dụng
  const {
    // Settings
    settings: { globalPax, numberOfDays },

    // Schedule Info
    scheduleInfo,

    // Schedule Data
    scheduleItems,

    // UI State
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
  } = context;

  // Helper functions
  const getDayData = (day) => scheduleItems[day] || null;
  const getCurrentPax = (day) => {
    const dayData = getDayData(day);
    return dayData?.paxChangeOfDay ?? globalPax;
  };
  const getTimeSlotServices = (day, time) => {
    const dayData = getDayData(day);
    return dayData?.[time] || [];
  };

  return {
    // States
    settings: { globalPax, numberOfDays },
    scheduleInfo,
    scheduleItems,
    modalData,
    expandedSlots,

    // All Actions
    updateScheduleCode,
    updateScheduleTitle,
    updateScheduleDates,
    updateScheduleVersion,
    updateScheduleStatus,
    updateScheduleImages,
    updateScheduleNote,
    updateAdditionalPrice,
    updateInternalInfo,
    updateCustomerInfo,
    updateGuests,
    updateGuestInfo,
    updateGuestPassport,
    updateGuestImages,
    updateScheduleTransport,
    updateDayTransport,
    updateTransportVehicles,
    updateDayVehicles,
    updateDriverInfo,
    updateDayTitle,
    updateDayImages,
    updateDayNote,
    updateDayAdditionalPrice,
    updateDayParagraph,
    getDayLocations,
    updateDayPax,
    updateDistance,
    addService,
    removeService,
    reorderServices,
    updateServicePrice,
    updateServiceNote,
    updateServiceSentence,
    updateGlobalPax,
    updateNumberOfDays,
    toggleTimeSlot,
    openModal,
    closeModal,
    exportDayData,
    exportAllData,
    exportScheduleItems,

    // Helper Functions
    getDayData,
    getCurrentPax,
    getTimeSlotServices,
  };
}
