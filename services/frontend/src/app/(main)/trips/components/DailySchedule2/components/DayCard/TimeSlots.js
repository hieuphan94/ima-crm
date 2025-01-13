import { TIME_GROUPS } from '../../utils/constants';

export default function TimeSlots({
  dayIndex,
  scheduleItems,
  onDragOver,
  onDragLeave,
  onDrop,
  isDragOver,
}) {
  return (
    <>
      {TIME_GROUPS.map((group, groupIndex) => (
        <div key={group.label} className={groupIndex !== 0 ? 'mt-2' : ''}>
          {group.slots.map((time) => {
            const slotKey = `${dayIndex + 1}-${time}`;
            const services = scheduleItems[slotKey] || [];

            return (
              <div
                key={time}
                className={`h-[28px] rounded bg-white border ${
                  isDragOver ? 'border-blue-300 bg-blue-50' : 'border-gray-100'
                } px-2 relative`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(dayIndex + 1, time, e)}
              >
                {services.length > 0 && (
                  <div className="absolute inset-0 flex items-center bg-white border border-gray-200 rounded shadow-sm px-2">
                    <span className="text-[11px] mr-1">{services[0].icon}</span>
                    <span className="text-[9px] truncate">
                      {services[0].itemType === 'guide'
                        ? `HDV: ${services[0].name}`
                        : services[0].name}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
