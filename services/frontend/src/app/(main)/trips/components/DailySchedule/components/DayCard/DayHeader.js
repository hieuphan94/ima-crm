'use client';

import { removeDay } from '@/store/slices/useDailyScheduleSlice';
import { memo, useCallback, useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import DayNameModal from './DayNameModal';
import DayViewModal from './DayViewModal';
import DeleteDayModal from './DeleteDayModal';

const DayHeader = memo(function DayHeader({ dayId, order, daySchedule, updateDayTitle }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();

  // Lấy titleOfDay từ daySchedule nếu có
  const titleOfDay = daySchedule?.titleOfDay || '';

  // Chuẩn bị data cho modal
  const prepareModalData = useCallback(() => {
    const services = [];
    const guides = [];
    const { distance, price } = handleGetDistancePrice();

    const priceOfDistance = {
      dayId: dayId + 1,
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
  }, [daySchedule, dayId, handleGetDistancePrice]);

  const handleSaveDayName = useCallback(
    (day, name) => {
      updateDayTitle(dayId + 1, name);
      setIsNameModalOpen(false);
    },
    [dayId, updateDayTitle]
  );

  const handleGetDistancePrice = useCallback(() => {
    const dayContainer = document.getElementById(`day-${dayId}`);
    if (!dayContainer) return { distance: 0, price: 0 };

    const elements = {
      distance: dayContainer.querySelector('.distance-input'),
      price: dayContainer.querySelector('.price-value'),
    };

    const distance = elements.distance ? parseFloat(elements.distance.value) || 0 : 0;
    const price = elements.price ? parseFloat(elements.price.textContent) || 0 : 0;

    return { distance, price };
  }, [dayId]);

  const handleDeleteDay = useCallback(() => {
    dispatch(removeDay({ dayId }));
    setIsDeleteModalOpen(false);
  }, [dayId, dispatch]);

  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-1">
        <h3
          className={`font-medium text-xs cursor-pointer hover:text-blue-600 ${
            titleOfDay ? 'text-green-600' : 'text-yellow-600'
          }`}
          onClick={() => setIsNameModalOpen(true)}
        >
          Day {order}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
          >
            <FiEye size={14} />
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <DayViewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          day={dayId + 1}
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
          day={dayId + 1}
          initialName={titleOfDay}
          onSave={handleSaveDayName}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteDayModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteDay}
      />
    </>
  );
}, arePropsEqual);

function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.dayId === nextProps.dayId &&
    JSON.stringify(prevProps.daySchedule) === JSON.stringify(nextProps.daySchedule)
  );
}

export default DayHeader;
