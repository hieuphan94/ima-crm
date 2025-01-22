'use client';

import { memo, useEffect, useState } from 'react';
import DayHeader from './DayHeader';
import DistancePrice from './DistancePrice';
import TimeSlots from './TimeSlots';

const DayCard = memo(function DayCard({
  dayId,
  order,
  daySchedule,
  expandedSlots,
  onDragOver,
  onDragLeave,
  onDrop,
  onOpenModal,
  onRemoveService,
  updateDayTitle,
}) {
  const [paxValue, setPaxValue] = useState(daySchedule?.paxChangeOfDay || '');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setPaxValue(daySchedule?.paxChangeOfDay || '');
  }, [daySchedule?.paxChangeOfDay]);

  return (
    <div className="day-card-container transition-all duration-300 ease-in-out">
      <div className="group flex items-center justify-center gap-2 mb-1">
        <label
          className={`text-xs text-yellow-600 transition-opacity duration-200 ${
            paxValue ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          Pax Change:
        </label>
        <input
          type="text"
          className={`w-[30px] text-xs text-center text-yellow-600 p-1 border rounded outline-none focus:border-gray-200 transition-opacity duration-200 ${
            paxValue ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          value={paxValue}
          onChange={(e) => {
            const newValue = e.target.value.replace(/[^0-9]/g, '');
            const parsedValue = newValue ? parseInt(newValue, 10) : '';
            setPaxValue(parsedValue);
            if (daySchedule) {
              daySchedule.paxChangeOfDay = parsedValue;
            }
          }}
        />
      </div>
      <div
        id={`day-${order}`}
        className={`
          bg-white rounded-lg border p-2
          transition-all duration-300 ease-in-out
          ${paxValue ? 'border-yellow-400' : 'border-gray-200'}
          ${isDragging ? 'scale-95 opacity-70 shadow-lg' : 'scale-100 opacity-100'}
          hover:shadow-md
        `}
        data-day={dayId}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      >
        <DayHeader
          dayId={dayId}
          order={order}
          daySchedule={daySchedule}
          updateDayTitle={updateDayTitle}
          isDragging={isDragging}
        />
        <TimeSlots
          dayId={dayId}
          order={order}
          daySchedule={daySchedule}
          expandedSlots={expandedSlots}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onOpenModal={onOpenModal}
          onRemoveService={onRemoveService}
        />
        <DistancePrice dayId={dayId} />
      </div>
    </div>
  );
}, arePropsEqual);

function arePropsEqual(prevProps, nextProps) {
  // 1. So sánh primitive values
  if (prevProps.dayId !== nextProps.dayId || prevProps.order !== nextProps.order) return false;

  // 2. So sánh function references
  if (
    prevProps.onDragOver !== nextProps.onDragOver ||
    prevProps.onDragLeave !== nextProps.onDragLeave ||
    prevProps.onDrop !== nextProps.onDrop ||
    prevProps.onOpenModal !== nextProps.onOpenModal ||
    prevProps.onRemoveService !== nextProps.onRemoveService ||
    prevProps.updateDayTitle !== nextProps.updateDayTitle
  )
    return false;

  // 3. So sánh expandedSlots
  const prevExpanded = prevProps.expandedSlots || [];
  const nextExpanded = nextProps.expandedSlots || [];
  if (prevExpanded.length !== nextExpanded.length) return false;

  // 4. So sánh daySchedule
  const prevSchedule = prevProps.daySchedule || {};
  const nextSchedule = nextProps.daySchedule || {};
  return JSON.stringify(prevSchedule) === JSON.stringify(nextSchedule);
}

export default DayCard;
