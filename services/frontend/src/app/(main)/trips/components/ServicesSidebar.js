'use client';
import { useState } from 'react';
import { IoIosArrowDown, IoIosArrowForward, IoIosSearch } from 'react-icons/io';

export default function ServicesSidebar() {
  const [openCountry, setOpenCountry] = useState(null);
  const [openGuide, setOpenGuide] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const serviceFilters = [
    { id: 'all', label: 'Tất cả', icon: '🏷️' },
    { id: 'hotel', label: 'Khách sạn', icon: '🏨' },
    { id: 'transport', label: 'Di chuyển', icon: '🚌' },
    { id: 'food', label: 'Ăn uống', icon: '🍽️' },
    { id: 'tour', label: 'Tham quan', icon: '🏛️' },
    { id: 'activity', label: 'Hoạt động', icon: '🎯' },
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
    { id: 'all', label: 'Tất cả' },
    { id: 'en', label: 'Tiếng Anh' },
    { id: 'cn', label: 'Tiếng Trung' },
    { id: 'jp', label: 'Tiếng Nhật' },
    { id: 'kr', label: 'Tiếng Hàn' },
  ];

  const guideRegions = [
    { id: 'all', label: 'Tất cả' },
    { id: 'north', label: 'Miền Bắc' },
    { id: 'central', label: 'Miền Trung' },
    { id: 'south', label: 'Miền Nam' },
  ];

  const guides = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      icon: '👨‍🦱',
      price: '1,500,000đ/ngày',
      languages: ['en', 'cn'],
      region: 'north',
      experience: '5 năm',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      icon: '👩‍🦰',
      price: '1,200,000đ/ngày',
      languages: ['en', 'jp'],
      region: 'central',
      experience: '3 năm',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      icon: '👨‍🦳',
      price: '2,000,000đ/ngày',
      languages: ['en', 'kr'],
      region: 'south',
      experience: '8 năm',
    },
  ];

  const filterGuides = (guides) => {
    return guides.filter((guide) => {
      const matchesSearch = guide.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLanguage =
        selectedLanguage === 'all' || guide.languages.includes(selectedLanguage);
      const matchesRegion = selectedRegion === 'all' || guide.region === selectedRegion;
      return matchesSearch && matchesLanguage && matchesRegion;
    });
  };

  const handleCountryClick = (countryName) => {
    setOpenCountry(openCountry === countryName ? null : countryName);
    setSelectedLocation(null);
    setSearchTerm('');
    setSelectedFilter('all');
  };

  const handleLocationClick = (locationName) => {
    setSelectedLocation(selectedLocation === locationName ? null : locationName);
    setSearchTerm('');
    setSelectedFilter('all');
  };

  const countryColors = {
    'Việt Nam': 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
    Cambodia: 'bg-amber-50 text-amber-700 hover:bg-amber-100',
    Thailand: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
    Laos: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
    Myanmar: 'bg-rose-50 text-rose-700 hover:bg-rose-100',
  };

  return (
    <div className="w-56 bg-white rounded-lg shadow-sm border border-gray-200 p-1 overflow-y-auto max-h-[calc(100vh-120px)]">
      <div className="space-y-1">
        {/* Countries Section */}
        <div className="pb-1 border-b border-gray-200">
          {countries.map((country) => (
            <div key={country.name}>
              {/* Country Level */}
              <button
                onClick={() => handleCountryClick(country.name)}
                className={`w-full flex items-center justify-between text-[10px] font-medium p-1 rounded
                  ${countryColors[country.name] || 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
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

                  {/* Services Section */}
                  {selectedLocation && (
                    <div className="mt-1 space-y-1">
                      {/* Search Bar */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Tìm kiếm dịch vụ..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full text-[9px] p-1 pr-6 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <IoIosSearch className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                      </div>

                      {/* Filter Buttons */}
                      <div className="flex flex-wrap gap-0.5">
                        {serviceFilters.map((filter) => (
                          <button
                            key={filter.id}
                            onClick={() => setSelectedFilter(filter.id)}
                            className={`flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] ${
                              selectedFilter === filter.id
                                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <span className="text-[10px]">{filter.icon}</span>
                            <span>{filter.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Services List */}
                      <div className="space-y-0.5">
                        {country.locations
                          .find((loc) => loc.name === selectedLocation)
                          ?.services.filter((service) => {
                            const matchesSearch =
                              service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              service.supplier.toLowerCase().includes(searchTerm.toLowerCase());
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
                              }}
                              className="flex flex-col p-1 rounded hover:bg-gray-50 cursor-move border border-gray-100"
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                      <span className="text-[8px] text-gray-400 block">
                        Kinh nghiệm: {guide.experience}
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
