'use client';
import { useEffect } from 'react';
import ServicesSidebar from '../ServicesSidebar';
import DaysContainer from './components/DaysContainer';
import ScheduleModal from './components/ScheduleModal';
import TimeSlotsSidebar from './components/TimeSlotsSidebar';
import { useDragDrop } from './states/useDragDrop';
import { useScheduleState } from './states/useScheduleState';

export default function DailySchedule({ numberOfDays, pax }) {
  const {
    scheduleItems,
    modalData,
    expandedSlots,
    toggleTimeSlot,
    addService,
    removeService,
    closeModal,
    openModal,
    reorderServices,
    updateDayTitle,
    updatePax,
  } = useScheduleState();

  const { handleDrop, handleDragOver, handleDragLeave } = useDragDrop();

  useEffect(() => {
    if (pax !== undefined && pax !== null) {
      updatePax(pax);
    }
  }, [pax, updatePax]);

  return (
    <div className="flex gap-4 h-full">
      {/* Left Sidebar */}
      <div className="flex-none">
        <ServicesSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex">
          {/* Time Slots Column */}
          <div className="flex-none">
            <TimeSlotsSidebar expandedSlots={expandedSlots} onToggleTime={toggleTimeSlot} />
          </div>

          {/* Days Container - Single scroll container */}
          <div className="relative" style={{ width: 'calc(160px * 7 + 8px * 6)' }}>
            <div className="overflow-x-auto">
              <div className={numberOfDays > 7 ? 'overflow-x-auto' : ''}>
                <div style={{ width: `${numberOfDays * 160}px` }}>
                  <DaysContainer
                    numberOfDays={numberOfDays}
                    pax={pax}
                    scheduleItems={scheduleItems}
                    expandedSlots={expandedSlots}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(day, time, e) => handleDrop(day, time, e, addService, removeService)}
                    onOpenModal={openModal}
                    onRemoveService={removeService}
                    updateDayTitle={updateDayTitle}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalData?.isOpen && (
        <ScheduleModal
          {...modalData}
          onClose={closeModal}
          onRemoveService={removeService}
          onReorderServices={reorderServices}
        />
      )}
    </div>
  );
}
