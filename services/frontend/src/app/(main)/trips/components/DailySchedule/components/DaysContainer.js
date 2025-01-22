'use client';

import { initializeDays } from '@/store/slices/useDailyScheduleSlice';
import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import DayCard from './DayCard';

const DaysContainer = memo(function DaysContainer({
  // scheduleItems,
  expandedSlots,
  onDragOver,
  onDragLeave,
  onDrop,
  onOpenModal,
  onRemoveService,
}) {
  const dispatch = useDispatch();
  const { numberOfDays } = useSelector((state) => state.dailySchedule.settings);
  const scheduleItems = useSelector((state) => state.dailySchedule.scheduleItems);

  // Khởi tạo days khi numberOfDays thay đổi
  useEffect(() => {
    const existingDays = Object.values(scheduleItems).length;

    if (existingDays !== numberOfDays) {
      const days = Array.from({ length: numberOfDays }).map((_, index) => ({
        id: uuidv4(),
        order: index + 1,
      }));

      dispatch(initializeDays(days));
    }
  }, [numberOfDays, dispatch]);

  console.log('scheduleItems', scheduleItems);

  // Sắp xếp days theo order
  const dataDays = Object.entries(scheduleItems).sort(([, a], [, b]) => a.order - b.order);

  return (
    <div className="flex gap-2 min-w-max">
      {dataDays.map(([dayId, dayData]) => (
        <div key={dayId}>
          <DayCard
            dayId={dayId}
            order={dayData.order}
            daySchedule={dayData}
            expandedSlots={expandedSlots}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onOpenModal={onOpenModal}
            onRemoveService={onRemoveService}
          />
        </div>
      ))}
    </div>
  );
}, arePropsEqual);

function arePropsEqual(prevProps, nextProps) {
  return (
    JSON.stringify(prevProps.scheduleItems) === JSON.stringify(nextProps.scheduleItems) &&
    JSON.stringify(prevProps.expandedSlots) === JSON.stringify(nextProps.expandedSlots) &&
    prevProps.onDragOver === nextProps.onDragOver &&
    prevProps.onDragLeave === nextProps.onDragLeave &&
    prevProps.onDrop === nextProps.onDrop &&
    prevProps.onOpenModal === nextProps.onOpenModal &&
    prevProps.onRemoveService === nextProps.onRemoveService &&
    prevProps.updateDayTitle === nextProps.updateDayTitle
  );
}

export default DaysContainer;
