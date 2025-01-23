'use client';

import { memo } from 'react';
import { useSelector } from 'react-redux';
import { SLOT_HEIGHT, TIME_GROUPS } from '../utils/constants';

const TimeSlotsSidebar = memo(function TimeSlotsSidebar({ expandedSlots, onToggleTime }) {
  const scheduleItems = useSelector((state) => state.dailySchedule.scheduleItems);

  // Helper function để kiểm tra xem time slot có dịch vụ không
  const hasServicesInHalfHour = (time) => {
    const halfHourTime = `${time.split(':')[0]}:30`;
    // Kiểm tra tất cả các ngày
    return Object.values(scheduleItems).some((day) => {
      return day[halfHourTime]?.length > 0;
    });
  };

  return (
    <div style={{ paddingTop: '62px' }} className="w-12">
      {TIME_GROUPS.map((group, groupIndex) => (
        <div key={group.label} className={groupIndex !== 0 ? 'mt-2' : ''}>
          {group.slots.map((time) => (
            <div key={time} className="mb-1">
              {/* Regular time slot */}
              <div style={{ height: SLOT_HEIGHT }} className={`relative group`}>
                <div
                  className={`
                    h-full
                    text-[10px] text-gray-600
                    flex items-center justify-between px-2
                    ${group.bgColor} ${group.borderColor} border-r-2
                  `}
                >
                  <span>{time}</span>
                  <button
                    onClick={() => onToggleTime(time)}
                    className={`
                      w-5 h-5 rounded-full 
                      bg-white hover:bg-gray-100
                      border border-gray-300 hover:border-gray-400
                      text-gray-500 hover:text-gray-700
                      flex items-center justify-center
                      shadow-sm hover:shadow
                      text-xs font-medium
                      ${hasServicesInHalfHour(time) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                      transition-opacity duration-200
                    `}
                  >
                    {expandedSlots[time] ? '−' : '+'}
                  </button>
                </div>
              </div>

              {/* 30-min slot */}
              {expandedSlots[time] && (
                <div style={{ height: SLOT_HEIGHT }} className={`mt-1`}>
                  <div
                    className={`
                      h-full
                      text-[10px] text-gray-600
                      flex items-center px-2
                      ${group.bgColor} bg-opacity-50
                      border-r-2 border-dashed ${group.borderColor}
                    `}
                  >
                    <span>{time.split(':')[0]}:30</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}, arePropsEqual);

function arePropsEqual(prevProps, nextProps) {
  return (
    JSON.stringify(prevProps.expandedSlots) === JSON.stringify(nextProps.expandedSlots) &&
    prevProps.onToggleTime === nextProps.onToggleTime
  );
}

export default TimeSlotsSidebar;
