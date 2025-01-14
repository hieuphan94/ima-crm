'use client';

import { memo } from 'react';
import { TIME_GROUPS } from '../../utils/constants';

function TimeSlots({
  dayIndex,
  scheduleItems,
  onDragOver,
  onDragLeave,
  onDrop,
  onOpenModal,
  onRemoveService,
}) {
  // Helper function để sắp xếp services
  const sortServices = (services) => {
    return [...services].sort((a, b) => {
      // Ưu tiên sắp xếp theo type (nếu có)
      if (a.type !== b.type) {
        return a.type < b.type ? -1 : 1;
      }
      // Sau đó sắp xếp theo name
      return a.name.localeCompare(b.name);
    });
  };

  return (
    <>
      {TIME_GROUPS.map((group, groupIndex) => (
        <div key={`${dayIndex}-${group.label}`} className={groupIndex !== 0 ? 'mt-2' : ''}>
          {group.slots.map((time) => {
            const slotKey = `${dayIndex + 1}-${time}`;
            const services = scheduleItems[slotKey] || [];
            const sortedServices = sortServices(services); // Sắp xếp services

            return (
              <div
                key={`${dayIndex}-${time}`}
                className="h-[28px] rounded bg-white border border-gray-100 px-2 relative"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(dayIndex + 1, time, e)}
              >
                {sortedServices.length > 0 && (
                  <div
                    className="absolute inset-0 flex flex-col justify-center bg-white border border-gray-200 rounded shadow-sm px-2"
                    draggable
                    onClick={() => {
                      onOpenModal(dayIndex + 1, time, sortedServices);
                    }}
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        'text/plain',
                        JSON.stringify({
                          type: 'moveService',
                          data: {
                            service: sortedServices[0],
                            sourceDay: dayIndex + 1,
                            sourceTime: time,
                          },
                        })
                      );
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0">
                        <span className="text-[11px] mr-1">{sortedServices[0].icon}</span>
                        <span className="text-[9px] truncate">{sortedServices[0].name}</span>
                      </div>

                      {sortedServices.length === 1 && (
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

                    {sortedServices.length > 1 && (
                      <div className="text-[8px] text-gray-500">
                        +{sortedServices.length - 1} dịch vụ khác
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

export default memo(TimeSlots);
