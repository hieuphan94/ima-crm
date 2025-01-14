'use client';
import ServicesSidebar from '../ServicesSidebar';
import DaysContainer from './components/DaysContainer';
import ScheduleModal from './components/ScheduleModal';
import TimeSlotsSidebar from './components/TimeSlotsSidebar';
import { useDragDrop } from './states/useDragDrop';
import { useScheduleState } from './states/useScheduleState';

export default function DailySchedule2({ numberOfDays, pax }) {
  const {
    scheduleItems,
    modalData,
    addService,
    removeService,
    closeModal,
    openModal,
    reorderServices,
  } = useScheduleState();

  const { handleDrop, handleDragOver, handleDragLeave } = useDragDrop();

  return (
    <div className="flex gap-4">
      <ServicesSidebar />
      <div className="flex">
        <TimeSlotsSidebar />
        <DaysContainer
          numberOfDays={numberOfDays}
          pax={pax}
          scheduleItems={scheduleItems}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(day, time, e) => handleDrop(day, time, e, addService, removeService)}
          onOpenModal={openModal}
          onRemoveService={removeService}
        />
      </div>

      <ScheduleModal
        {...modalData}
        onClose={closeModal}
        onRemoveService={removeService}
        onReorderServices={reorderServices}
      />
    </div>
  );
}
