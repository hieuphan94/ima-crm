'use client';

import { memo, useCallback, useState } from 'react';
import DayNameModal from './DayNameModal';
import DayViewModal from './DayViewModal';

const DayHeader = memo(function DayHeader({ dayIndex, daySchedule, updateDayTitle }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  // Lấy titleOfDay từ daySchedule nếu có
  const titleOfDay = daySchedule?.titleOfDay || '';

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
      updateDayTitle(dayIndex + 1, name);
      setIsNameModalOpen(false);
    },
    [dayIndex, updateDayTitle]
  );

  const handleGetDistancePrice = useCallback(() => {
    const dayContainer = document.getElementById(`day-${dayIndex}`);
    if (!dayContainer) return { distance: 0, price: 0 };

    const elements = {
      distance: dayContainer.querySelector('.distance-input'),
      price: dayContainer.querySelector('.price-value'),
    };

    const distance = elements.distance ? parseFloat(elements.distance.value) || 0 : 0;
    const price = elements.price ? parseFloat(elements.price.textContent) || 0 : 0;

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
