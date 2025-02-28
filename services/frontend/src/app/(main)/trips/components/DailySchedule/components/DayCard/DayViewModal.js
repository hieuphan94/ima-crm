'use client';

import TiptapEditor from '@/components/TiptapEditor';
import {
  setDayGuide,
  updateDayParagraph,
  updateDayTitle,
} from '@/store/slices/useDailyScheduleSlice';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiCheck, FiEdit2, FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { calculatePrice } from '../../utils/calculations';
import {
  convertVNDtoUSD,
  formatMeal,
  formulaFoodPriceByStarRating,
  normalizedServices,
} from '../../utils/formatters';

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

function DayViewModal({ isOpen, onClose, order, dayId }) {
  const dispatch = useDispatch();
  const daySchedule = useSelector((state) => state.dailySchedule.scheduleItems[dayId]);
  const settings = useSelector((state) => state.dailySchedule.settings);
  const paxChangeOfDay = useSelector((state) => state.dailySchedule.paxChangeOfDay);

  const paragraphTotal = daySchedule?.paragraphDay?.paragraphTotal || '';
  // Get guide state from store, default to true if not set
  const hasGuide = daySchedule?.guide?.included ?? true;

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [images, setImages] = useState([]);
  const [searchTemplate, setSearchTemplate] = useState('');
  const [isEditingParagraph, setIsEditingParagraph] = useState(false);
  const [editedParagraph, setEditedParagraph] = useState(paragraphTotal);

  if (!isOpen || typeof window === 'undefined') return null;

  if (!daySchedule) {
    console.warn('Day not found:', dayId);
    return null;
  }

  const { globalPax, starRating } = settings;
  const { distance, titleOfDay } = daySchedule;

  // Services contain visit, food, hotel
  const services = normalizedServices(daySchedule);

  // Pax calculate
  const paxCalculate = paxChangeOfDay !== undefined ? paxChangeOfDay : globalPax;

  const handleDistancePrice = (distance) => {
    if (typeof paxCalculate === 'number' && paxCalculate > 0) {
      return calculatePrice(distance, paxCalculate);
    }
    return 0;
  };

  // Totals calculation
  const { totalUSD } = useMemo(() => {
    let servicesTotal = 0;
    servicesTotal += services.visit.reduce((sum, service) => sum + (service.price || 0), 0);
    servicesTotal += formulaFoodPriceByStarRating(services.food, starRating, paxCalculate);
    servicesTotal += services.accommodation.reduce(
      (sum, service) => sum + (service.rooms.price.fit_price || 0),
      0
    );

    const distancePrice = convertVNDtoUSD(handleDistancePrice(distance) || 0);
    const totalUSD = convertVNDtoUSD(servicesTotal) + distancePrice;

    return { servicesTotal, distancePrice, totalUSD };
  }, [services, distance]);

  // TITLE
  const handleSaveTitle = () => {
    dispatch(updateDayTitle({ day: dayId, title: editedTitle }));
    setIsEditingTitle(false);
  };

  const handleCancelEditTitle = () => {
    setIsEditingTitle(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEditTitle();
    }
  };

  // IMAGE
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

  // TEMPLATE
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

  // PARAGRAPH
  const handleSaveParagraph = () => {
    dispatch(
      updateDayParagraph({
        dayId,
        paragraphTotal: editedParagraph,
      })
    );
    setIsEditingParagraph(false);
  };

  const debouncedUpdateParagraph = useCallback(
    debounce((content) => {
      setEditedParagraph(content);
    }, 300),
    []
  );

  const handleStartEditing = () => {
    setEditedParagraph(paragraphTotal);
    setIsEditingParagraph(true);
  };

  const handleCancelEdit = () => {
    setEditedParagraph(paragraphTotal);
    setIsEditingParagraph(false);
  };

  // Update the guide handler
  const handleGuideChange = (included) => {
    dispatch(setDayGuide({ dayId, included }));
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto">
        {/* Header & Title, Location and Guides */}
        <div className="p-2 border-b border-gray-200 flex items-center justify-between">
          <span className="font-medium text-md text-gray-900">Jour {order}</span>
          <span className="font-medium text-blue-600">📍 {titleOfDay}</span>
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
                      {'Day Title...'}
                    </button>
                  )}
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
            {/* Guide */}
            <div className="grid grid-cols-12 gap-4 p-1.5 text-sm border-t border-gray-200">
              <div className="col-span-12 flex items-center gap-4">
                <span className="font-medium">Guide:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="guide"
                    checked={hasGuide}
                    onChange={() => handleGuideChange(true)}
                    className="form-radio text-blue-600"
                  />
                  <span className="text-gray-700">Có Guide</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="guide"
                    checked={!hasGuide}
                    onChange={() => handleGuideChange(false)}
                    className="form-radio text-blue-600"
                  />
                  <span className="text-gray-700">Không có Guide</span>
                </label>
              </div>
            </div>
            {/* Services List */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 gap-4 bg-gray-200 p-1.5 border-b border-gray-200 text-sm font-medium text-gray-600">
                <div className="col-span-1">STT</div>
                <div className="col-span-2">Giờ</div>
                <div className="col-span-6">Tên dịch vụ</div>
                <div className="col-span-3 text-right">Giá</div>
              </div>

              <div className="divide-y divide-gray-200">
                {services.visit.map((service, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 p-1.5 text-sm">
                    <div className="col-span-1 text-gray-500">{index + 1}</div>
                    <div className="col-span-2 text-gray-600">{service.timeKey}</div>
                    <div className="col-span-6">{service.name}</div>
                    <div className="col-span-3 text-right">{convertVNDtoUSD(service.price)}</div>
                  </div>
                ))}
                {services.accommodation.map((service, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 p-1.5 text-sm">
                    <div className="col-span-1 text-gray-500">{index + 1}</div>
                    <div className="col-span-2 text-gray-600">{service.timeKey}</div>
                    <div className="col-span-6">{service.name}</div>
                    <div className="col-span-3 text-right">
                      {convertVNDtoUSD(service.rooms.price.fit_price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distance and Price */}
            <div className="grid grid-cols-12 gap-4 p-1.5 text-sm border-t border-gray-200">
              <div className="col-span-9">Distance ({distance}km)</div>
              <div className="col-span-3 text-right">
                {convertVNDtoUSD(handleDistancePrice(distance))}
              </div>
            </div>

            {/* Meals from daySchedule.meals */}
            <div className="grid grid-cols-12 p-1.5 text-sm border-t border-gray-200">
              <div className="col-span-12">
                <span className="font-medium mb-2">Repas: {formatMeal(daySchedule)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="grid grid-cols-12 gap-4 p-1.5 text-sm font-medium bg-yellow-100 rounded-lg">
              <div className="col-span-9">Total</div>
              <div className="col-span-3 text-right">{totalUSD}</div>
            </div>
          </div>
        </div>

        {/* Paragraph Section */}
        <div className="p-2 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[12px] font-medium text-blue-900 bg-gray-200 p-1.5 rounded-lg">
              Présentation du voyage
            </h4>
            <button
              onClick={handleStartEditing}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              <FiEdit2 size={16} />
            </button>
          </div>

          {isEditingParagraph ? (
            <div className="space-y-2">
              <TiptapEditor content={editedParagraph} onChange={debouncedUpdateParagraph} />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveParagraph}
                  className="px-3 py-1 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div
              className="text-[11px] text-blue-800 leading-relaxed bg-blue-50 p-3 rounded-lg"
              dangerouslySetInnerHTML={{
                __html: paragraphTotal || '',
              }}
            />
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
};

export default DayViewModal;
