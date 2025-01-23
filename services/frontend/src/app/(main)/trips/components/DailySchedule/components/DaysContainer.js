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

  console.log('scheduleItems', scheduleItems);

  // Khởi tạo days khi numberOfDays thay đổi
  useEffect(() => {
    const existingDays = Object.entries(scheduleItems);
    const currentLength = existingDays.length;

    if (currentLength < numberOfDays && numberOfDays > 0) {
      // Sắp xếp các ngày hiện có theo order để lấy order cuối cùng chính xác
      const sortedExistingDays = existingDays.sort(([, a], [, b]) => a.order - b.order);

      // Tạo map để tra cứu nhanh hơn
      const existingDaysData = sortedExistingDays.map(([id, day]) => ({
        id,
        order: day.order,
      }));

      // Lấy order cuối cùng từ mảng đã sắp xếp
      const lastOrder = currentLength > 0 ? sortedExistingDays[currentLength - 1][1].order : 0;

      const newDays = Array.from({ length: numberOfDays - currentLength }).map((_, index) => ({
        id: uuidv4(),
        order: lastOrder + index + 1,
      }));

      dispatch(initializeDays([...existingDaysData, ...newDays]));
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
