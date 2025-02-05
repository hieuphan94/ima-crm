'use client';

import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { calculatePrice } from '../../utils/calculations';
import { EXCHANGE_RATE } from '../../utils/constants';
import { convertVNDtoUSD, formatCurrency } from '../../utils/formatters';

function DayViewModal({ isOpen, onClose, order, dayId, titleOfDay, guides = [] }) {
  if (!isOpen) return null;

  // Add distance selector
  const distance = useSelector((state) => state.dailySchedule.scheduleItems[dayId]?.distance || 0);

  const { starRating } = useSelector((state) => state.dailySchedule.settings);

  const daySchedule = useSelector((state) => state.dailySchedule.scheduleItems[dayId]);
  if (!daySchedule) {
    console.warn('Day not found:', dayId);
    return null;
  }

  const { globalPax } = useSelector((state) => state.dailySchedule.settings);
  const paxChangeOfDay = useSelector(
    (state) => state.dailySchedule.scheduleItems[dayId]?.paxChangeOfDay || ''
  );

  const paxCalculate = paxChangeOfDay ? paxChangeOfDay : globalPax;

  const handleDistancePrice = (distance) => {
    if (paxCalculate) {
      return calculatePrice(distance, paxCalculate);
    }
    return 0;
  };

  // Helper function để convert time string sang minutes
  const convertTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Memoize normalized services
  const normalizedServices = useMemo(() => {
    if (!daySchedule) return [];

    // Helper function để tính price dựa vào star rating
    const calculatePriceByStarRating = (type, mealType) => {
      // Nếu là food và là bữa sáng thì return 0 ngay từ đầu
      if (type === 'food' && mealType === 'breakfast') {
        return 0;
      } else if (type === 'food') {
        const pax = paxChangeOfDay || globalPax;
        switch (starRating) {
          case 3:
            return EXCHANGE_RATE.VND_TO_USD * 2 * pax;
          case 4:
            return EXCHANGE_RATE.VND_TO_USD * 5 * pax;
          case 5:
            return EXCHANGE_RATE.VND_TO_USD * 10 * pax;
          default:
            return EXCHANGE_RATE.VND_TO_USD * pax;
        }
      }
    };

    const timeKeys = Object.keys(daySchedule).filter((key) => /^\d/.test(key));

    return timeKeys
      .flatMap((timeKey) => {
        const timeSlotServices = Array.isArray(daySchedule[timeKey]) ? daySchedule[timeKey] : [];

        return timeSlotServices.map((service) => {
          let price = 0;
          let name = '';

          if (service.type === 'food') {
            price = calculatePriceByStarRating('food', service.meal.mealType);
            name = service.name.split(' - ').slice(1).join(' - ');
          } else {
            price = service.price;
            name = service.name;
          }
          return {
            time: timeKey,
            timeInMinutes: convertTimeToMinutes(timeKey),
            name,
            price,
            priceUSD: convertVNDtoUSD(price),
            type: service.type,
          };
        });
      })
      .sort((a, b) => a.timeInMinutes - b.timeInMinutes);
  }, [daySchedule, globalPax, paxChangeOfDay, starRating]);

  // Memoize totals calculation
  const { totalUSD } = useMemo(() => {
    const servicesTotal = normalizedServices.reduce((sum, service) => sum + service.price, 0);
    const distancePrice = handleDistancePrice(distance) || 0;
    const total = servicesTotal + distancePrice;
    const totalUSD = convertVNDtoUSD(total);

    return { servicesTotal, distancePrice, total, totalUSD };
  }, [normalizedServices, distance]);

  // Lấy paragraph từ state
  const dayParagraph = useSelector(
    (state) => state.dailySchedule.scheduleItems[dayId]?.paragraphDay?.paragraphTotal || ''
  );

  // Đơn giản hóa handleClose
  const handleClose = () => {
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-medium text-xl text-gray-900">Day {order}</h3>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors duration-200"
              onClick={() => {
                /* Export logic */
              }}
            >
              Export
            </button>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-xl transition-colors duration-200"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Sub headings */}
          {titleOfDay && <div className="text-lg font-medium text-gray-700">{titleOfDay}</div>}

          {guides.length > 0 && (
            <div className="text-sm text-gray-600">Hướng dẫn viên: {guides.join(', ')}</div>
          )}

          {/* Box content */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Box label */}
            <div className="grid grid-cols-12 gap-4 bg-gray-50 p-3 border-b border-gray-200 text-sm font-medium text-gray-600">
              <div className="col-span-1">STT</div>
              <div className="col-span-2">Giờ</div>
              <div className="col-span-6">Tên dịch vụ</div>
              <div className="col-span-3 text-right">Giá</div>
            </div>

            {/* List services */}
            <div className="divide-y divide-gray-200">
              {normalizedServices
                .filter((service) => service.type !== 'food') // Chỉ lọc food services ở UI
                .map((service, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 p-3 text-sm">
                    <div className="col-span-1 text-gray-500">{index + 1}</div>
                    <div className="col-span-2 text-gray-600">{service.time}</div>
                    <div className="col-span-6">{service.name}</div>
                    <div className="col-span-3 text-right">
                      {formatCurrency(service.priceUSD, 'USD')}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Distance and price */}
          <div className="grid grid-cols-12 gap-4 p-3 text-sm border-t border-gray-200">
            <div className="col-span-1"></div>
            <div className="col-span-2"></div>
            <div className="col-span-6">Khoảng cách di chuyển ({distance}km)</div>
            <div className="col-span-3 text-right">
              {formatCurrency(convertVNDtoUSD(handleDistancePrice(distance) || 0), 'USD')}
            </div>
          </div>

          {/* Meals - Lấy từ paragraphTotal */}
          <div className="grid grid-cols-12 gap-4 p-3 text-sm border-t border-gray-200">
            <div className="col-span-1"></div>
            <div className="col-span-2"></div>
            <div className="col-span-9">
              {dayParagraph.split('\n\n').find((p) => p.includes('Les repas inclus :'))}
            </div>
          </div>

          {/* Total */}
          <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium bg-gray-50 rounded-lg">
            <div className="col-span-1"></div>
            <div className="col-span-2"></div>
            <div className="col-span-6">Tổng cộng</div>
            <div className="col-span-3 text-right">{formatCurrency(totalUSD, 'USD')}</div>
          </div>

          {/* Day Description - Sử dụng paragraphTotal */}
          {dayParagraph && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Giới thiệu hành trình</h4>
              <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-line">
                {dayParagraph}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

DayViewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.number.isRequired,
  dayId: PropTypes.string.isRequired,
  titleOfDay: PropTypes.string,
  services: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  guides: PropTypes.arrayOf(PropTypes.string),
};

export default DayViewModal;
