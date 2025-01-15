'use client';

import PropTypes from 'prop-types';
import { convertVNDtoUSD, formatCurrency } from '../../utils/formatters';

function DayViewModal({
  isOpen,
  onClose,
  day,
  titleOfDay,
  services = [],
  guides = [],
  priceOfDistance,
}) {
  if (!isOpen) return null;

  const normalizeServices = () => {
    return services.map((service) => {
      const [time, ...nameParts] = service.name.split(' - ');
      const serviceName = nameParts.join(' - ');

      let price = 0;
      if (typeof service.price === 'string') {
        price = parseInt(service.price.replace(/[,đ]/g, ''), 10) || 0;
      } else if (typeof service.price === 'number') {
        price = service.price;
      }

      return {
        time,
        name: serviceName,
        price,
        priceUSD: convertVNDtoUSD(price),
      };
    });
  };

  const calculateTotal = () => {
    const servicesTotal = normalizeServices().reduce((sum, service) => sum + service.price, 0);
    const distancePrice = priceOfDistance?.priceDt || 0;
    const total = servicesTotal + distancePrice;
    const totalUSD = convertVNDtoUSD(total);

    return { servicesTotal, distancePrice, total, totalUSD };
  };

  const normalizedServices = normalizeServices();
  const { totalUSD } = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[800px] max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-medium text-xl text-gray-900">Day {day}</h3>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
              onClick={() => {
                /* Export logic */
              }}
            >
              Export
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
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
              {normalizedServices.map((service, index) => (
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
            <div className="col-span-6">
              Khoảng cách di chuyển ({priceOfDistance?.distance || 0}km)
            </div>
            <div className="col-span-3 text-right">
              {formatCurrency(convertVNDtoUSD(priceOfDistance?.priceDt || 0), 'USD')}
            </div>
          </div>

          {/* Total */}
          <div className="grid grid-cols-12 gap-4 p-3 text-sm font-medium bg-gray-50 rounded-lg">
            <div className="col-span-1"></div>
            <div className="col-span-2"></div>
            <div className="col-span-6">Tổng cộng</div>
            <div className="col-span-3 text-right">{formatCurrency(totalUSD, 'USD')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

DayViewModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  day: PropTypes.number.isRequired,
  titleOfDay: PropTypes.string,
  services: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  guides: PropTypes.arrayOf(PropTypes.string),
  priceOfDistance: PropTypes.shape({
    dayIndex: PropTypes.number,
    distance: PropTypes.number,
    priceDt: PropTypes.number,
  }),
};

export default DayViewModal;
