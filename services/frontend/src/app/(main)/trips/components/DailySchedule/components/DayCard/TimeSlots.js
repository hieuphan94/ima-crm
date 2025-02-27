'use client';

import { memo, useCallback } from 'react';
import { HOTEL_SLOT_HEIGHT, SLOT_HEIGHT, TIME_GROUPS } from '../../utils/constants';

const TimeSlots = memo(function TimeSlots({
  dayId,
  order,
  daySchedule,
  expandedSlots = {},
  onDragOver,
  onDragLeave,
  onDrop,
  onOpenModal,
  onRemoveService,
}) {
  const day = dayId;

  // Helper function để lấy services cho một time slot
  const getServices = useCallback(
    (time) => {
      return daySchedule[time] || [];
    },
    [daySchedule]
  );

  // Chuyển sortServices thành useCallback
  // const sortServices = useCallback(
  //   (services) => {
  //     return [...services].sort((a, b) => {
  //       if (a.type !== b.type) {
  //         return a.type < b.type ? -1 : 1;
  //       }
  //       return a.name.localeCompare(b.name);
  //     });
  //   },
  //   [daySchedule]
  // );

  return (
    <div>
      {TIME_GROUPS.map((group, groupIndex) => (
        <div key={`${dayId}-${group.label}`} className={groupIndex !== 0 ? 'mt-2' : ''}>
          {group.slots.map((time) => {
            const services = getServices(time);
            const sortedServices = services;
            const isHotel = time === '23:00';
            return (
              <div key={`${dayId}-${time}`} className="mb-1">
                <div
                  style={{ height: isHotel ? HOTEL_SLOT_HEIGHT : SLOT_HEIGHT }}
                  className={`rounded px-2 relative ${
                    isHotel ? group.bgColorHotel : group.bgColor
                  } ${isHotel ? group.borderColorHotel : group.borderColor} border`}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(day, time, e)}
                >
                  {sortedServices.length > 0 && (
                    <div
                      className="absolute inset-0 flex flex-col justify-center bg-white border border-gray-200 rounded shadow-sm px-2"
                      draggable
                      onClick={() => onOpenModal(day, time, sortedServices)}
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
                            className="text-[15px] text-red-500 hover:text-red-700 ml-1"
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

                {expandedSlots[time] && !isHotel && (
                  <div
                    style={{ height: SLOT_HEIGHT }}
                    className={`mt-1 rounded px-2 relative 
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
                                className="text-[15px] text-red-500 hover:text-red-700 ml-1"
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
}, arePropsEqual);

function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.dayId === nextProps.dayId &&
    JSON.stringify(prevProps.daySchedule) === JSON.stringify(nextProps.daySchedule) &&
    JSON.stringify(prevProps.expandedSlots) === JSON.stringify(nextProps.expandedSlots) &&
    prevProps.onDragOver === nextProps.onDragOver &&
    prevProps.onDragLeave === nextProps.onDragLeave &&
    prevProps.onDrop === nextProps.onDrop &&
    prevProps.onOpenModal === nextProps.onOpenModal &&
    prevProps.onRemoveService === nextProps.onRemoveService
  );
}

export default TimeSlots;
