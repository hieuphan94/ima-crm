'use client';

import { setPaxChangeOfDay } from '@/store/slices/useDailyScheduleSlice';
import { memo, useState } from 'react';
import { useDispatch } from 'react-redux';
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
}) {
  const dispatch = useDispatch();
  const [paxValue, setPaxValue] = useState(daySchedule?.paxChangeOfDay || '');
  const [isDragging, setIsDragging] = useState(false);

  // useEffect(() => {
  //   setPaxValue(daySchedule?.paxChangeOfDay || '');
  // }, [daySchedule?.paxChangeOfDay]);

  const handleDragStart = (e) => {
    // Chỉ áp dụng animation khi kéo từ DayHeader
    const isDayHeader = e.target.closest('.day-header');
    if (!isDayHeader) return;

    setIsDragging(true);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    // Chỉ remove animation khi kéo từ DayHeader
    const isDayHeader = e.target.closest('.day-header');
    if (!isDayHeader) return;

    setIsDragging(false);
    e.currentTarget.classList.remove('dragging');
  };

  return (
    <div
      className="day-card-container"
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
            dispatch(setPaxChangeOfDay({ dayId, pax: parsedValue }));
          }}
        />
      </div>

      <div
        id={`day-${order}`}
        className={`
          day-card
          bg-white rounded-lg border p-1
          ${paxValue ? 'border-yellow-400' : 'border-gray-200'}
          ${isDragging ? 'dragging' : ''}
          hover:shadow-md
          transition-all duration-300 ease-in-out
        `}
        data-day={dayId}
      >
        <DayHeader dayId={dayId} order={order} daySchedule={daySchedule} isDragging={isDragging} />
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
        {/* <Meal dayId={dayId} /> */}
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
