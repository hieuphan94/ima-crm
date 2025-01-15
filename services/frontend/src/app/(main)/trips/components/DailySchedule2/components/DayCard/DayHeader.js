'use client';

import { memo, useCallback, useState } from 'react';
import DayNameModal from './DayNameModal';
import DayViewModal from './DayViewModal';

const DayHeader = memo(function DayHeader({ dayIndex, daySchedule }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  // Lấy titleOfDay từ daySchedule nếu có
  const titleOfDay = daySchedule?.titleOfDay || '';

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
    const { distance, price } = handleGetDistancePrice();

    const priceOfDistance = {
      dayIndex: dayIndex + 1,
      distance,
      priceDt: price,
    };

    if (daySchedule) {
      Object.entries(daySchedule).forEach(([time, timeServices]) => {
        if (time === 'titleOfDay') return;

        if (Array.isArray(timeServices)) {
          timeServices.forEach((service) => {
            if (service.type === 'guide') {
              guides.push(service.name);
            }
            services.push({
              name: `${time} - ${service.name}`,
              price: service.price || 0,
            });
          });
        }
      });
    }

    const modalData = {
      services,
      guides,
      priceOfDistance,
      titleOfDay: daySchedule?.titleOfDay || '',
    };

    return modalData;
  }, [daySchedule, dayIndex, handleGetDistancePrice]);

  const handleSaveDayName = useCallback(
    (day, name) => {
      // Thêm titleOfDay vào daySchedule
      if (daySchedule) {
        daySchedule.titleOfDay = name;
      }
      setIsNameModalOpen(false);
    },
    [daySchedule]
  );

  const handleGetDistancePrice = useCallback(() => {
    const dayContainer = document.querySelector(`.day-container[data-day="${dayIndex}"]`);
    if (!dayContainer) return { distance: 0, price: 0 };

    const distanceInput = dayContainer.querySelector('.distance-input');
    const priceElement = dayContainer.querySelector('.price-value');

    const distance = distanceInput ? parseFloat(distanceInput.value) || 0 : 0;
    const price = priceElement ? parseFloat(priceElement.textContent) || 0 : 0;

    return { distance, price };
  }, [dayIndex]);

  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-1">
        <h3
          className={`font-medium text-xs cursor-pointer hover:text-blue-600 ${
            titleOfDay ? 'text-green-600' : 'text-yellow-600'
          }`}
          onClick={() => setIsNameModalOpen(true)}
        >
          Day {dayIndex + 1}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
          >
            View
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <DayViewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          day={dayIndex + 1}
          titleOfDay={daySchedule?.titleOfDay || ''}
          {...prepareModalData()}
          distance={0} // Bạn có thể thêm logic tính khoảng cách ở đây
        />
      )}

      {/* Add DayNameModal */}
      {isNameModalOpen && (
        <DayNameModal
          isOpen={isNameModalOpen}
          onClose={() => setIsNameModalOpen(false)}
          day={dayIndex + 1}
          initialName={titleOfDay}
          onSave={handleSaveDayName}
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
