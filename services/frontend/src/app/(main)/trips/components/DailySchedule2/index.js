'use client';
import ServicesSidebar from '../ServicesSidebar';
import DaysContainer from './components/DaysContainer';
import TimeSlotsSidebar from './components/TimeSlotsSidebar';
import { useDragDrop } from './states/useDragDrop';
import { useScheduleState } from './states/useScheduleState';

export default function DailySchedule2({ numberOfDays, pax, onPreview }) {
  const { scheduleItems, addService, removeService } = useScheduleState();
  const { handleDrop, handleDragOver, handleDragLeave } = useDragDrop();

  return (
    <div className="flex">
      {/* Left Section */}
      <div className="flex-none flex">
        <ServicesSidebar />
        <TimeSlotsSidebar />
      </div>

      {/* Days Container */}
      <DaysContainer
        numberOfDays={numberOfDays}
        pax={pax}
        scheduleItems={scheduleItems}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={(day, time, e) => handleDrop(day, time, e, addService)}
      />
    </div>
  );
}
