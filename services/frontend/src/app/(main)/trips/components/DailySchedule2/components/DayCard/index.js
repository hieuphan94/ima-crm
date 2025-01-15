'use client';

import { memo } from 'react';
import DayHeader from './DayHeader';
import DistancePrice from './DistancePrice';
import TimeSlots from './TimeSlots';

const DayCard = memo(function DayCard({
  dayIndex,
  pax,
  daySchedule,
  expandedSlots,
  onDragOver,
  onDragLeave,
  onDrop,
  onOpenModal,
  onRemoveService,
}) {
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-2 day-container"
      data-day={dayIndex}
    >
      <DayHeader dayIndex={dayIndex} daySchedule={daySchedule} />
      <TimeSlots
        dayIndex={dayIndex}
        daySchedule={daySchedule}
        expandedSlots={expandedSlots}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onOpenModal={onOpenModal}
        onRemoveService={onRemoveService}
      />
      <DistancePrice pax={pax} dayIndex={dayIndex} />
    </div>
  );
}, arePropsEqual);

function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.dayIndex === nextProps.dayIndex &&
    prevProps.pax === nextProps.pax &&
    JSON.stringify(prevProps.daySchedule) === JSON.stringify(nextProps.daySchedule) &&
    JSON.stringify(prevProps.expandedSlots) === JSON.stringify(nextProps.expandedSlots) &&
    prevProps.onDragOver === nextProps.onDragOver &&
    prevProps.onDragLeave === nextProps.onDragLeave &&
    prevProps.onDrop === nextProps.onDrop &&
    prevProps.onOpenModal === nextProps.onOpenModal &&
    prevProps.onRemoveService === nextProps.onRemoveService
  );
}

export default DayCard;
