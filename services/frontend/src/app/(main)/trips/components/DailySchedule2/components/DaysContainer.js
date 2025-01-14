import DayCard from './DayCard';

export default function DaysContainer({
  numberOfDays,
  pax,
  scheduleItems,
  onDragOver,
  onDragLeave,
  onDrop,
  onOpenModal,
  onRemoveService,
}) {
  return (
    <div className="flex-1 overflow-x-auto">
      <div className="flex gap-2 min-w-min">
        {Array.from({ length: numberOfDays }).map((_, index) => (
          <DayCard
            key={index}
            dayIndex={index}
            pax={pax}
            scheduleItems={scheduleItems}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onOpenModal={onOpenModal}
            onRemoveService={onRemoveService}
          />
        ))}
      </div>
    </div>
  );
}
