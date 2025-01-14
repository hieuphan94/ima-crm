import DayHeader from './DayHeader';
import DistancePrice from './DistancePrice';
import TimeSlots from './TimeSlots';

export default function DayCard({
  dayIndex,
  pax,
  scheduleItems,
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
        scheduleItems={scheduleItems}
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
