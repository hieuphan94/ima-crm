import { VIETNAM_LOCATIONS } from '@/constants/vietnam-locations';
import { useEffect, useState } from 'react';
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosRefresh,
  IoIosSearch,
  IoIosWarning,
} from 'react-icons/io';
import LocationButton from './components/LocationButton';
import SearchInput from './components/SearchInput';
import ServiceTooltip from './components/ServiceTooltip';
import UpdateModal from './components/UpdateModal';
import { sectionColors, serviceItemStyles } from './constants/styles';
import { formatPrice, removeVietnameseTones } from './utils/formatters';
import { LocationCache } from './utils/locationCache';

export default function VisitSection({
  openCountry,
  setOpenCountry,
  selectedLocation,
  onLocationSelect,
  sheetServices,
  setSheetServices,
  mockChanges,
  hasChanges,
  setHasChanges,
  showModal,
  setShowModal,
  isRefreshed,
  setIsRefreshed,
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

  const countries = [
    {
      name: 'Việt Nam',
      locations: VIETNAM_LOCATIONS.map((location) => ({
        id: location.id,
        name: location.name,
        region: location.region,
        coordinates: location.coordinates,
        services: sheetServices.filter((service) =>
          service.locations.some(
            (loc) =>
              removeVietnameseTones(loc.toLowerCase()) ===
              removeVietnameseTones(location.name.toLowerCase())
          )
        ),
      })),
    },
  ];

  const filteredLocations = (locations) => {
    return locations.filter((location) =>
      removeVietnameseTones(location.name.toLowerCase()).includes(
        removeVietnameseTones(locationSearchTerm.toLowerCase())
      )
    );
  };

  const getPaginatedLocations = (locations) => {
    const startIndex = currentPage * locationsPerPage;
    return locations.slice(startIndex, startIndex + locationsPerPage);
  };

  const getPaginatedServices = (services) => {
    const startIndex = currentServicePage * servicesPerPage;
    return services.slice(startIndex, startIndex + servicesPerPage);
  };

  const handleScroll = (direction) => {
    if (direction === 'left') {
      setCurrentPage(Math.max(0, currentPage - 1));
    } else {
      const maxPages = Math.ceil(
        filteredLocations(countries[0].locations).length / locationsPerPage
      );
      setCurrentPage(Math.min(maxPages - 1, currentPage + 1));
    }
  };

  const handleRefreshServices = () => {
    if (selectedLocation) {
      onLocationSelect(selectedLocation);
      setHasChanges(false);
      setIsRefreshed(true);
      setTimeout(() => {
        setIsRefreshed(false);
      }, 2000);
    }
  };

  useEffect(() => {
    setOpenCountry('Việt Nam');
    handleLocationClick('Hà Nội');
  }, []);

  const handleLocationClick = async (locationName) => {
    if (selectedLocation === locationName) {
      onLocationSelect(null);
      return;
    }

    try {
      setLoadingLocation(locationName);

      // Check cache
      const cachedServices = LocationCache.get(locationName);
      if (cachedServices?.length > 0) {
        setSheetServices(cachedServices);
        onLocationSelect(locationName);
        return;
      }

      // Fetch from API
      const response = await fetch(`/api/sheet?location=${encodeURIComponent(locationName)}`);

      const result = await response.json();
      console.log('result', result);

      if (result.success) {
        setSheetServices(result.data);

        // Cache successful results
        if (result.data?.length > 0) {
          LocationCache.set(locationName, result.data);
        }

        onLocationSelect(locationName);
      } else {
        setSheetServices([]);
      }
    } catch (error) {
      setSheetServices([]);
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

  const totalPages = Math.ceil(
    (countries[0]?.locations
      .find((loc) => loc.name === selectedLocation)
      ?.services.filter((service) =>
        service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
      )?.length || 0) / servicesPerPage
  );

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
    <div className="pb-2 border-b-2 border-gray-300">
      {countries.map((country) => (
        <div key={country.name}>
          <button
            onClick={() => setOpenCountry(openCountry === country.name ? null : country.name)}
            className={`w-full flex items-center justify-between text-[10px] font-medium p-1 rounded 
              ${sectionColors.visit.bg} ${sectionColors.visit.text} ${sectionColors.visit.hover}`}
          >
            <span>{country.name}</span>
            {openCountry === country.name ? (
              <IoIosArrowDown className="h-2.5 w-2.5" />
            ) : (
              <IoIosArrowForward className="h-2.5 w-2.5" />
            )}
          </button>

          {openCountry === country.name && (
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
                      {getPaginatedLocations(filteredLocations(country.locations)).map(
                        (location) => (
                          <LocationButton
                            key={location.id}
                            location={location}
                            selected={selectedLocation === location.name}
                            loading={loadingLocation === location.name}
                            onClick={handleLocationClick}
                          />
                        )
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleScroll('right')}
                    className={`absolute right-0 z-10 bg-white/80 hover:bg-white hover:text-gray-800 rounded-full w-2 h-2 flex items-center justify-center shadow-sm ${
                      currentPage >=
                      Math.ceil(filteredLocations(country.locations).length / locationsPerPage) - 1
                        ? 'text-gray-300'
                        : 'text-gray-600'
                    }`}
                    disabled={
                      currentPage >=
                      Math.ceil(filteredLocations(country.locations).length / locationsPerPage) - 1
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
                    {hasChanges && (
                      <button
                        onClick={() => setShowModal(true)}
                        className="p-1 rounded bg-amber-50 hover:bg-amber-100 border border-amber-200"
                      >
                        <IoIosWarning className="w-3 h-3 text-amber-500" />
                      </button>
                    )}
                    <button
                      onClick={handleRefreshServices}
                      className={`p-1 rounded border transition-colors duration-200 ${
                        isRefreshed
                          ? 'bg-green-50 hover:bg-green-100 border-green-200'
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <IoIosRefresh
                        className={`w-3 h-3 ${isRefreshed ? 'text-green-500' : 'text-gray-500'}`}
                      />
                    </button>
                  </div>

                  <div className="mt-1 space-y-0.5">
                    {getPaginatedServices(
                      countries[0].locations
                        .find((loc) => loc.name === selectedLocation)
                        ?.services.filter((service) =>
                          service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
                        ) || []
                    ).map((service) => (
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
                          <span className={serviceItemStyles.text.icon}>
                            {service.icon || '🏛️'}
                          </span>
                          <span className={`${serviceItemStyles.text.name} truncate`}>
                            {service.name}
                          </span>
                        </div>
                        <span className={`${serviceItemStyles.text.price} shrink-0`}>
                          {formatPrice(service.price)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center gap-0.5 mt-2">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => handleServicePageChange(i)}
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
        </div>
      ))}

      <ServiceTooltip
        service={tooltipService}
        visible={tooltipVisible}
        position={tooltipPosition}
      />

      <UpdateModal
        showModal={showModal}
        setShowModal={setShowModal}
        mockChanges={mockChanges}
        handleRefreshServices={handleRefreshServices}
      />
    </div>
  );
}
