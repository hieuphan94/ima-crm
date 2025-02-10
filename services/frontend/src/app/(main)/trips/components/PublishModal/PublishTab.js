import { pdf } from '@react-pdf/renderer';
import FileSaver from 'file-saver';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { TripPDFDocument } from '../PDFExport';
import { isScheduleValid } from './PreviewTab';

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

const ColorPicker = ({ label, textColor, bgColor, onChangeText, onChangeBg }) => {
  return (
    <div className="p-3 border rounded-lg">
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-xs w-20">Text Color:</span>
          <input
            type="color"
            value={textColor}
            onChange={(e) => onChangeText(e.target.value)}
            className="w-6 h-6 rounded cursor-pointer"
            title="Text Color"
          />
          <input
            type="text"
            value={textColor}
            onChange={(e) => onChangeText(e.target.value)}
            className="w-20 px-2 py-1 border rounded text-xs"
            placeholder="Text"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs w-20">Background:</span>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => onChangeBg(e.target.value)}
            className="w-6 h-6 rounded cursor-pointer"
            title="Background Color"
          />
          <input
            type="text"
            value={bgColor}
            onChange={(e) => onChangeBg(e.target.value)}
            className="w-20 px-2 py-1 border rounded text-xs"
            placeholder="Background"
          />
        </div>
      </div>
    </div>
  );
};

export default function PublishTab() {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [tripTitleColors, setTripTitleColors] = useState({
    text: '#000000',
    background: '#FFFFFF',
  });
  const [dayTitleColors, setDayTitleColors] = useState({
    text: '#000000',
    background: '#FFFFFF',
  });
  const [headerImage, setHeaderImage] = useState(null);
  const [headerImagePreview, setHeaderImagePreview] = useState(null);
  const [validationError, setValidationError] = useState(null);

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

  const handleHeaderImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB');
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      setHeaderImage(file);
      setHeaderImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreatePDF = async () => {
    // Reset validation error
    setValidationError(null);

    if (!selectedBrand) {
      setValidationError('Please select a brand first');
      return;
    }

    // Add validation check
    if (!isScheduleValid(scheduleData.scheduleItems)) {
      setValidationError(
        'Please complete all required information for each day (including activities, title, distance, and meals) before creating PDF'
      );
      return;
    }

    try {
      setIsLoading(true);
      setPdfBlob(null);
      setPdfUrl(null);

      if (formattedScheduleItems.length === 0) {
        throw new Error('No schedule items to export');
      }

      // Lấy brand logo và convert sang base64
      const logoResponse = await fetch(selectedBrand.logo);
      const logoBlob = await logoResponse.blob();
      const base64Logo = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(logoBlob);
      });

      const brandWithBase64Logo = {
        ...selectedBrand,
        logo: base64Logo,
      };

      // Xử lý header image nếu có
      let headerImageBase64 = null;
      if (headerImage) {
        const reader = new FileReader();
        headerImageBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(headerImage);
        });
      }

      // Tạo PDF với base64 images
      const blob = await pdf(
        <TripPDFDocument
          brand={brandWithBase64Logo}
          scheduleItems={formattedScheduleItems}
          tripTitleColors={tripTitleColors}
          dayTitleColors={dayTitleColors}
          headerImage={headerImageBase64}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      setPdfBlob(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('PDF generation error:', error);
      setValidationError(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfBlob) return;
    const fileName = `trip-${selectedBrand.id}-${Date.now()}.pdf`;
    FileSaver.saveAs(pdfBlob, fileName);
    console.log('PDF downloaded successfully:', fileName);
  };

  // Cleanup URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      if (headerImagePreview) {
        URL.revokeObjectURL(headerImagePreview);
      }
    };
  }, [pdfUrl, headerImagePreview]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-3">Export Format</h3>
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedFormat('pdf')}
            className={`p-2 border rounded-lg flex-1 ${
              selectedFormat === 'pdf' ? 'border-primary bg-primary/5' : ''
            }`}
          >
            PDF Format
          </button>
          <button
            onClick={() => setSelectedFormat('doc')}
            className={`p-2 border rounded-lg flex-1 ${
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
                  className={`p-2 border rounded-lg flex flex-col items-center ${
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

          <div className="space-y-3">
            <h3 className="font-semibold">Design Options</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 flex flex-row gap-2">
                <ColorPicker
                  label="Trip Title Colors"
                  textColor={tripTitleColors.text}
                  bgColor={tripTitleColors.background}
                  onChangeText={(color) => setTripTitleColors((prev) => ({ ...prev, text: color }))}
                  onChangeBg={(color) =>
                    setTripTitleColors((prev) => ({ ...prev, background: color }))
                  }
                />
                <ColorPicker
                  label="Day Title Colors"
                  textColor={dayTitleColors.text}
                  bgColor={dayTitleColors.background}
                  onChangeText={(color) => setDayTitleColors((prev) => ({ ...prev, text: color }))}
                  onChangeBg={(color) =>
                    setDayTitleColors((prev) => ({ ...prev, background: color }))
                  }
                />
              </div>

              <div className="border rounded-lg p-3">
                <label className="block text-sm font-medium mb-2">Header Image</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeaderImageChange}
                    className="hidden"
                    id="header-image-input"
                  />
                  <label
                    htmlFor="header-image-input"
                    className="block w-full p-2 text-center border-2 border-dashed rounded-lg cursor-pointer hover:border-primary text-sm"
                  >
                    {headerImage ? 'Change Image' : 'Upload Image'}
                  </label>

                  {headerImagePreview && (
                    <div className="relative w-full h-24">
                      <Image
                        src={headerImagePreview}
                        alt="Header preview"
                        fill
                        className="object-contain rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setHeaderImage(null);
                          setHeaderImagePreview(null);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        title="Remove image"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <button
              onClick={handleCreatePDF}
              disabled={!selectedBrand || isLoading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? 'Generating...' : 'Create PDF'}
            </button>

            {validationError && (
              <div className="flex-1 p-2 border border-red-200 bg-red-50 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-red-700 text-sm">{validationError}</div>
              </div>
            )}

            {pdfBlob && (
              <>
                <button
                  onClick={() => window.open(pdfUrl, '_blank')}
                  className="px-2 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90"
                >
                  View PDF
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-2 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Download PDF
                </button>
              </>
            )}
          </div>

          {pdfUrl && (
            <div className="border rounded-lg p-2">
              <h3 className="font-semibold mb-3">PDF Preview</h3>
              <iframe
                src={pdfUrl}
                className="w-full h-[600px] border rounded"
                title="PDF Preview"
              />
            </div>
          )}
        </>
      )}

      <div>
        <h3 className="font-semibold mb-3">Web Publishing</h3>
        <div className="p-2 border rounded-lg">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            Publish to website
          </label>
        </div>
      </div>
    </div>
  );
}
