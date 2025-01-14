import { TIME_GROUPS } from '../../utils/constants';

export default function TimeSlots({
  dayIndex,
  scheduleItems,
  onDragOver,
  onDragLeave,
  onDrop,
  onOpenModal,
  onRemoveService,
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
                className="h-[28px] rounded bg-white border border-gray-100 px-2 relative"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(dayIndex + 1, time, e)}
              >
                {services.length > 0 && (
                  <div
                    className="absolute inset-0 flex flex-col justify-center bg-white border border-gray-200 rounded shadow-sm px-2"
                    draggable
                    onClick={() => {
                      if (services.length > 1) {
                        onOpenModal(dayIndex + 1, time, services);
                      }
                    }}
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        'text/plain',
                        JSON.stringify({
                          type: 'moveService',
                          data: {
                            service: services[0],
                            sourceDay: dayIndex + 1,
                            sourceTime: time,
                          },
                        })
                      );
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0">
                        <span className="text-[11px] mr-1">{services[0].icon}</span>
                        <span className="text-[9px] truncate">{services[0].name}</span>
                      </div>

                      {services.length === 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveService(dayIndex + 1, time, 0);
                          }}
                          className="text-[9px] text-red-500 hover:text-red-700 ml-1"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {services.length > 1 && (
                      <div className="text-[8px] text-gray-500">
                        +{services.length - 1} dịch vụ khác
                      </div>
                    )}
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
