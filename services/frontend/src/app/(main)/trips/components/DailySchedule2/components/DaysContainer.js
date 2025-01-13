import DayCard from './DayCard';

export default function DaysContainer({
  numberOfDays,
  pax,
  scheduleItems,
  onDragOver,
  onDragLeave,
  onDrop,
}) {
  return (
    <div className="relative" style={{ width: 'calc(160px * 7 + 8px * 6)' }}>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-2">
          {[...Array(numberOfDays)].map((_, dayIndex) => (
            <DayCard
              key={dayIndex}
              dayIndex={dayIndex}
              pax={pax}
              scheduleItems={scheduleItems}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
