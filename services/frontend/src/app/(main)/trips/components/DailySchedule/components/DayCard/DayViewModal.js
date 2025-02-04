'use client';

import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { calculatePrice } from '../../utils/calculations';
import { EXCHANGE_RATE } from '../../utils/constants';
import { convertVNDtoUSD, formatCurrency } from '../../utils/formatters';

function DayViewModal({ isOpen, onClose, order, dayId, titleOfDay, services = [], guides = [] }) {
  if (!isOpen) return null;

  // Add distance selector
  const distance = useSelector((state) => state.dailySchedule.scheduleItems[dayId]?.distance || 0);

  const { starRating } = useSelector((state) => state.dailySchedule.settings);

  const daySchedule = useSelector((state) => state.dailySchedule.scheduleItems[dayId]);

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

  // Add meal selector
  const dayMeals = useSelector(
    (state) =>
      state.dailySchedule.scheduleItems[dayId]?.meals || {
        included: true,
        breakfast: true,
        lunch: false,
        dinner: false,
      }
  );

  // Format meal text
  const getMealText = () => {
    if (!daySchedule) return 'Không bao gồm bữa ăn';

    const meals = Object.keys(daySchedule)
      .filter((key) => /^\d/.test(key)) // Get only time keys
      .flatMap((timeKey) => {
        const services = Array.isArray(daySchedule[timeKey]) ? daySchedule[timeKey] : [];
        return services
          .filter((service) => service.type === 'food' && service.meal?.mealType)
          .map((service) => {
            switch (service.meal.mealType) {
              case 'breakfast':
                return 'Sáng';
              case 'lunch':
                return 'Trưa';
              case 'dinner':
                return 'Tối';
              default:
                return null;
            }
          })
          .filter(Boolean);
      });

    return meals.length > 0
      ? `Bao gồm bữa: ${[...new Set(meals)].join(', ')}`
      : 'Không bao gồm bữa ăn';
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

  console.log(normalizedServices);

  // Memoize totals calculation
  const { totalUSD } = useMemo(() => {
    console.log(normalizedServices);
    const servicesTotal = normalizedServices.reduce((sum, service) => sum + service.price, 0);
    const distancePrice = handleDistancePrice(distance) || 0;
    const total = servicesTotal + distancePrice;
    const totalUSD = convertVNDtoUSD(total);

    return { servicesTotal, distancePrice, total, totalUSD };
  }, [normalizedServices, distance]);

  // Track used connectors
  let availableConnectors = ['Ensuite, ', 'Puis, ', 'Après, '];

  const getRandomConnector = () => {
    // Reset if all connectors have been used
    if (availableConnectors.length === 0) {
      availableConnectors = ['Ensuite, ', 'Puis, ', 'Après, '];
    }

    // Get random index and remove the selected connector
    const randomIndex = Math.floor(Math.random() * availableConnectors.length);
    const connector = availableConnectors[randomIndex];
    availableConnectors.splice(randomIndex, 1);

    return connector;
  };

  const formatPeriodText = (timeKeys) => {
    // Reset available connectors for each new period
    availableConnectors = ['Ensuite, ', 'Puis, ', 'Après, '];

    if (!timeKeys.length) return '';
    return timeKeys
      .sort()
      .map((timeKey, index) => {
        const timelineItems = daySchedule[timeKey];
        if (!Array.isArray(timelineItems)) return '';
        const sentences = timelineItems
          .map((item) => item?.sentence || '')
          .filter((sentence) => sentence);

        if (sentences.length === 0) return '';

        let formattedSentence = sentences.join(' ');
        if (index > 0) {
          const connector = getRandomConnector();
          formattedSentence =
            connector + formattedSentence.charAt(0).toLowerCase() + formattedSentence.slice(1);
        }
        return formattedSentence;
      })
      .filter((sentence) => sentence)
      .join(' ');
  };

  // Build the description
  const dayDescription = useMemo(() => {
    if (!daySchedule) return '';

    const timeKeys = Object.keys(daySchedule).filter((key) => /^\d/.test(key));
    const periods = {
      morning: timeKeys
        .filter((key) => {
          const hour = parseInt(key.split(':')[0]);
          return hour >= 6 && hour < 12;
        })
        .sort(),
      afternoon: timeKeys
        .filter((key) => {
          const hour = parseInt(key.split(':')[0]);
          return hour >= 12 && hour < 17;
        })
        .sort(),
      evening: timeKeys
        .filter((key) => {
          const hour = parseInt(key.split(':')[0]);
          return hour >= 17 && hour < 21;
        })
        .sort(),
    };

    let description = '';

    // Morning section
    if (periods.morning.length) {
      description += 'En matinée, ';
      const morningText = formatPeriodText(periods.morning);
      description += morningText.charAt(0).toLowerCase() + morningText.slice(1);
      description += '\n\n';
    }

    // Lunch section
    description += 'Déjeuner au resto.\n\n';

    // Afternoon section
    if (periods.afternoon.length) {
      description += 'En après-midi, ';
      const afternoonText = formatPeriodText(periods.afternoon);
      description += afternoonText.charAt(0).toLowerCase() + afternoonText.slice(1);
      description += '\n\n';
    }

    // Evening section
    if (periods.evening.length) {
      const eveningText = formatPeriodText(periods.evening);
      if (eveningText) {
        const connector = getRandomConnector();
        description += connector + eveningText.charAt(0).toLowerCase() + eveningText.slice(1);
        description += '\n\n';
      }
    }

    // Hotel info
    const hotelName = daySchedule.hotel || "l'hotel";
    description += `Dîner à ${hotelName}.\n`;
    description += `Nuit à ${hotelName}.`;

    return description;
  }, [daySchedule]);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay with blur effect */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-overlay-appear"
        onClick={onClose}
      />

      {/* Modal with animation */}
      <div
        className="
        relative bg-white rounded-lg shadow-2xl w-[800px] max-h-[80vh] overflow-y-auto
        animate-modal-appear
        transform transition-all
        z-[10000]
      "
      >
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
              onClick={onClose}
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

          {/* Meals */}
          <div className="grid grid-cols-12 gap-4 p-3 text-sm border-t border-gray-200">
            <div className="col-span-1"></div>
            <div className="col-span-2"></div>
            <div className="col-span-9">{getMealText()}</div>
          </div>

          {/* Total */}
          <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium bg-gray-50 rounded-lg">
            <div className="col-span-1"></div>
            <div className="col-span-2"></div>
            <div className="col-span-6">Tổng cộng</div>
            <div className="col-span-3 text-right">{formatCurrency(totalUSD, 'USD')}</div>
          </div>

          {/* Day Description */}
          {dayDescription && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Giới thiệu hành trình</h4>
              <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-line">
                {dayDescription}
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
