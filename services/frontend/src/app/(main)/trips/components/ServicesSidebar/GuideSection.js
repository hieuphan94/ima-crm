import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import SearchInput from './components/SearchInput';

export default function GuideSection({
  openGuide,
  setOpenGuide,
  guideSearchTerm,
  setGuideSearchTerm,
  selectedLanguage,
  setSelectedLanguage,
  selectedRegion,
  setSelectedRegion,
}) {
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
      price: '1500000',
      languages: ['en', 'cn'],
      region: 'north',
    },
    {
      id: 2,
      name: 'Trần Thị B',
      icon: '👩‍🦰',
      price: '1200000',
      languages: ['en', 'jp'],
      region: 'central',
    },
    {
      id: 3,
      name: 'Lê Văn C',
      icon: '👨‍🦳',
      price: '2000000',
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

  const formatPrice = (price) => {
    if (!price) return '0';

    const formattedPrice = price.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });

    return formattedPrice + 'đ/ngày';
  };

  return (
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
          <SearchInput
            value={guideSearchTerm}
            onChange={(e) => setGuideSearchTerm(e.target.value)}
            placeholder="Tìm kiếm HDV..."
            className="bg-white"
          />

          <div className="flex gap-0.5">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="flex-1 text-[9px] p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tất cả ngôn ngữ</option>
              {guideLanguages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.label}
                </option>
              ))}
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="flex-1 text-[9px] p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tất cả khu vực</option>
              {guideRegions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.label}
                </option>
              ))}
            </select>
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
                      data: guide,
                    })
                  );
                  e.target.classList.add('opacity-50');
                }}
                onDragEnd={(e) => {
                  e.target.classList.remove('opacity-50');
                }}
                className="flex items-center justify-between p-1 rounded hover:bg-gray-50 cursor-move border border-gray-100"
              >
                <div className="flex items-center gap-1">
                  <span className="text-[11px]">{guide.icon}</span>
                  <span className="text-[9px]">{guide.name}</span>
                </div>
                <span className="text-[9px] text-gray-500">{formatPrice(guide.price)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
