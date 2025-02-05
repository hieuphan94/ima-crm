'use client';
import { VIETNAM_LOCATIONS } from '@/constants/vietnam-locations';
import { salesFoodServices } from '@/data/mocks/salesFoodServicesMock';
import { MealType, ServiceType } from '@/data/models/enums';
import { VisitService } from '@/data/models/Service';
import { useState } from 'react';
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosRefresh,
  IoIosSearch,
  IoIosWarning,
} from 'react-icons/io';

export default function ServicesSidebar({ isOperator = false }) {
  const [openCountry, setOpenCountry] = useState(null);
  const [openGuide, setOpenGuide] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [guideSearchTerm, setGuideSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const locationsPerPage = 8;
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [currentServicePage, setCurrentServicePage] = useState(0);
  const servicesPerPage = 7;
  const [hasChanges, setHasChanges] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(false);
  const [openFood, setOpenFood] = useState(false);
  const [foodSearchTerm, setFoodSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sheetServices, setSheetServices] = useState([]);

  const guideLanguages = [
    { id: 'en', label: 'English' },
    { id: 'cn', label: 'Chinese' },
    { id: 'jp', label: 'Japanese' },
    { id: 'kr', label: 'Korean' },
  ];

  const guideRegions = [
    { id: 'north', label: 'North' },
    { id: 'central', label: 'Central' },
    { id: 'south', label: 'South' },
  ];

  const guides = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      icon: '👨‍🦱',
      price: '1,500,000đ/ngày',
      languages: ['en', 'cn'],
      region: 'north',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      icon: '👩‍🦰',
      price: '1,200,000đ/ngày',
      languages: ['en', 'jp'],
      region: 'central',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      icon: '👨‍🦳',
      price: '2,000,000đ/ngày',
      languages: ['en', 'kr'],
      region: 'south',
    },
  ];

  const filterGuides = (guides) => {
    return guides.filter((guide) => {
      const matchesSearch = guide.name.toLowerCase().includes(guideSearchTerm.toLowerCase());
      const matchesLanguage =
        selectedLanguage === 'all' || guide.languages.includes(selectedLanguage);
      const matchesRegion = selectedRegion === 'all' || guide.region === selectedRegion;
      return matchesSearch && matchesLanguage && matchesRegion;
    });
  };

  const handleCountryClick = (countryName) => {
    setOpenCountry(openCountry === countryName ? null : countryName);
    setSelectedLocation(null);
    setServiceSearchTerm('');
    setGuideSearchTerm('');
    setSelectedFilter('all');
  };

  const handleLocationClick = async (locationName) => {
    setSelectedLocation(selectedLocation === locationName ? null : locationName);
    setServiceSearchTerm('');
    setGuideSearchTerm('');
    setSelectedFilter('all');
    setCurrentServicePage(0);

    if (selectedLocation !== locationName) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/sheet?location=${encodeURIComponent(locationName)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();

        const services = data.map((serviceData) => {
          const randomPrice = Math.floor(Math.random() * (500000 - 100000 + 1) + 100000);

          return new VisitService({
            ...serviceData,
            price: randomPrice,
            quotedPrice: randomPrice * 1.2,
            actualPrice: randomPrice * 0.9,
            duration: 0,
            ticketInfo: {},
            openingHours: {},
            highlights: [],
          });
        });

        setSheetServices(services);
      } catch (error) {
        console.error('Error fetching location services:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const countryColors = {
    'Việt Nam': 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    Cambodia: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    Thailand: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    Laos: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    Myanmar: 'bg-rose-100 text-rose-700 hover:bg-rose-200',
  };

  const handleDragStart = (e, service) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        type: 'service',
        data: service,
      })
    );
    e.target.classList.add('opacity-50');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50');
  };

  const getPaginatedLocations = (locations) => {
    const startIndex = currentPage * locationsPerPage;
    return locations.slice(startIndex, startIndex + locationsPerPage);
  };

  const handleScroll = (direction) => {
    if (direction === 'left') {
      setCurrentPage((prev) => Math.max(0, prev - 1));
    } else {
      setCurrentPage((prev) => {
        const maxPage = Math.ceil(countries[0].locations.length / locationsPerPage) - 1;
        return Math.min(maxPage, prev + 1);
      });
    }
  };

  const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    str = str.replace(/Đ/g, 'D');
    return str;
  };

  const filteredLocations = (locations) => {
    if (!locationSearchTerm) return locations;
    const searchTermNormalized = removeVietnameseTones(locationSearchTerm.toLowerCase());
    return locations.filter((location) =>
      removeVietnameseTones(location.name.toLowerCase()).includes(searchTermNormalized)
    );
  };

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

  const getPaginatedServices = (services) => {
    const startIndex = currentServicePage * servicesPerPage;
    return services.slice(startIndex, startIndex + servicesPerPage);
  };

  const mockChanges = {
    added: ['Temple Literature', 'Cyclo Hanoi'],
    updated: ['Pagode Tran Quoc'],
    removed: ['Old Quarter Tour'],
  };

  const handleRefreshServices = () => {
    if (onFetchLocationServices) {
      onFetchLocationServices();
      setHasChanges(false);
      setIsRefreshed(true);
      setTimeout(() => {
        setIsRefreshed(false);
      }, 2000);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '';
    const numericPrice = price.toString().replace(/[^\d]/g, '');
    return numericPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ';
  };

  const getMealTypeName = (mealType) => {
    switch (mealType) {
      case MealType.BREAKFAST:
        return 'Ăn sáng';
      case MealType.LUNCH:
        return 'Ăn trưa';
      case MealType.DINNER:
        return 'Ăn tối';
      default:
        return '';
    }
  };

  const mealTypeColors = {
    [MealType.BREAKFAST]: {
      header: 'text-amber-600 bg-amber-50',
      item: 'hover:bg-amber-50 border-amber-100',
    },
    [MealType.LUNCH]: {
      header: 'text-emerald-600 bg-emerald-50',
      item: 'hover:bg-emerald-50 border-emerald-100',
    },
    [MealType.DINNER]: {
      header: 'text-indigo-600 bg-indigo-50',
      item: 'hover:bg-indigo-50 border-indigo-100',
    },
  };

  return (
    <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-1 overflow-y-auto max-h-[calc(100vh-120px)]">
      <div className="space-y-2">
        <div className="pb-2 border-b-2 border-gray-300">
          {countries.map((country, index) => (
            <div key={country.name} className={index > 0 ? 'mt-1' : ''}>
              <button
                onClick={() => handleCountryClick(country.name)}
                className={`w-full flex items-center justify-between text-[8px] font-medium p-1 rounded
                  ${countryColors[country.name] || 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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
                            (location) => {
                              let regionColor = '';
                              switch (location.region) {
                                case 'north':
                                  regionColor = 'bg-red-50 hover:bg-red-100';
                                  break;
                                case 'central':
                                  regionColor = 'bg-yellow-50 hover:bg-yellow-100';
                                  break;
                                case 'south':
                                  regionColor = 'bg-green-50 hover:bg-green-100';
                                  break;
                                default:
                                  regionColor = 'bg-gray-50 hover:bg-gray-100';
                              }

                              return (
                                <button
                                  key={location.name}
                                  onClick={() => handleLocationClick(location.name)}
                                  className={`text-[9px] p-0.5 rounded transition-colors whitespace-nowrap truncate
                                    ${
                                      selectedLocation === location.name
                                        ? `${countryColors[country.name].replace('50', '100')} border-${
                                            countryColors[country.name].split('-')[1]
                                          }-200`
                                        : `${regionColor} text-gray-600 border border-gray-200`
                                    }
                                    ${isLoading && selectedLocation === location.name ? 'opacity-50' : ''}`}
                                  disabled={isLoading}
                                >
                                  {location.name}
                                  {isLoading && selectedLocation === location.name && (
                                    <span className="ml-1 inline-block animate-spin">⌛</span>
                                  )}
                                </button>
                              );
                            }
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleScroll('right')}
                        className={`absolute right-0 z-10 bg-white/80 hover:bg-white hover:text-gray-800 rounded-full w-2 h-2 flex items-center justify-center shadow-sm ${
                          currentPage >=
                          Math.ceil(
                            filteredLocations(countries[0].locations).length / locationsPerPage
                          ) -
                            1
                            ? 'text-gray-300'
                            : 'text-gray-600'
                        }`}
                        disabled={
                          currentPage >=
                          Math.ceil(
                            filteredLocations(countries[0].locations).length / locationsPerPage
                          ) -
                            1
                        }
                      >
                        ›
                      </button>
                    </div>
                  </div>

                  {selectedLocation && (
                    <div className="mt-1 p-2 bg-blue-100/70 rounded-lg">
                      <div className="relative flex gap-1">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="Tìm kiếm visit..."
                            value={serviceSearchTerm}
                            onChange={(e) => {
                              setServiceSearchTerm(e.target.value);
                              setCurrentServicePage(0);
                            }}
                            className="w-full text-[9px] p-1 pr-6 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                          <IoIosSearch className="w-3 h-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2" />
                        </div>
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
                            className={`w-3 h-3 ${
                              isRefreshed ? 'text-green-500' : 'text-gray-500'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="mt-1 space-y-0.5">
                        {selectedLocation &&
                          getPaginatedServices(
                            countries
                              .find((country) =>
                                country.locations.some((loc) => loc.name === selectedLocation)
                              )
                              ?.locations.find((loc) => loc.name === selectedLocation)
                              ?.services.filter((service) => {
                                const matchesSearch = service.name
                                  .toLowerCase()
                                  .includes(serviceSearchTerm.toLowerCase());
                                return matchesSearch;
                              }) || []
                          ).map((service) => (
                            <div
                              key={service.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, service)}
                              onDragEnd={handleDragEnd}
                              className="flex flex-col p-1 rounded cursor-move bg-white/90 hover:bg-gray-50 border border-gray-100 shadow-sm"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <span className="text-[11px]">{service.icon}</span>
                                  <span className="text-[9px] truncate max-w-[120px]">
                                    {service.name}
                                  </span>
                                </div>
                                <span className="text-[9px] text-gray-500">
                                  {formatPrice(service.price)}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>

                      {selectedLocation &&
                        countries
                          .find((country) =>
                            country.locations.some((loc) => loc.name === selectedLocation)
                          )
                          ?.locations.find((loc) => loc.name === selectedLocation)
                          ?.services.filter((service) =>
                            service.name.toLowerCase().includes(serviceSearchTerm.toLowerCase())
                          ).length > servicesPerPage && (
                          <div className="flex justify-center gap-0.5 mt-1">
                            {Array.from(
                              {
                                length: Math.ceil(
                                  (countries
                                    .find((country) =>
                                      country.locations.some((loc) => loc.name === selectedLocation)
                                    )
                                    ?.locations.find((loc) => loc.name === selectedLocation)
                                    ?.services.filter((service) =>
                                      service.name
                                        .toLowerCase()
                                        .includes(serviceSearchTerm.toLowerCase())
                                    ).length || 0) / servicesPerPage
                                ),
                              },
                              (_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentServicePage(index)}
                                  className={`text-[9px] w-4 h-4 flex items-center justify-center rounded 
                                  ${
                                    currentServicePage === index
                                      ? 'bg-blue-100 text-blue-600 font-medium'
                                      : 'text-gray-600 hover:bg-gray-100'
                                  }`}
                                >
                                  {index + 1}
                                </button>
                              )
                            )}
                          </div>
                        )}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        <div>
          <button
            onClick={() => setOpenGuide(!openGuide)}
            className="w-full flex items-center justify-between text-[10px] font-medium p-1 rounded bg-purple-50 text-purple-700 hover:bg-purple-100"
          >
            <span>Hướng dẫn viên</span>
            {openGuide ? (
              <IoIosArrowDown className="h-2.5 w-2.5" />
            ) : (
              <IoIosArrowForward className="h-2.5 w-2.5" />
            )}
          </button>

          {openGuide && (
            <div className="mt-1 space-y-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm HDV..."
                  value={guideSearchTerm}
                  onChange={(e) => setGuideSearchTerm(e.target.value)}
                  className="w-full text-[9px] p-1 pr-6 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <IoIosSearch className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
              </div>

              <div className="flex flex-wrap gap-0.5">
                {guideLanguages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={`text-[9px] px-1 py-0.5 rounded ${
                      selectedLanguage === lang.id
                        ? 'bg-purple-50 text-purple-600 border border-purple-200'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-0.5">
                {guideRegions.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region.id)}
                    className={`text-[9px] px-1 py-0.5 rounded ${
                      selectedRegion === region.id
                        ? 'bg-purple-50 text-purple-600 border border-purple-200'
                        : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {region.label}
                  </button>
                ))}
              </div>

              <div className="space-y-0.5">
                {filterGuides(guides).map((guide) => (
                  <div
                    key={guide.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        'text/plain',
                        JSON.stringify({
                          type: 'guide',
                          data: {
                            id: guide.id,
                            name: guide.name,
                            icon: guide.icon,
                            price: guide.price,
                            languages: guide.languages,
                            region: guide.region,
                            type: 'guide',
                          },
                        })
                      );
                      e.target.classList.add('opacity-50');
                    }}
                    onDragEnd={(e) => {
                      e.target.classList.remove('opacity-50');
                    }}
                    className="flex flex-col p-1 rounded hover:bg-gray-50 cursor-move border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px]">{guide.icon}</span>
                        <span className="text-[9px]">{guide.name}</span>
                      </div>
                      <span className="text-[9px] text-gray-500">{formatPrice(guide.price)}</span>
                    </div>
                    <div className="mt-0.5 space-y-0.5">
                      <span className="text-[8px] text-gray-400 block">
                        Ngôn ngữ:{' '}
                        {guide.languages
                          .map((lang) => guideLanguages.find((l) => l.id === lang)?.label)
                          .join(', ')}
                      </span>
                      <span className="text-[8px] text-gray-400 block">
                        Khu vực: {guideRegions.find((r) => r.id === guide.region)?.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!isOperator && (
          <div>
            <button
              onClick={() => setOpenFood(!openFood)}
              className="w-full flex items-center justify-between text-[10px] font-medium p-1 rounded bg-orange-50 text-orange-700 hover:bg-orange-100"
            >
              <span>Dịch vụ ăn uống</span>
              {openFood ? (
                <IoIosArrowDown className="h-2.5 w-2.5" />
              ) : (
                <IoIosArrowForward className="h-2.5 w-2.5" />
              )}
            </button>

            {openFood && (
              <div className="mt-1 space-y-2">
                {Object.entries(salesFoodServices).map(([mealType, services]) => (
                  <div key={mealType}>
                    <div
                      className={`text-[9px] font-medium px-2 py-1 rounded-sm mb-1 ${mealTypeColors[mealType].header}`}
                    >
                      {getMealTypeName(mealType)}
                    </div>
                    <div className="grid grid-cols-5 gap-0.5">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              'text/plain',
                              JSON.stringify({
                                type: 'service',
                                data: {
                                  ...service,
                                  type: ServiceType.FOOD,
                                },
                              })
                            );
                            e.target.classList.add('opacity-50');
                          }}
                          onDragEnd={(e) => {
                            e.target.classList.remove('opacity-50');
                          }}
                          className={`flex flex-col items-center p-1 rounded cursor-move border ${mealTypeColors[mealType].item}`}
                        >
                          <span className="text-[11px]">{service.icon}</span>
                          <span className="text-[8px] text-center truncate w-full">
                            {service.name.split(' - ')[1]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Thay đổi từ server</h3>

            {mockChanges.added.length > 0 && (
              <div className="mb-2">
                <p className="text-[10px] font-medium text-green-600 mb-1">Thêm mới:</p>
                <ul className="text-[10px] text-gray-600 pl-4 space-y-0.5">
                  {mockChanges.added.map((item, index) => (
                    <li key={index} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {mockChanges.updated.length > 0 && (
              <div className="mb-2">
                <p className="text-[10px] font-medium text-blue-600 mb-1">Cập nhật:</p>
                <ul className="text-[10px] text-gray-600 pl-4 space-y-0.5">
                  {mockChanges.updated.map((item, index) => (
                    <li key={index} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {mockChanges.removed.length > 0 && (
              <div className="mb-2">
                <p className="text-[10px] font-medium text-red-600 mb-1">Đã xóa:</p>
                <ul className="text-[10px] text-gray-600 pl-4 space-y-0.5">
                  {mockChanges.removed.map((item, index) => (
                    <li key={index} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="text-[10px] px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  handleRefreshServices();
                  setShowModal(false);
                }}
                className="text-[10px] px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                Cập nhật ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
