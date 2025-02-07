import { pdf } from '@react-pdf/renderer';
import FileSaver from 'file-saver';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { TripPDFDocument } from '../PDFExport';

// Cấu hình brand options với local URLs
const brandOptions = [
  {
    id: 'imagetravel',
    name: 'Image Travel',
    logo: '/images/brand/imagetravel.png',
  },
  {
    id: 'aucoeurvietnam',
    name: 'Au Coeur Vietnam',
    logo: '/images/brand/aucoeurvietnam.png',
  },
  {
    id: 'mekongvillages',
    name: 'Mekong Villages',
    logo: '/images/brand/mekongvillages.png',
  },
];

export default function PublishTab() {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Lấy dữ liệu từ Redux store
  const scheduleData = useSelector((state) => state.dailySchedule || {});

  // Format dữ liệu với useMemo
  const formattedScheduleItems = useMemo(() => {
    if (!scheduleData.scheduleItems) return [];

    return Object.entries(scheduleData.scheduleItems)
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([dayId, dayData]) => ({
        dayId,
        title: dayData.titleOfDay || `Day ${dayData.order}`,
        distance: dayData.distance || 0,
        meals: dayData.meals || {},
        paragraphDay: dayData.paragraphDay || {},
        services: Object.entries(dayData)
          .filter(
            ([key]) => !['order', 'distance', 'titleOfDay', 'meals', 'paragraphDay'].includes(key)
          )
          .flatMap(([time, services]) =>
            Array.isArray(services)
              ? services.map((service) => ({
                  ...service,
                  time,
                }))
              : []
          ),
      }));
  }, [scheduleData.scheduleItems]);

  // Log khi scheduleData thay đổi
  useEffect(() => {
    console.log('Schedule Data from Redux:', scheduleData);
  }, [scheduleData]);

  // Log khi formattedScheduleItems thay đổi
  useEffect(() => {
    console.log('Formatted Schedule Items:', formattedScheduleItems);
  }, [formattedScheduleItems]);

  const handleDownloadPDF = async () => {
    if (!selectedBrand) {
      alert('Please select a brand first');
      return;
    }

    try {
      setIsLoading(true);

      // Nên thêm validation cho formattedScheduleItems
      if (formattedScheduleItems.length === 0) {
        throw new Error('No schedule items to export');
      }

      // Nên thêm error handling cụ thể cho fetch logo
      const response = await fetch(`/api/pdf?path=${encodeURIComponent(selectedBrand.logo)}`);
      if (!response.ok) {
        throw new Error('Failed to load brand logo');
      }
      const data = await response.json();

      const brandWithBase64Logo = {
        ...selectedBrand,
        logo: data.data,
      };

      // Generate PDF using react-pdf
      const blob = await pdf(
        <TripPDFDocument brand={brandWithBase64Logo} scheduleItems={formattedScheduleItems} />
      ).toBlob();

      // Download using FileSaver
      const fileName = `trip-${selectedBrand.id}-${Date.now()}.pdf`;
      FileSaver.saveAs(blob, fileName);
      console.log('PDF generated successfully:', fileName);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Export Format</h3>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedFormat('pdf')}
            className={`p-4 border rounded-lg flex-1 ${
              selectedFormat === 'pdf' ? 'border-primary bg-primary/5' : ''
            }`}
          >
            PDF Format
          </button>
          <button
            onClick={() => setSelectedFormat('doc')}
            className={`p-4 border rounded-lg flex-1 ${
              selectedFormat === 'doc' ? 'border-primary bg-primary/5' : ''
            }`}
          >
            DOC Format
          </button>
        </div>
      </div>

      {selectedFormat === 'pdf' && (
        <>
          <div>
            <h3 className="font-semibold mb-3">Brand Options</h3>
            <div className="grid grid-cols-3 gap-4">
              {brandOptions.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand)}
                  className={`p-4 border rounded-lg flex flex-col items-center ${
                    selectedBrand?.id === brand.id ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="relative h-20 w-full mb-2">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                      priority
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <span className="text-sm font-medium">{brand.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={!selectedBrand || isLoading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </>
      )}

      <div>
        <h3 className="font-semibold mb-3">Web Publishing</h3>
        <div className="p-4 border rounded-lg">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            Publish to website
          </label>
        </div>
      </div>
    </div>
  );
}
