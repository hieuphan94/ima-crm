'use client';

import { memo } from 'react';
import { SLOT_HEIGHT, TIME_GROUPS } from '../../utils/constants';

function TimeSlots({
  dayIndex,
  scheduleItems,
  expandedSlots = {},
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

  // Helper để check expanded state an toàn
  const isTimeExpanded = (time) => {
    return (expandedSlots && expandedSlots[time]) || false;
  };

  return (
    <div>
      {TIME_GROUPS.map((group, groupIndex) => (
        <div key={`${dayIndex}-${group.label}`} className={groupIndex !== 0 ? 'mt-2' : ''}>
          {group.slots.map((time) => {
            const slotKey = `${dayIndex + 1}-${time}`;
            const services = scheduleItems[slotKey] || [];
            const sortedServices = sortServices(services); // Sắp xếp services

            return (
              <div key={`${dayIndex}-${time}`} className="mb-1">
                <div
                  className={`h-[${SLOT_HEIGHT}px] rounded px-2 relative ${group.bgColor} ${group.borderColor} border`}
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

                {expandedSlots[time] && (
                  <div
                    className={`h-[${SLOT_HEIGHT}px] mt-1 rounded px-2 relative 
                      ${group.bgColor} bg-opacity-50 border border-dashed ${group.borderColor}`}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={(e) => onDrop(dayIndex + 1, `${time.split(':')[0]}:30`, e)}
                  >
                    {scheduleItems[`${dayIndex + 1}-${time.split(':')[0]}:30`]?.length > 0 && (
                      <div
                        className="absolute inset-0 flex flex-col justify-center bg-white border border-gray-200 rounded shadow-sm px-2"
                        draggable
                        onClick={() => {
                          onOpenModal(
                            dayIndex + 1,
                            `${time.split(':')[0]}:30`,
                            scheduleItems[`${dayIndex + 1}-${time.split(':')[0]}:30`]
                          );
                        }}
                        onDragStart={(e) => {
                          e.dataTransfer.setData(
                            'text/plain',
                            JSON.stringify({
                              type: 'moveService',
                              data: {
                                service:
                                  scheduleItems[`${dayIndex + 1}-${time.split(':')[0]}:30`][0],
                                sourceDay: dayIndex + 1,
                                sourceTime: `${time.split(':')[0]}:30`,
                              },
                            })
                          );
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center min-w-0">
                            <span className="text-[11px] mr-1">
                              {scheduleItems[`${dayIndex + 1}-${time.split(':')[0]}:30`][0].icon}
                            </span>
                            <span className="text-[9px] truncate">
                              {scheduleItems[`${dayIndex + 1}-${time.split(':')[0]}:30`][0].name}
                            </span>
                          </div>

                          {scheduleItems[`${dayIndex + 1}-${time.split(':')[0]}:30`].length ===
                            1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveService(dayIndex + 1, `${time.split(':')[0]}:30`, 0);
                              }}
                              className="text-[9px] text-red-500 hover:text-red-700 ml-1"
                            >
                              ×
                            </button>
                          )}
                        </div>

                        {scheduleItems[`${dayIndex + 1}-${time.split(':')[0]}:30`].length > 1 && (
                          <div className="text-[8px] text-gray-500">
                            +{scheduleItems[`${dayIndex + 1}-${time.split(':')[0]}:30`].length - 1}{' '}
                            dịch vụ khác
                          </div>
                        )}
                      </div>
                    )}
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
