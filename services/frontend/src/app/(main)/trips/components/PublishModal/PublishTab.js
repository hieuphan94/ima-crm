import { pdf } from '@react-pdf/renderer';
import FileSaver from 'file-saver';
import { AlertCircle, CheckCircle, Download, FileSpreadsheet, FileText, Globe } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { generateAndDownloadDOCX } from '../DOCExport';
import { generateAndDownloadExcel } from '../ExcelExport';
import { TripPDFDocument } from '../PDFExport';
import { isScheduleValid } from './PreviewTab';

// First, add the brand colors configuration at the top
const BRAND_COLORS = {
  aucoeurvietnam: {
    tripTitleColors: {
      text: '#FFFFFF',
      background: '#A08F3C',
    },
    dayTitleColors: {
      text: '#000000',
      background: '#ffc31f',
    },
  },
  mekongvillages: {
    tripTitleColors: {
      text: '#FFFFFF',
      background: '#ed7600',
    },
    dayTitleColors: {
      text: '#000000',
      background: '#8bbf9f',
    },
  },
  imagetravel: {
    tripTitleColors: {
      text: '#FFFFFF',
      background: '#ed7600',
    },
    dayTitleColors: {
      text: '#000000',
      background: '#f7be85',
    },
  },
};

// Cấu hình brand options với local URLs
const brandOptions = [
  {
    id: 'imagetravel',
    name: 'Image Travel',
    logo: '/images/brand/imagetravel.png',
    footerImage: '/images/brand/imagetravel-footer.jpg',
  },
  {
    id: 'aucoeurvietnam',
    name: 'Au Coeur Vietnam',
    logo: '/images/brand/aucoeurvietnam.png',
    footerImage: '/images/brand/aucoeurvietnam-footer.jpg',
  },
  {
    id: 'mekongvillages',
    name: 'Mekong Villages',
    logo: '/images/brand/mekongvillages.png',
    footerImage: '/images/brand/mekongvillages-footer.jpg',
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
  const [footerImage, setFooterImage] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [docExportType, setDocExportType] = useState('local');
  const [excelExportType, setExcelExportType] = useState('local');
  const [enableWebPublish, setEnableWebPublish] = useState(false);
  const [publishedTripId, setPublishedTripId] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [bypassValidation, setBypassValidation] = useState(false);

  // Lấy dữ liệu từ Redux store
  const scheduleData = useSelector((state) => state.dailySchedule || {});
  const scheduleInfo = useSelector((state) => state.dailySchedule.scheduleInfo);
  const settings = useSelector((state) => state.dailySchedule.settings);
  // Format dữ liệu với useMemo
  const formattedScheduleItems = useMemo(() => {
    if (!scheduleData.scheduleItems) return [];

    return Object.entries(scheduleData.scheduleItems)
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([dayId, dayData]) => ({
        dayId,
        titleOfDay: dayData.titleOfDay || `Day ${dayData.order}`,
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
  useEffect(() => {}, [scheduleData]);

  // Log khi formattedScheduleItems thay đổi
  useEffect(() => {}, [formattedScheduleItems]);

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

  const handleBrandSelection = (brand) => {
    console.log('Brand selected:', brand);
    setSelectedBrand(brand);

    // Set default colors based on brand
    const brandColors = BRAND_COLORS[brand.id];
    if (brandColors) {
      setTripTitleColors(brandColors.tripTitleColors);
      setDayTitleColors(brandColors.dayTitleColors);
    }

    // Set footer image from brand options
    console.log('Setting footer image:', brand.footerImage);
    setFooterImage(brand.footerImage);
  };

  const handleCreatePDF = async () => {
    setValidationError(null);

    if (!selectedBrand) {
      setValidationError('Please select a brand first');
      return;
    }

    // Check validation only if not bypassed
    if (!bypassValidation) {
      const validation = isScheduleValid(scheduleData);
      if (!validation.isValid) {
        setValidationError(validation.error + "\n\nClick 'Create PDF' again to generate anyway.");
        setBypassValidation(true);
        return;
      }
    }

    try {
      setIsLoading(true);
      setPdfBlob(null);
      setPdfUrl(null);

      // Reset bypass flag
      setBypassValidation(false);

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
      let footerImageBase64 = null;

      if (headerImage) {
        const reader = new FileReader();
        headerImageBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(headerImage);
        });
      }

      // Handle footer image from brand
      if (footerImage) {
        console.log('Fetching footer image from:', footerImage);
        const footerResponse = await fetch(footerImage);
        console.log('Footer image response:', footerResponse);

        if (!footerResponse.ok) {
          throw new Error(`Failed to fetch footer image: ${footerResponse.status}`);
        }

        const footerBlob = await footerResponse.blob();
        console.log('Footer image blob:', footerBlob);

        footerImageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            console.log('Footer image converted to base64');
            resolve(reader.result);
          };
          reader.readAsDataURL(footerBlob);
        });
      }

      console.log('Final footerImageBase64:', footerImageBase64 ? 'exists' : 'null');

      // Tạo PDF với base64 images
      const blob = await pdf(
        <TripPDFDocument
          brand={brandWithBase64Logo}
          scheduleItems={formattedScheduleItems}
          scheduleInfo={scheduleInfo}
          settings={settings}
          tripTitleColors={tripTitleColors}
          dayTitleColors={dayTitleColors}
          headerImage={headerImageBase64}
          footerImage={footerImageBase64}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      setPdfBlob(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('PDF generation error:', error);
      console.error('Error details:', {
        footerImage,
        selectedBrand: selectedBrand?.id,
        errorMessage: error.message,
      });
      setValidationError(`Failed to generate PDF: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfBlob) return;
    const fileName = `trip-${selectedBrand.id}-${Date.now()}.pdf`;
    FileSaver.saveAs(pdfBlob, fileName);
  };

  const handleCreateDOCX = async () => {
    try {
      setIsLoading(true);
      setValidationError(null);

      // Validate required data
      if (!formattedScheduleItems.length) {
        setValidationError('Không có dữ liệu lịch trình để xuất');
        return;
      }

      // Generate and download DOCX with minimal required data
      await generateAndDownloadDOCX({
        scheduleItems: formattedScheduleItems,
        scheduleInfo: scheduleInfo,
        settings: settings,
      });

      setSuccessMessage('File DOCX đã được tạo thành công');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('DOCX generation error:', error);
      setValidationError(`Lỗi khi tạo file DOCX: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateExcel = async () => {
    try {
      setIsLoading(true);
      setValidationError(null);

      // Validate required data
      if (!formattedScheduleItems.length) {
        setValidationError('Không có dữ liệu lịch trình để xuất');
        return;
      }

      // Generate and download Excel
      await generateAndDownloadExcel({
        scheduleItems: formattedScheduleItems,
        scheduleInfo: scheduleInfo,
        settings: settings,
      });

      setSuccessMessage('File Excel đã được tạo thành công');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Excel generation error:', error);
      setValidationError(`Lỗi khi tạo file Excel: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Thêm hàm validateVersion từ DraftTab
  const validateVersion = (version) => {
    if (!version) {
      return false;
    }

    // Kiểm tra scheduleData không rỗng
    if (!version.scheduleData || Object.keys(version.scheduleData).length === 0) {
      return false;
    }

    // Kiểm tra các trường bắt buộc
    const requiredFields = [
      'scheduleData',
      'tripInfo',
      'tripInfo.pax',
      'tripInfo.numberOfDays',
      'tripInfo.title',
      'tripInfo.starRating',
    ];

    const validationResults = requiredFields.map((field) => {
      const fields = field.split('.');
      let value = version;
      for (const f of fields) {
        value = value?.[f];
      }
      const isValid = value !== undefined && value !== null;
      return isValid;
    });

    return validationResults.every((result) => result === true);
  };

  const handlePublishToWeb = () => {
    try {
      // Generate unique trip ID
      const tripId = `trip-${Math.random().toString(36).substr(2, 9)}`;

      // Tạo version mới với cấu trúc giống DraftTab
      const newVersion = {
        id: tripId,
        date: new Date().toISOString().replace('T', ' ').substr(0, 19),
        type: 'publish',
        changes: 'Published to web',
        scheduleData: scheduleData.scheduleItems, // Lấy trực tiếp scheduleItems
        tripInfo: {
          pax: settings?.globalPax,
          numberOfDays: settings?.numberOfDays,
          title: scheduleInfo?.title,
          starRating: settings?.starRating || 4,
        },
      };

      // Validate version trước khi lưu
      if (!validateVersion(newVersion)) {
        throw new Error('Invalid version data structure');
      }

      // Save to localStorage
      localStorage.setItem(tripId, JSON.stringify(newVersion));

      // Update state
      setPublishedTripId(tripId);
      setPublishSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => setPublishSuccess(false), 3000);
    } catch (error) {
      console.error('Publish error:', {
        message: error.message,
        currentState: {
          hasSchedule: !!scheduleData,
          scheduleKeys: Object.keys(scheduleData?.scheduleItems || {}),
          settings,
          scheduleInfo,
        },
      });
      setValidationError(`Failed to publish: ${error.message}`);
    }
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
          <button
            onClick={() => setSelectedFormat('excel')}
            className={`p-2 border rounded-lg flex-1 ${
              selectedFormat === 'excel' ? 'border-primary bg-primary/5' : ''
            }`}
          >
            Excel Format
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
                  onClick={() => handleBrandSelection(brand)}
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

      {selectedFormat === 'doc' && (
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Document Export Options</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDocExportType('local')}
                className={`p-3 border rounded-lg flex items-center justify-center gap-2 ${
                  docExportType === 'local' ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Local DOCX</span>
              </button>
              <button
                onClick={() => setDocExportType('google')}
                className={`p-3 border rounded-lg flex items-center justify-center gap-2 ${
                  docExportType === 'google' ? 'border-primary bg-primary/5' : ''
                } opacity-50 cursor-not-allowed`}
                disabled
                title="Coming soon"
              >
                <FileText className="w-5 h-5" />
                <span>Google Doc</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleCreateDOCX}
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isLoading ? 'Generating...' : 'Generate Document'}
          </button>
        </div>
      )}

      {selectedFormat === 'excel' && (
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-3">Excel Export Options</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setExcelExportType('local')}
                className={`p-3 border rounded-lg flex items-center justify-center gap-2 ${
                  excelExportType === 'local' ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span>Local Excel</span>
              </button>
              <button
                onClick={() => setExcelExportType('google')}
                className={`p-3 border rounded-lg flex items-center justify-center gap-2 ${
                  excelExportType === 'google' ? 'border-primary bg-primary/5' : ''
                } opacity-50 cursor-not-allowed`}
                disabled
                title="Coming soon"
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span>Google Sheet</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleCreateExcel}
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isLoading ? 'Generating...' : 'Generate Excel'}
          </button>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-3">Web Publishing</h3>
        <div className="p-2 border rounded-lg space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="rounded"
              checked={enableWebPublish}
              onChange={(e) => setEnableWebPublish(e.target.checked)}
            />
            Publish to website
          </label>

          {enableWebPublish && (
            <div className="space-y-4">
              <button
                onClick={handlePublishToWeb}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                Publish Trip
              </button>

              {publishedTripId && (
                <div className="p-3 bg-gray-50 border rounded-lg space-y-2">
                  <div className="text-sm font-medium">Preview Link:</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/preview/${publishedTripId}`}
                      readOnly
                      className="flex-1 px-3 py-1 bg-white border rounded text-sm"
                    />
                    <button
                      onClick={() => window.open(`/preview/${publishedTripId}`, '_blank')}
                      className="px-3 py-1 bg-secondary text-white rounded hover:bg-secondary/90 text-sm"
                    >
                      Open
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {publishSuccess && (
        <div className="p-2 border border-green-200 bg-green-50 rounded-lg flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <div className="text-green-700 text-sm">Trip published successfully!</div>
        </div>
      )}
    </div>
  );
}
