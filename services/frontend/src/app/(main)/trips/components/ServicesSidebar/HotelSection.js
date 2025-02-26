import { VIETNAM_LOCATIONS } from '@/constants/vietnam-locations';
import { useEffect, useState } from 'react';
import { IoIosArrowDown, IoIosArrowForward, IoIosSearch } from 'react-icons/io';
import HotelTooltip from './components/HotelTooltip';
import LocationButton from './components/LocationButton';
import SearchInput from './components/SearchInput';
import { sectionColors, serviceItemStyles } from './constants/styles';
import { formatPrice, removeVietnameseTones } from './utils/formatters';
import { LocationCache } from './utils/locationCache';

export default function HotelSection({
  openCountry,
  setOpenCountry,
  selectedLocation,
  onLocationSelect,
  sheetAccommodationServices,
  setSheetAccommodationServices,
}) {
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [currentServicePage, setCurrentServicePage] = useState(0);
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const locationsPerPage = 8;
  const servicesPerPage = 7;
  const [loadingLocation, setLoadingLocation] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipService, setTooltipService] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getPaginatedLocations = (locationsFromCountry) => {
    if (!locationsFromCountry) return [];
    const startIndex = currentPage * locationsPerPage;
    return locationsFromCountry.slice(startIndex, startIndex + locationsPerPage);
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
        const searchMatch = service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase());
        return locationMatch && searchMatch;
      }) || [];

    return filteredServices.slice(startIndex, startIndex + servicesPerPage);
  };

  const handleScroll = (direction) => {
    if (direction === 'left') {
      setCurrentPage(Math.max(0, currentPage - 1));
    } else {
      const maxPages = Math.ceil(VIETNAM_LOCATIONS.length / locationsPerPage);
      setCurrentPage(Math.min(maxPages - 1, currentPage + 1));
    }
  };

  useEffect(() => {
    setOpenCountry('Việt Nam');
    handleLocationClick('Hà Nội');
  }, []);

  const normalizeLocationName = (name) => {
    if (!name) return '';
    return removeVietnameseTones(name)
      .toLowerCase()
      .replace(/\s+/g, '') // remove spaces
      .replace(/[^a-z0-9]/g, ''); // remove special characters
  };

  const handleLocationClick = async (locationName) => {
    if (selectedLocation === locationName) {
      onLocationSelect(null);
      return;
    }

    try {
      setLoadingLocation(locationName);
      const normalizedLocation = normalizeLocationName(locationName);
      const accommodationCacheKey = 'accommodation-' + normalizedLocation.toString();
      // Check cache first
      const cachedServices = LocationCache.get(accommodationCacheKey);
      if (cachedServices?.length > 0) {
        setSheetAccommodationServices(cachedServices);
        onLocationSelect(locationName);
        return;
      }

      const response = await fetch(
        `/api/sheet-accommodation?location=${encodeURIComponent(normalizedLocation)}`
      );
      const result = await response.json();

      // Xử lý kết quả API tốt hơn
      if (result.success) {
        if (result.data?.length > 0) {
          setSheetAccommodationServices(result.data);
          LocationCache.set(accommodationCacheKey, result.data);
          onLocationSelect(locationName);
        } else {
          onLocationSelect(locationName);
        }
      } else {
        // API trả về lỗi
        console.error('API Error:', result.message);
        // Không set empty array, giữ nguyên state cũ
        onLocationSelect(locationName);
      }
    } catch (error) {
      // Network/parsing error
      console.error('Request failed:', error);
      // Không set empty array, giữ nguyên state cũ
      onLocationSelect(locationName);
    } finally {
      setLoadingLocation(null);
    }
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

  const filteredLocations = (locations) => {
    if (!locations) return [];
    return locations.filter((location) =>
      removeVietnameseTones(location.name.toLowerCase()).includes(
        removeVietnameseTones(locationSearchTerm.toLowerCase())
      )
    );
  };

  return (
    <div className="pb-2 border-b-2 border-gray-300">
      <button
        onClick={() => setOpenCountry(openCountry === 'Việt Nam' ? null : 'Việt Nam')}
        className={`w-full flex items-center justify-between text-[10px] font-medium p-1 rounded 
          ${sectionColors.visit.bg} ${sectionColors.visit.text} ${sectionColors.visit.hover}`}
      >
        <span>Accommodation</span>
        {openCountry === 'Việt Nam' ? (
          <IoIosArrowDown className="h-2.5 w-2.5" />
        ) : (
          <IoIosArrowForward className="h-2.5 w-2.5" />
        )}
      </button>

      {openCountry === 'Việt Nam' && (
        <>
          <div className="relative mt-1 mb-1">
            <input
              type="text"
              placeholder="Tìm địa điểm..."
              value={locationSearchTerm}
              onChange={(e) => {
                setLocationSearchTerm(e.target.value);
                setCurrentPage(0);
              }}
              className="w-full text-[9px] p-1 pr-6 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <IoIosSearch className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 h-3 w-3" />
          </div>

          <div className="mt-1 relative">
            <div className="flex items-center">
              <button
                onClick={() => handleScroll('left')}
                className={`absolute left-0 z-10 bg-white/80 hover:bg-white hover:text-gray-800 rounded-full w-2 h-2 flex items-center justify-center shadow-sm ${
                  currentPage === 0 ? 'text-gray-300' : 'text-gray-600'
                }`}
                disabled={currentPage === 0}
              >
                ‹
              </button>
              <div id="locations-container" className="mx-3 w-full">
                <div className="grid grid-cols-4 gap-0.5 auto-rows-max overflow-hidden">
                  {getPaginatedLocations(filteredLocations(VIETNAM_LOCATIONS)).map((location) => (
                    <LocationButton
                      key={location.id}
                      location={location}
                      selected={selectedLocation === location.name}
                      loading={loadingLocation === location.name}
                      onClick={handleLocationClick}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleScroll('right')}
                className={`absolute right-0 z-10 bg-white/80 hover:bg-white hover:text-gray-800 rounded-full w-2 h-2 flex items-center justify-center shadow-sm ${
                  currentPage >=
                  Math.ceil(filteredLocations(VIETNAM_LOCATIONS).length / locationsPerPage) - 1
                    ? 'text-gray-300'
                    : 'text-gray-600'
                }`}
                disabled={
                  currentPage >=
                  Math.ceil(filteredLocations(VIETNAM_LOCATIONS).length / locationsPerPage) - 1
                }
              >
                ›
              </button>
            </div>
          </div>

          {selectedLocation && (
            <div className="mt-2">
              <div className="relative flex gap-1">
                <SearchInput
                  value={serviceSearchTerm}
                  onChange={(e) => {
                    setServiceSearchTerm(e.target.value);
                    setCurrentServicePage(0);
                  }}
                  placeholder="Tìm kiếm visit..."
                  className="bg-white"
                />
              </div>

              <div className="mt-1 space-y-0.5">
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
                    className={serviceItemStyles.container}
                  >
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                      <span className={serviceItemStyles.text.icon}>{service.icon || '🏨'}</span>
                      <span className={`${serviceItemStyles.text.name} truncate`}>
                        {service.name}
                      </span>
                    </div>
                    <span className={`${serviceItemStyles.text.price} shrink-0`}>
                      {formatPrice(service.rooms.price.fit_price)}
                    </span>
                  </div>
                ))}
              </div>

              {totalPages >= 1 && (
                <div className="flex justify-center gap-0.5 mt-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        handleServicePageChange(i);
                      }}
                      className={`text-[9px] w-5 h-4 rounded flex items-center justify-center transition-colors
                        ${
                          currentServicePage === i
                            ? 'bg-emerald-100 text-emerald-700'
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
        </>
      )}

      <HotelTooltip service={tooltipService} visible={tooltipVisible} position={tooltipPosition} />
    </div>
  );
}
