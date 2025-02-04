'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { formatCurrency } from './DailySchedule/utils/formatters';

function PreviewModal({ isOpen, onClose }) {
  const scheduleItems = useSelector((state) => state.dailySchedule.scheduleItems);
  const { globalPax } = useSelector((state) => state.dailySchedule.settings);
  const [expandedDays, setExpandedDays] = useState({});

  // Sắp xếp các ngày theo order
  const sortedDays = Object.entries(scheduleItems).sort(([, a], [, b]) => a.order - b.order);

  // Format meal text
  const getMealText = (meals) => {
    if (!meals?.included) return 'Không bao gồm bữa ăn';

    const mealList = [];
    if (meals.breakfast) mealList.push('Sáng');
    if (meals.lunch) mealList.push('Trưa');
    if (meals.dinner) mealList.push('Tối');

    return mealList.length > 0 ? `Bao gồm bữa: ${mealList.join(', ')}` : 'Bao gồm bữa ăn';
  };

  // Calculate total price for a day
  const calculateDayTotal = (dayData) => {
    let total = 0;
    Object.entries(dayData).forEach(([key, value]) => {
      if (!['order', 'titleOfDay', 'distance', 'meals', 'paxChangeOfDay'].includes(key)) {
        value.forEach((service) => {
          total += service.price * (dayData.paxChangeOfDay || globalPax);
        });
      }
    });
    return total;
  };

  // Toggle day expansion
  const toggleDay = (dayId) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayId]: !prev[dayId],
    }));
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-[1200px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Preview Lịch Trình</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="divide-y">
            {sortedDays.map(([dayId, dayData]) => {
              const isExpanded = expandedDays[dayId];
              const dayTotal = calculateDayTotal(dayData);

              return (
                <div key={dayId} className="bg-white">
                  {/* Day Header - Always visible */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleDay(dayId)}
                  >
                    <div className="flex items-center gap-4">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-medium">
                          {dayData.order}
                        </div>
                        <h3 className="text-lg font-medium">
                          {dayData.titleOfDay || `Ngày ${dayData.order}`}
                        </h3>
                      </div>
                    </div>
                    <div className="text-lg font-medium">{formatCurrency(dayTotal, 'USD')}</div>
                  </div>

                  {/* Day Details - Expandable */}
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      <div className="ml-12 space-y-4">
                        {/* Services Grid Header */}
                        <div className="grid grid-cols-12 gap-4 py-2 text-sm font-medium text-gray-500">
                          <div className="col-span-2">Thời gian</div>
                          <div className="col-span-7">Dịch vụ</div>
                          <div className="col-span-3 text-right">Giá</div>
                        </div>

                        {/* Services */}
                        {Object.entries(dayData)
                          .filter(
                            ([key]) =>
                              ![
                                'order',
                                'titleOfDay',
                                'distance',
                                'meals',
                                'paxChangeOfDay',
                              ].includes(key)
                          )
                          .map(([time, services]) => (
                            <div
                              key={time}
                              className="grid grid-cols-12 gap-4 py-2 border-t border-gray-100"
                            >
                              <div className="col-span-2 text-sm text-gray-600">{time}</div>
                              <div className="col-span-7 space-y-2">
                                {services.map((service, index) => (
                                  <div key={index}>
                                    <div className="font-medium">{service.name}</div>
                                    {service.description && (
                                      <div className="text-sm text-gray-600">
                                        {service.description}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="col-span-3 space-y-2 text-right">
                                {services.map((service, index) => (
                                  <div key={index}>
                                    <div className="font-medium">
                                      {formatCurrency(
                                        service.price * (dayData.paxChangeOfDay || globalPax),
                                        'USD'
                                      )}
                                    </div>
                                    {service.priceType === 'per_person' && (
                                      <div className="text-xs text-gray-500">
                                        {formatCurrency(service.price, 'USD')}/người
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}

                        {/* Distance */}
                        {dayData.distance > 0 && (
                          <div className="grid grid-cols-12 gap-4 py-2 border-t border-gray-100">
                            <div className="col-span-2"></div>
                            <div className="col-span-10 text-sm text-gray-600">
                              Khoảng cách di chuyển: {dayData.distance}km
                            </div>
                          </div>
                        )}

                        {/* Meals */}
                        <div className="grid grid-cols-12 gap-4 py-2 border-t border-gray-100">
                          <div className="col-span-2"></div>
                          <div className="col-span-10 text-sm text-gray-600">
                            {getMealText(dayData.meals)}
                          </div>
                        </div>

                        {/* Day Total */}
                        <div className="grid grid-cols-12 gap-4 py-2 border-t border-gray-100 font-medium">
                          <div className="col-span-9 text-right">Tổng ngày {dayData.order}:</div>
                          <div className="col-span-3 text-right">
                            {formatCurrency(dayTotal, 'USD')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex justify-between items-center">
            <div className="text-lg font-medium">
              Tổng cộng:{' '}
              {formatCurrency(
                sortedDays.reduce((total, [, dayData]) => total + calculateDayTotal(dayData), 0),
                'USD'
              )}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default PreviewModal;
