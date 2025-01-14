'use client';

import { memo } from 'react';
import { SLOT_HEIGHT, TIME_GROUPS } from '../../utils/constants';

function TimeSlots({
  dayIndex,
  daySchedule,
  expandedSlots = {},
  onDragOver,
  onDragLeave,
  onDrop,
  onOpenModal,
  onRemoveService,
}) {
  const day = dayIndex + 1;

  // Helper function để lấy services cho một time slot
  const getServices = (time) => {
    return daySchedule[time] || [];
  };

  // Helper function để sắp xếp services - không thay đổi
  const sortServices = (services) => {
    return [...services].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type < b.type ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  };

  return (
    <div>
      {TIME_GROUPS.map((group, groupIndex) => (
        <div key={`${dayIndex}-${group.label}`} className={groupIndex !== 0 ? 'mt-2' : ''}>
          {group.slots.map((time) => {
            const services = getServices(time);
            const sortedServices = sortServices(services);

            return (
              <div key={`${dayIndex}-${time}`} className="mb-1">
                <div
                  className={`h-[${SLOT_HEIGHT}px] rounded px-2 relative ${group.bgColor} ${group.borderColor} border`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(day, time, e)}
                >
                  {sortedServices.length > 0 && (
                    <div
                      className="absolute inset-0 flex flex-col justify-center bg-white border border-gray-200 rounded shadow-sm px-2"
                      draggable
                      onClick={() => {
                        onOpenModal(day, time, sortedServices);
                      }}
                      onDragStart={(e) => {
                        e.dataTransfer.setData(
                          'text/plain',
                          JSON.stringify({
                            type: 'moveService',
                            data: {
                              service: sortedServices[0],
                              sourceDay: day,
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
                              onRemoveService(day, time, 0);
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

                {expandedSlots[time] && (
                  <div
                    className={`h-[${SLOT_HEIGHT}px] mt-1 rounded px-2 relative 
                      ${group.bgColor} bg-opacity-50 border border-dashed ${group.borderColor}`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={(e) => onDrop(day, `${time.split(':')[0]}:30`, e)}
                  >
                    {(() => {
                      const halfHourTime = `${time.split(':')[0]}:30`;
                      const halfHourServices = getServices(halfHourTime);

                      if (halfHourServices.length === 0) return null;

                      return (
                        <div
                          className="absolute inset-0 flex flex-col justify-center bg-white border border-gray-200 rounded shadow-sm px-2"
                          draggable
                          onClick={() => {
                            onOpenModal(day, halfHourTime, halfHourServices);
                          }}
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              'text/plain',
                              JSON.stringify({
                                type: 'moveService',
                                data: {
                                  service: halfHourServices[0],
                                  sourceDay: day,
                                  sourceTime: halfHourTime,
                                },
                              })
                            );
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center min-w-0">
                              <span className="text-[11px] mr-1">{halfHourServices[0].icon}</span>
                              <span className="text-[9px] truncate">
                                {halfHourServices[0].name}
                              </span>
                            </div>

                            {halfHourServices.length === 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveService(day, halfHourTime, 0);
                                }}
                                className="text-[9px] text-red-500 hover:text-red-700 ml-1"
                              >
                                ×
                              </button>
                            )}
                          </div>

                          {halfHourServices.length > 1 && (
                            <div className="text-[8px] text-gray-500">
                              +{halfHourServices.length - 1} dịch vụ khác
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default memo(TimeSlots);
