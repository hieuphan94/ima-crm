import { GoogleSheetService } from '@/api/credentials/googleSheet';
import { ServiceLevel, ServiceStatus, ServiceType } from '@/data/models/enums';
import { VisitService } from '@/data/models/Service';

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

    // Format location thành dạng viết hoa, không dấu và bỏ khoảng trắng
    const normalizeText = (text) => {
      return (text || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/-/g, '');
    };

    const normalizedLocation = normalizeText(location);
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

    // Lấy toàn bộ dữ liệu từ sheet
    const data = await sheetService.getSheetData('TÁCH ĐỊA ĐIỂM!A1:F254');
    console.log('data', data);

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

    const headers = data[0];
    const locationIndex = headers.findIndex((header) => header === 'LOCATION');
    console.log('locationIndex', locationIndex);

    // Validate required columns
    if (locationIndex === -1) {
      return Response.json(
        {
          success: false,
          status: 500,
          message: 'Required column "LOCATION" not found in sheet',
          data: null,
        },
        { status: 500 }
      );
    }

    // Process services
    const filteredServices = data.slice(1).filter((row) => {
      const location = normalizeText(row[locationIndex]);
      return location && location === normalizedLocation;
    });

    console.log('filteredServices', filteredServices);

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

    // Transform data to services
    const services = filteredServices
      .map((row) => {
        const rawData = {};
        headers.forEach((header, index) => {
          if (header && row[index]) {
            rawData[header] = row[index];
          }
        });

        return new VisitService({
          id: `service-${Math.random().toString(36).substr(2, 9)}`,
          name: rawData['NAME'] || '',
          type: ServiceType.VISIT,
          serviceLevel: ServiceLevel.TEMPLATE,
          locations: rawData['LOCATION'] || '',
          sentence: rawData['PARAGRAPH'] || '',
          serviceStatus: ServiceStatus.ACTIVE,
          mealOption: rawData['MEAL'] || '',
          priceUsd: rawData['PRICE-USD'] || 0,
          priceGroupUsd: rawData['GROUP-USD'] || 0,
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
