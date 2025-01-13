'use client';
import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowForward, IoIosSearch } from 'react-icons/io';

export default function ServicesSidebar() {
  const [openCountry, setOpenCountry] = useState(null);
  const [openGuide, setOpenGuide] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [guideSearchTerm, setGuideSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const serviceFilters = [
    {
      id: 'hotel',
      label: 'Hotels',
      bgColor: 'bg-emerald-50 text-emerald-700',
      activeColor: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      inactiveColor: 'bg-emerald-50/40 text-emerald-700/60',
      hoverColor: 'hover:bg-emerald-100/50',
    },
    {
      id: 'food',
      label: 'Foods',
      bgColor: 'bg-amber-50 text-amber-700',
      activeColor: 'bg-amber-100 text-amber-700 border-amber-300',
      inactiveColor: 'bg-amber-50/40 text-amber-700/60',
      hoverColor: 'hover:bg-amber-100/50',
    },
    {
      id: 'tour',
      label: 'Tours',
      bgColor: 'bg-blue-50 text-blue-700',
      activeColor: 'bg-blue-100 text-blue-700 border-blue-300',
      inactiveColor: 'bg-blue-50/40 text-blue-700/60',
      hoverColor: 'hover:bg-blue-100/50',
    },
    {
      id: 'activity',
      label: 'Activities',
      bgColor: 'bg-purple-50 text-purple-700',
      activeColor: 'bg-purple-100 text-purple-700 border-purple-300',
      inactiveColor: 'bg-purple-50/40 text-purple-700/60',
      hoverColor: 'hover:bg-purple-100/50',
    },
  ];

  const countries = [
    {
      name: 'Việt Nam',
      locations: [
        {
          name: 'Hà Nội',
          services: [
            {
              id: 1,
              name: 'Khách sạn Metropole 5*',
              icon: '🏨',
              price: '5,000,000đ',
              supplier: 'Sofitel Legend Metropole',
              type: 'hotel',
            },
            {
              id: 2,
              name: 'Xe 16 chỗ đời mới',
              icon: '🚐',
              price: '2,000,000đ',
              supplier: 'Công ty Vận tải ABC',
              type: 'transport',
            },
            {
              id: 3,
              name: 'Set ăn Phở Thìn',
              icon: '🍜',
              price: '150,000đ',
              supplier: 'Phở Thìn Bắc Giang',
              type: 'food',
            },
            {
              id: 4,
              name: 'Tour Văn Miếu - Hoàng Thành',
              icon: '🏛️',
              price: '500,000đ',
              supplier: 'VietGuide Tours',
              type: 'tour',
            },
          ],
        },
        {
          name: 'Hạ Long',
          services: [
            {
              id: 5,
              name: 'Du thuyền Paradise 5*',
              icon: '🚢',
              price: '4,500,000đ',
              supplier: 'Paradise Cruises',
              type: 'activity',
            },
            {
              id: 6,
              name: 'Vinpearl Resort & Spa',
              icon: '🏨',
              price: '3,200,000đ',
              supplier: 'Vinpearl',
              type: 'hotel',
            },
            {
              id: 7,
              name: 'Set hải sản cao cấp',
              icon: '🦐',
              price: '1,500,000đ',
              supplier: 'Nhà hàng Hải Sản Hạ Long',
              type: 'food',
            },
          ],
        },
        {
          name: 'Sapa',
          services: [
            {
              id: 8,
              name: 'Hotel de la Coupole',
              icon: '🏨',
              price: '2,800,000đ',
              supplier: 'MGallery',
              type: 'hotel',
            },
            {
              id: 9,
              name: 'Trek Fansipan',
              icon: '🏔️',
              price: '800,000đ',
              supplier: 'Sapa Adventures',
              type: 'activity',
            },
            {
              id: 10,
              name: 'Xe Limousine Hà Nội - Sapa',
              icon: '🚐',
              price: '350,000đ',
              supplier: 'Sapa Express',
              type: 'transport',
            },
          ],
        },
        {
          name: 'Đà Nẵng',
          services: [
            {
              id: 11,
              name: 'InterContinental Resort',
              icon: '🏨',
              price: '4,200,000đ',
              supplier: 'IHG Hotels',
              type: 'hotel',
            },
            {
              id: 12,
              name: 'Tour Bà Nà Hills',
              icon: '🎡',
              price: '1,250,000đ',
              supplier: 'Sun World',
              type: 'tour',
            },
            {
              id: 13,
              name: 'Lẩu cá đuối',
              icon: '🍲',
              price: '450,000đ',
              supplier: 'Nhà hàng Mỹ Hạnh',
              type: 'food',
            },
          ],
        },
        {
          name: 'Hội An',
          services: [
            {
              id: 14,
              name: 'Four Seasons Resort',
              icon: '🏨',
              price: '5,500,000đ',
              supplier: 'Four Seasons',
              type: 'hotel',
            },
            {
              id: 15,
              name: 'Tour phố cổ đêm',
              icon: '🏮',
              price: '300,000đ',
              supplier: 'Hoi An Express',
              type: 'tour',
            },
            {
              id: 16,
              name: 'Cooking Class',
              icon: '👨‍🍳',
              price: '800,000đ',
              supplier: 'Red Bridge Cooking School',
              type: 'activity',
            },
          ],
        },
      ],
    },
    {
      name: 'Cambodia',
      locations: [
        {
          name: 'Siem Reap',
          services: [
            {
              id: 17,
              name: 'Raffles Grand Hotel',
              icon: '🏨',
              price: '$250',
              supplier: 'Raffles Hotels',
              type: 'hotel',
            },
            {
              id: 18,
              name: 'Tour Angkor Wat',
              icon: '🏛️',
              price: '$100',
              supplier: 'Angkor Guide',
              type: 'tour',
            },
            {
              id: 19,
              name: 'Khmer Cooking Class',
              icon: '👨‍🍳',
              price: '$45',
              supplier: 'Khmer Kitchen',
              type: 'activity',
            },
          ],
        },
        {
          name: 'Phnom Penh',
          services: [
            {
              id: 20,
              name: 'Rosewood Hotel',
              icon: '🏨',
              price: '$200',
              supplier: 'Rosewood Hotels',
              type: 'hotel',
            },
            {
              id: 21,
              name: 'City Tour',
              icon: '🚌',
              price: '$40',
              supplier: 'PP Tours',
              type: 'tour',
            },
            {
              id: 22,
              name: 'Royal Palace Visit',
              icon: '👑',
              price: '$30',
              supplier: 'Heritage Tours',
              type: 'activity',
            },
          ],
        },
      ],
    },
  ];

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

  const handleLocationClick = (locationName) => {
    setSelectedLocation(selectedLocation === locationName ? null : locationName);
    setServiceSearchTerm('');
    setGuideSearchTerm('');
    setSelectedFilter('all');
  };

  const countryColors = {
    'Việt Nam': 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    Cambodia: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
    Thailand: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    Laos: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    Myanmar: 'bg-rose-100 text-rose-700 hover:bg-rose-200',
  };

  const serviceTypeColors = {
    hotel: 'bg-emerald-50/90 hover:bg-emerald-100/90',
    food: 'bg-amber-50/90 hover:bg-amber-100/90',
    tour: 'bg-blue-50/90 hover:bg-blue-100/90',
    activity: 'bg-purple-50/90 hover:bg-purple-100/90',
  };

  return (
    <div className="w-56 bg-white rounded-lg shadow-sm border border-gray-200 p-1 overflow-y-auto max-h-[calc(100vh-120px)]">
      <div className="space-y-2">
        {/* Countries Section */}
        <div className="pb-2 border-b-2 border-gray-300">
          {countries.map((country, index) => (
            <div key={country.name} className={index > 0 ? 'mt-1' : ''}>
              {/* Country Level */}
              <button
                onClick={() => handleCountryClick(country.name)}
                className={`w-full flex items-center justify-between text-[10px] font-medium p-1 rounded
                  ${countryColors[country.name] || 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                <span>{country.name}</span>
                {openCountry === country.name ? (
                  <IoIosArrowDown className="h-2.5 w-2.5" />
                ) : (
                  <IoIosArrowForward className="h-2.5 w-2.5" />
                )}
              </button>

              {/* Locations Grid */}
              {openCountry === country.name && (
                <div className="mt-1">
                  <div className="grid grid-cols-3 gap-0.5">
                    {country.locations.map((location) => (
                      <button
                        key={location.name}
                        onClick={() => handleLocationClick(location.name)}
                        className={`text-[9px] p-0.5 rounded transition-colors
                          ${
                            selectedLocation === location.name
                              ? `${countryColors[country.name].replace('50', '100')} border-${countryColors[country.name].split('-')[1]}-200`
                              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                          }`}
                      >
                        {location.name}
                      </button>
                    ))}
                  </div>

                  {/* Services Section - Only show when location is selected */}
                  {selectedLocation && (
                    <div className="mt-1 p-2 bg-blue-100/70 rounded-lg">
                      {/* Search Input */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Tìm kiếm dịch vụ..."
                          value={serviceSearchTerm}
                          onChange={(e) => setServiceSearchTerm(e.target.value)}
                          className="w-full text-[9px] p-1 pr-6 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                        />
                        <IoIosSearch className="w-3 h-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2" />
                      </div>

                      {/* Filter Buttons */}
                      <div className="grid grid-cols-4 gap-0.5 mt-1">
                        {serviceFilters.map((filter) => (
                          <button
                            key={filter.id}
                            onClick={() => setSelectedFilter(filter.id)}
                            className={`px-1 py-0.5 rounded text-[9px] border ${
                              selectedFilter === filter.id
                                ? filter.activeColor
                                : selectedFilter === 'all'
                                  ? `${filter.bgColor} border-gray-200 ${filter.hoverColor}`
                                  : `${filter.inactiveColor} border-gray-200 ${filter.hoverColor}`
                            }`}
                          >
                            {filter.label}
                          </button>
                        ))}
                      </div>

                      {/* Services List */}
                      <div className="mt-1 space-y-0.5">
                        {selectedLocation &&
                          countries
                            .find((country) =>
                              country.locations.some((loc) => loc.name === selectedLocation)
                            )
                            ?.locations.find((loc) => loc.name === selectedLocation)
                            ?.services.filter((service) => {
                              const matchesSearch =
                                service.name
                                  .toLowerCase()
                                  .includes(serviceSearchTerm.toLowerCase()) ||
                                service.supplier
                                  .toLowerCase()
                                  .includes(serviceSearchTerm.toLowerCase());
                              const matchesFilter =
                                selectedFilter === 'all' || service.type === selectedFilter;
                              return matchesSearch && matchesFilter;
                            })
                            .map((service) => (
                              <div
                                key={service.id}
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('text/plain', JSON.stringify(service));
                                  e.target.classList.add('opacity-50');
                                }}
                                onDragEnd={(e) => {
                                  e.target.classList.remove('opacity-50');
                                }}
                                className="flex flex-col p-1 rounded cursor-move bg-white/90 hover:bg-gray-50 border border-gray-100 shadow-sm"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[11px]">{service.icon}</span>
                                    <span className="text-[9px]">{service.name}</span>
                                  </div>
                                  <span className="text-[9px] text-gray-500">{service.price}</span>
                                </div>
                                <span className="text-[8px] text-gray-400 mt-0.5 italic">
                                  {service.supplier}
                                </span>
                              </div>
                            ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tour Guides Section */}
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
              {/* Search Bar for Guides */}
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

              {/* Language Filter */}
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

              {/* Region Filter */}
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

              {/* Guides List */}
              <div className="space-y-0.5">
                {filterGuides(guides).map((guide) => (
                  <div
                    key={guide.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', JSON.stringify(guide));
                    }}
                    className="flex flex-col p-1 rounded hover:bg-gray-50 cursor-move border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px]">{guide.icon}</span>
                        <span className="text-[9px]">{guide.name}</span>
                      </div>
                      <span className="text-[9px] text-gray-500">{guide.price}</span>
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
      </div>
    </div>
  );
}
