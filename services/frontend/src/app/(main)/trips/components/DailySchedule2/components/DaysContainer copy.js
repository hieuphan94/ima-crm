import DayCard from './DayCard';

export default function DaysContainer({
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
    <div className="flex gap-2 p-2 min-w-max">
      {Array.from({ length: numberOfDays }).map((_, dayIndex) => (
        <div key={dayIndex}>
          <DayCard
            dayIndex={dayIndex}
            pax={pax}
            scheduleItems={scheduleItems}
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
}
