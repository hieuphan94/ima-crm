import DayHeader from './DayHeader';
import DistancePrice from './DistancePrice';
import TimeSlots from './TimeSlots';

export default function DayCard({ dayIndex, pax, scheduleItems, onDragOver, onDragLeave, onDrop }) {
  return (
    <div className="w-[160px] flex-none bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      <DayHeader dayIndex={dayIndex} />
      <TimeSlots
        dayIndex={dayIndex}
        scheduleItems={scheduleItems}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      />
      <DistancePrice pax={pax} />
    </div>
  );
}
