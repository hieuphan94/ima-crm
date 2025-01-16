'use client';

import { memo } from 'react';
import DayCard from './DayCard';

const DaysContainer = memo(function DaysContainer({
  numberOfDays,
  pax,
  scheduleItems,
  expandedSlots,
  onDragOver,
  onDragLeave,
  onDrop,
  onOpenModal,
  onRemoveService,
}) {
  return (
    <div className="flex gap-2 min-w-max">
      {Array.from({ length: numberOfDays }).map((_, dayIndex) => {
        const day = dayIndex + 1;
        const daySchedule = scheduleItems[day] || {};

        return (
          <div key={dayIndex}>
            <DayCard
              dayIndex={dayIndex}
              daySchedule={daySchedule}
              pax={pax}
              expandedSlots={expandedSlots}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onOpenModal={onOpenModal}
              onRemoveService={onRemoveService}
            />
          </div>
        );
      })}
    </div>
  );
}, arePropsEqual);

function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.numberOfDays === nextProps.numberOfDays &&
    prevProps.pax === nextProps.pax &&
    JSON.stringify(prevProps.scheduleItems) === JSON.stringify(nextProps.scheduleItems) &&
    JSON.stringify(prevProps.expandedSlots) === JSON.stringify(nextProps.expandedSlots) &&
    prevProps.onDragOver === nextProps.onDragOver &&
    prevProps.onDragLeave === nextProps.onDragLeave &&
    prevProps.onDrop === nextProps.onDrop &&
    prevProps.onOpenModal === nextProps.onOpenModal &&
    prevProps.onRemoveService === nextProps.onRemoveService
  );
}

export default DaysContainer;
