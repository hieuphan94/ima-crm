'use client';

import { memo } from 'react';
import DayHeader from './DayHeader';
import DistancePrice from './DistancePrice';
import TimeSlots from './TimeSlots';

function DayCard({
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
    <div className="bg-white rounded-lg border border-gray-200 p-2">
      <DayHeader dayIndex={dayIndex} />
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
      <DistancePrice pax={pax} />
    </div>
  );
}

export default memo(DayCard);
