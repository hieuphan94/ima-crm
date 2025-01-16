'use client';

import { memo, useEffect, useState } from 'react';
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
  updateDayTitle,
}) {
  const [paxValue, setPaxValue] = useState(daySchedule?.paxChangeOfDay || '');

  useEffect(() => {
    setPaxValue(daySchedule?.paxChangeOfDay || '');
  }, [daySchedule?.paxChangeOfDay]);

  return (
    <>
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
        id={`day-${dayIndex}`}
        className={`bg-white rounded-lg border p-2 ${
          paxValue ? 'border-yellow-400' : 'border-gray-200'
        }`}
        data-day={dayIndex}
      >
        <DayHeader dayIndex={dayIndex} daySchedule={daySchedule} updateDayTitle={updateDayTitle} />
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
    </>
  );
}, arePropsEqual);

function arePropsEqual(prevProps, nextProps) {
  // 1. So sánh primitive values trước
  if (prevProps.dayIndex !== nextProps.dayIndex || prevProps.pax !== nextProps.pax) return false;

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

  // 3. So sánh expandedSlots (thường là array hoặc object đơn giản)
  const prevExpanded = prevProps.expandedSlots || [];
  const nextExpanded = nextProps.expandedSlots || [];

  if (prevExpanded.length !== nextExpanded.length) return false;

  const isExpandedEqual = prevExpanded.every((slot, index) => slot === nextExpanded[index]);

  if (!isExpandedEqual) return false;

  // 4. So sánh daySchedule (phức tạp nhất)
  const prevSchedule = prevProps.daySchedule || {};
  const nextSchedule = nextProps.daySchedule || {};

  const prevKeys = Object.keys(prevSchedule);
  const nextKeys = Object.keys(nextSchedule);

  if (prevKeys.length !== nextKeys.length) return false;

  // So sánh từng key trong daySchedule
  return prevKeys.every((key) => {
    if (key === 'titleOfDay') {
      return prevSchedule[key] === nextSchedule[key];
    }

    const prevServices = prevSchedule[key];
    const nextServices = nextSchedule[key];

    if (!Array.isArray(prevServices) || !Array.isArray(nextServices)) {
      return prevServices === nextServices;
    }

    if (prevServices.length !== nextServices.length) return false;

    // So sánh từng service trong time slot
    return prevServices.every((service, idx) => {
      const nextService = nextServices[idx];
      return (
        service.name === nextService.name &&
        service.price === nextService.price &&
        service.type === nextService.type
      );
    });
  });
}

export default DayCard;
