'use client';

import { memo, useCallback, useState } from 'react';
import DayViewModal from './DayViewModal';

const DayHeader = memo(function DayHeader({ dayIndex, daySchedule }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Giữ lại handleExport để dùng sau
  const handleExport = useCallback(() => {
    const exportData = {
      day: dayIndex + 1,
      schedule: {},
      exportedAt: new Date().toISOString(),
    };

    if (daySchedule) {
      Object.entries(daySchedule).forEach(([time, services]) => {
        if (services && services.length > 0) {
          exportData.schedule[time] = services.map((service) => ({
            id: service.id,
            name: service.name,
            type: service.type,
            icon: service.icon,
          }));
        }
      });
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `day-${dayIndex + 1}-schedule.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [dayIndex, daySchedule]);

  // Chuẩn bị data cho modal
  const prepareModalData = useCallback(() => {
    const services = [];
    const guides = [];

    if (daySchedule) {
      Object.entries(daySchedule).forEach(([time, timeServices]) => {
        timeServices.forEach((service) => {
          if (service.type === 'guide') {
            guides.push(service.name);
          }
          services.push({
            name: `${time} - ${service.name}`,
            price: service.price || 0,
          });
        });
      });
    }

    return { services, guides };
  }, [daySchedule]);

  return (
    <>
      <div className="mb-1 flex items-center justify-between">
        <h3 className="font-medium text-gray-900 text-xs">Day {dayIndex + 1}</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
        >
          View
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <DayViewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          day={dayIndex + 1}
          {...prepareModalData()}
          distance={0} // Bạn có thể thêm logic tính khoảng cách ở đây
        />
      )}
    </>
  );
}, arePropsEqual);

function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.dayIndex === nextProps.dayIndex &&
    JSON.stringify(prevProps.daySchedule) === JSON.stringify(nextProps.daySchedule)
  );
}

export default DayHeader;
