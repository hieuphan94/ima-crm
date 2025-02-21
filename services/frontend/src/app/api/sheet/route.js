import { GoogleSheetService } from '@/api/credentials/googleSheet';
import { ServiceLevel, ServiceStatus, ServiceType } from '@/data/models/enums';
import { VisitService } from '@/data/models/Service';

// Thay thế hàm normalizeText cũ bằng hàm mới
const normalizeLocationName = (name) => {
  return (name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove vietnamese tones
    .toLowerCase()
    .replace(/\s+/g, '') // remove spaces
    .replace(/[^a-z0-9]/g, ''); // remove special characters
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');

    // Validate location parameter
    if (!location?.trim()) {
      return Response.json(
        {
          success: false,
          status: 400,
          message: 'Location parameter is required',
          data: null,
        },
        { status: 400 }
      );
    }

    const normalizedLocation = normalizeLocationName(location);
    const sheetService = new GoogleSheetService(process.env.GOOGLE_SHEETS_ID);

    // Validate Google Sheet ID
    if (!process.env.GOOGLE_SHEETS_ID) {
      return Response.json(
        {
          success: false,
          status: 500,
          message: 'Google Sheet ID is not configured',
          data: null,
        },
        { status: 500 }
      );
    }

    // Cập nhật range để phù hợp với sheet mới
    const data = await sheetService.getSheetData('TÁCH ĐỊA ĐIỂM!A1:F254');

    // Validate sheet data
    if (!Array.isArray(data) || data.length < 2) {
      return Response.json(
        {
          success: false,
          status: 500,
          message: 'Invalid sheet data structure',
          data: null,
        },
        { status: 500 }
      );
    }

    // Định nghĩa các cột theo sheet mới
    const columnIndexes = {
      LOCATION: 0, // Cột A
      NAME: 1, // Cột B
      PARAGRAPH: 2, // Cột C
      MEAL: 3, // Cột D
      PRICE: 4, // Cột E
      GROUP: 5, // Cột F
    };

    // Lọc services theo location
    const filteredServices = data.slice(1).filter((row) => {
      const rowLocation = normalizeLocationName(row[columnIndexes.LOCATION]);
      return rowLocation && rowLocation === normalizedLocation;
    });

    // Check if any services were found
    if (filteredServices.length === 0) {
      return Response.json(
        {
          success: false,
          status: 404,
          message: `No services found for location: ${location}`,
          data: [],
        },
        { status: 404 }
      );
    }

    // Chuyển đổi dữ liệu theo cấu trúc mới
    const services = filteredServices
      .map((row) => {
        return new VisitService({
          id: `service-${Math.random().toString(36).substr(2, 9)}`,
          name: row[columnIndexes.NAME] || '',
          type: ServiceType.VISIT,
          serviceLevel: ServiceLevel.TEMPLATE,
          location: row[columnIndexes.LOCATION] || '',
          sentence: row[columnIndexes.PARAGRAPH] || '',
          serviceStatus: ServiceStatus.ACTIVE,
          mealOption: row[columnIndexes.MEAL] || '',
          price: parseFloat(row[columnIndexes.PRICE]) || 0,
          priceGroup: {
            priceDefault2to3Pax: parseFloat(row[columnIndexes.GROUP]) || 0,
          },
          ticketInfo: {},
          openingHours: {},
          highlights: [],
        });
      })
      .filter((service) => service.name);

    // Return success response with processed services
    return Response.json(
      {
        success: true,
        status: 200,
        message: 'Services fetched successfully',
        data: services.map((service) => ({
          ...service,
          locations: service.locations,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching services:', error);
    return Response.json(
      {
        success: false,
        status: 500,
        message: 'Internal server error',
        data: null,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
