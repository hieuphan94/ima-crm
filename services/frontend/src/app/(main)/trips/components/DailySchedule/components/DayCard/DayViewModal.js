'use client';

import { removeDay, updateDayTitle } from '@/store/slices/useDailyScheduleSlice';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiCheck, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { calculatePrice } from '../../utils/calculations';
import { EXCHANGE_RATE } from '../../utils/constants';
import { convertVNDtoUSD, formatCurrency } from '../../utils/formatters';
import DayNameModal from './DayNameModal';
import DeleteDayModal from './DeleteDayModal';

// Tách component cho phần template giống DayNameModal
const DayTemplateList = ({ searchTemplate, onSelect, templates }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTemplates = useMemo(
    () =>
      templates.filter((template) =>
        template.name.toLowerCase().includes(searchTemplate.toLowerCase())
      ),
    [searchTemplate, templates]
  );

  const pageCount = Math.ceil(filteredTemplates.length / itemsPerPage);
  const currentTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="border border-gray-200 rounded">
      <div className="max-h-40 overflow-y-auto">
        {currentTemplates.map((template) => (
          <div
            key={template.id}
            className="p-2 hover:bg-gray-50 cursor-pointer text-[9px]"
            onClick={() => onSelect(template)}
          >
            {template.name}
          </div>
        ))}
      </div>
      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-1 p-1 border-t border-gray-200">
          {[...Array(pageCount)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-5 h-5 text-[9px] rounded ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function DayViewModal({ isOpen, onClose, order, dayId, titleOfDay, guides = [] }) {
  const dispatch = useDispatch();
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(titleOfDay || '');
  const [images, setImages] = useState([]);
  const [searchTemplate, setSearchTemplate] = useState('');

  if (!isOpen || typeof window === 'undefined') return null;

  const distance = useSelector((state) => state.dailySchedule.scheduleItems[dayId]?.distance || 0);
  const { starRating } = useSelector((state) => state.dailySchedule.settings);
  const daySchedule = useSelector((state) => state.dailySchedule.scheduleItems[dayId]);

  if (!daySchedule) {
    console.warn('Day not found:', dayId);
    return null;
  }

  const { globalPax } = useSelector((state) => state.dailySchedule.settings);
  const paxChangeOfDay = daySchedule.paxChangeOfDay || '';
  const paxCalculate = paxChangeOfDay || globalPax;

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

  // Add this memoized location aggregation
  const aggregatedLocation = useMemo(() => {
    if (!daySchedule) return '';

    const timeKeys = Object.keys(daySchedule)
      .filter((key) => /^\d/.test(key))
      .sort(); // Sort time keys to ensure chronological order

    const locations = new Set();
    let firstServiceLocations = []; // Store first service's locations separately

    // Find first service with locations
    for (const timeKey of timeKeys) {
      const timeSlotServices = Array.isArray(daySchedule[timeKey]) ? daySchedule[timeKey] : [];
      for (const service of timeSlotServices) {
        if (Array.isArray(service.locations) && service.locations.length > 0) {
          firstServiceLocations = service.locations.map((loc) => loc.trim());
          break;
        }
      }
      if (firstServiceLocations.length > 0) break;
    }

    // Collect all other locations
    timeKeys.forEach((timeKey) => {
      const timeSlotServices = Array.isArray(daySchedule[timeKey]) ? daySchedule[timeKey] : [];
      timeSlotServices.forEach((service) => {
        if (Array.isArray(service.locations)) {
          service.locations.forEach((loc) => {
            if (loc) locations.add(loc.trim());
          });
        }
      });
    });

    // Combine locations with first service's locations taking priority
    const result = [
      ...firstServiceLocations,
      ...Array.from(locations).filter((loc) => !firstServiceLocations.includes(loc)),
    ]
      .filter(Boolean)
      .join(' - ');

    return result;
  }, [daySchedule]);

  // Split location string into first location and remaining locations
  const [firstLocation, ...otherLocations] = aggregatedLocation
    ? aggregatedLocation.split(' - ')
    : [];

  // Replace the existing location selector with our aggregated location
  const location = aggregatedLocation;

  const handleSaveDayName = (name) => {
    dispatch(updateDayTitle({ day: dayId, title: name }));
    setIsNameModalOpen(false);
  };

  const handleDeleteDay = useCallback(() => {
    dispatch(removeDay({ dayId }));
    onClose(); // Close the modal after deletion
  }, [dayId, dispatch, onClose]);

  const handleSaveTitle = () => {
    dispatch(updateDayTitle({ day: dayId, title: editedTitle }));
    setIsEditingTitle(false);
  };

  const handleCancelEditTitle = () => {
    setEditedTitle(titleOfDay || '');
    setIsEditingTitle(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEditTitle();
    }
  };

  const handleImageUpload = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 3) {
        alert('Chỉ được chọn tối đa 3 hình');
        return;
      }
      setImages((prev) => [...prev, ...files].slice(0, 3));
    },
    [images.length]
  );

  const handleRemoveImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const dayTemplates = useMemo(
    () => [
      { id: 1, name: 'City Tour Hà Nội' },
      { id: 2, name: 'Vịnh Hạ Long' },
      { id: 3, name: 'Sapa Trekking' },
      { id: 4, name: 'Phố Cổ Hội An' },
      { id: 5, name: 'Đà Lạt Tour' },
      { id: 6, name: 'Đà Lạt Tour' },
      { id: 7, name: 'Đà Lạt Tour' },
      { id: 8, name: 'Đà Lạt Tour' },
      { id: 9, name: 'Đà Lạt Tour' },
      { id: 10, name: 'Đà Lạt Tour' },
    ],
    []
  );

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        {/* Header & Title, Location and Guides */}
        <div className="p-2 border-b border-gray-200 flex items-center justify-between">
          <span className="font-medium text-md text-gray-900">Day {order}</span>
          {titleOfDay && <span className="text-sm font-sm text-gray-700">{titleOfDay}</span>}
          {location && (
            <span className="text-sm font-sm text-gray-700 bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
              <span className="font-medium text-blue-600">📍 {firstLocation}</span>
              {otherLocations.length > 0 && (
                <>
                  <span className="text-gray-400 mx-1">-</span>
                  <span className="text-gray-600">{otherLocations.join(' - ')}</span>
                </>
              )}
            </span>
          )}
          {guides.length > 0 && (
            <span className="text-sm text-gray-600">Guides: {guides.join(', ')}</span>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl transition-colors duration-200"
          >
            ×
          </button>
        </div>

        {/* Main Content */}
        <div className="flex p-2 gap-3">
          {/* Left Column - 30% */}
          <div className="w-[30%] space-y-2">
            {/* Day Information Box */}
            <div className="border rounded-lg p-2 space-y-2">
              <div className="flex items-center justify-between">
                {/* Day Name Input */}
                <div className="relative">
                  {isEditingTitle ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1 px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Day title..."
                        autoFocus
                      />
                      <button
                        onClick={handleSaveTitle}
                        className="p-2 text-green-600 hover:bg-green-50 rounded"
                        title="Lưu"
                      >
                        <FiCheck size={16} />
                      </button>
                      <button
                        onClick={handleCancelEditTitle}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                        title="Hủy"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className="w-full px-4 py-2 text-[9px] text-left text-blue-600 bg-blue-50 rounded hover:bg-blue-100 flex items-center gap-2"
                    >
                      <FiEdit2 size={14} />
                      {titleOfDay || 'Day Title...'}
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Xóa ngày"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-1">
                <div className="flex gap-2 mb-2">
                  {images.map((file, index) => (
                    <div key={index} className="relative w-16 h-16">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {images.length < 3 && (
                    <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-400">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        multiple
                      />
                      <span className="text-3xl text-gray-400">+</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Template Selection Section */}
              <div className="space-y-1">
                <input
                  type="text"
                  value={searchTemplate}
                  onChange={(e) => setSearchTemplate(e.target.value)}
                  placeholder="Find day template..."
                  className="w-full p-1 text-[9px] border border-gray-200 rounded focus:outline-none focus:border-blue-300 mb-1"
                />
                <DayTemplateList
                  searchTemplate={searchTemplate}
                  onSelect={(template) => {
                    dispatch(updateDayTitle({ day: dayId, title: template.name }));
                  }}
                  templates={dayTemplates}
                />
              </div>
            </div>
          </div>

          {/* Right Column - 70% */}
          <div className="w-[70%] space-y-2">
            {/* Services List */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 gap-4 bg-gray-200 p-1.5 border-b border-gray-200 text-sm font-medium text-gray-600">
                <div className="col-span-1">STT</div>
                <div className="col-span-2">Giờ</div>
                <div className="col-span-6">Tên dịch vụ</div>
                <div className="col-span-3 text-right">Giá</div>
              </div>

              <div className="divide-y divide-gray-200">
                {normalizedServices
                  .filter((service) => service.type !== 'food')
                  .map((service, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 p-1.5 text-sm">
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

            {/* Distance and Price */}
            <div className="grid grid-cols-12 gap-4 p-1.5 text-sm border-t border-gray-200">
              <div className="col-span-9">Distance ({distance}km)</div>
              <div className="col-span-3 text-right">
                {formatCurrency(convertVNDtoUSD(handleDistancePrice(distance)), 'USD')}
              </div>
            </div>

            {/* Meals from daySchedule.meals */}
            <div className="grid grid-cols-12 gap-4 p-1.5 text-sm border-t border-gray-200">
              <div className="col-span-9">
                <span className="font-medium mb-2">Repas en journée: </span>
                {daySchedule.meals.breakfast.included && (
                  <span>Petit déjeuner: {daySchedule.meals.breakfast.type}, </span>
                )}
                {daySchedule.meals.lunch.included && (
                  <span>Déjeuner: {daySchedule.meals.lunch.type}, </span>
                )}
                {daySchedule.meals.dinner.included && (
                  <span>Dîner: {daySchedule.meals.dinner.type}</span>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="grid grid-cols-12 gap-4 p-1.5 text-sm font-medium bg-gray-100 rounded-lg">
              <div className="col-span-9">Total</div>
              <div className="col-span-3 text-right">{formatCurrency(totalUSD, 'USD')}</div>
            </div>
          </div>
        </div>

        {/* Paragraph Section */}
        <div className="p-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="text-[12px] font-medium text-blue-900 bg-gray-200 p-1.5 rounded-lg">
              Présentation du voyage
            </h4>
          </div>

          <div
            className="text-[11px] text-blue-800 leading-relaxed bg-blue-50 p-3 rounded-lg"
            dangerouslySetInnerHTML={{
              __html: daySchedule?.paragraphDay?.paragraphTotal || '',
            }}
          />
        </div>
      </div>

      {/* Modals */}
      {isNameModalOpen && (
        <DayNameModal
          isOpen={isNameModalOpen}
          onClose={() => setIsNameModalOpen(false)}
          order={order}
          dayId={dayId}
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
  guides: PropTypes.arrayOf(PropTypes.string),
};

export default DayViewModal;
