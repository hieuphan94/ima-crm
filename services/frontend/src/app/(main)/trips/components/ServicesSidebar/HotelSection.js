import { useEffect, useState } from 'react';
import HotelTooltip from './components/HotelTooltip';
import SearchInput from './components/SearchInput';
import { sectionColors, serviceItemStyles } from './constants/styles';
import { formatPrice, removeVietnameseTones } from './utils/formatters';
export default function HotelSection({
  openCountry,
  setOpenCountry,
  selectedLocation,
  sheetAccommodationServices,
}) {
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [currentServicePage, setCurrentServicePage] = useState(0);
  const servicesPerPage = 7;
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipService, setTooltipService] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setServiceSearchTerm('');
    setCurrentServicePage(0);
  }, [sheetAccommodationServices]);

  const normalizeLocationName = (name) => {
    if (!name) return '';
    return removeVietnameseTones(name)
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');
  };

  const getPaginatedServices = (services) => {
    if (!services || !Array.isArray(services)) {
      return [];
    }

    const startIndex = currentServicePage * servicesPerPage;
    const filteredServices =
      sheetAccommodationServices?.filter((service) => {
        const normalizedServiceLocation = normalizeLocationName(service.location);
        const normalizedSelectedLocation = normalizeLocationName(selectedLocation);
        const locationMatch = normalizedServiceLocation === normalizedSelectedLocation;

        // Chuẩn hóa cả tên dịch vụ và từ khóa tìm kiếm
        const normalizedServiceName = removeVietnameseTones(service.name.toLowerCase());
        const normalizedSearchTerm = removeVietnameseTones(serviceSearchTerm.toLowerCase());

        // Kiểm tra cả có dấu và không dấu
        const searchMatch =
          service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase()) || // tìm có dấu
          normalizedServiceName.includes(normalizedSearchTerm); // tìm không dấu

        return locationMatch && searchMatch;
      }) || [];

    return filteredServices.slice(startIndex, startIndex + servicesPerPage);
  };

  const handleServiceMouseEnter = (e, service) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: rect.right - 50,
      y: rect.top - 100,
    });
    setTooltipService(service);
    setTooltipVisible(true);
  };

  const handleServiceMouseLeave = () => {
    setTooltipVisible(false);
    setTooltipService(null);
  };

  const filteredServices =
    sheetAccommodationServices?.filter((service) => {
      const normalizedServiceLocation = normalizeLocationName(service.location);
      const normalizedSelectedLocation = normalizeLocationName(selectedLocation);
      const locationMatch = normalizedServiceLocation === normalizedSelectedLocation;
      const searchMatch = service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase());
      return locationMatch && searchMatch;
    }) || [];

  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);

  const handleServicePageChange = (pageNumber) => {
    setCurrentServicePage(pageNumber);
  };

  const handleDragStart = (e, service) => {
    setTooltipVisible(false);
    setTooltipService(null);

    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        type: 'service',
        data: service,
      })
    );
    e.target.classList.add('opacity-50');
  };

  return (
    <div className="pb-0 bg-gray-100">
      <div
        // onClick={() => setOpenCountry(openCountry === 'Việt Nam' ? null : 'Việt Nam')}
        className={`w-full flex items-center justify-between text-[10px] font-medium p-1 rounded 
          ${sectionColors.hotel.bg} ${sectionColors.hotel.text} ${sectionColors.hotel.hover}`}
      >
        <span>Accommodation</span>
        {/* {openCountry === 'Việt Nam' ? (
          <IoIosArrowDown className="h-2.5 w-2.5" />
        ) : (
          <IoIosArrowForward className="h-2.5 w-2.5" />
        )} */}
        <div className="relative w-[100px]">
          <SearchInput
            value={serviceSearchTerm}
            onChange={(e) => {
              setServiceSearchTerm(e.target.value);
              setCurrentServicePage(0);
            }}
            placeholder="Tìm kiếm hotel..."
            className="bg-white"
          />
        </div>
      </div>

      {openCountry === 'Việt Nam' && selectedLocation && (
        <div className="mt-0.5">
          <div className="mt-0.5">
            {getPaginatedServices(sheetAccommodationServices).map((service) => (
              <div
                key={service.id}
                draggable
                onDragStart={(e) => handleDragStart(e, service)}
                onDragEnd={(e) => {
                  e.target.classList.remove('opacity-50');
                }}
                onMouseEnter={(e) => handleServiceMouseEnter(e, service)}
                onMouseLeave={handleServiceMouseLeave}
                className={`${serviceItemStyles.container} border border-gray-200`}
              >
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  <span className={serviceItemStyles.text.icon}>{service.icon || '🏨'}</span>
                  <span className={`${serviceItemStyles.text.name} truncate`}>{service.name}</span>
                </div>
                <span className={`${serviceItemStyles.text.price} shrink-0`}>
                  {formatPrice(service.rooms.price.fit_price)}
                </span>
              </div>
            ))}
          </div>

          {totalPages >= 1 && (
            <div className="flex justify-center gap-0.5 mt-0.5">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handleServicePageChange(i)}
                  className={`text-[9px] w-5 h-4 rounded flex items-center justify-center transition-colors
                    ${
                      currentServicePage === i
                        ? sectionColors.hotel.bg
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <HotelTooltip service={tooltipService} visible={tooltipVisible} position={tooltipPosition} />
    </div>
  );
}
