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
    const data = await sheetService.getSheetData('TÁCH ĐỊA ĐIỂM!A1:D323');

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
    const visitCityIndex = headers.findIndex((header) => header === 'Visit City');

    // Validate required columns
    if (visitCityIndex === -1) {
      return Response.json(
        {
          success: false,
          status: 500,
          message: 'Required column "Visit City" not found in sheet',
          data: null,
        },
        { status: 500 }
      );
    }

    // Process services
    const filteredServices = data.slice(1).filter((row) => {
      const visitCity = normalizeText(row[visitCityIndex]);
      return visitCity && visitCity === normalizedLocation;
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

    // Transform data to services
    const services = filteredServices
      .map((row) => {
        const rawData = {};
        headers.forEach((header, index) => {
          if (header && row[index]) {
            rawData[header] = row[index];
          }
        });

        // Xử lý locations
        const locationNames = new Set();
        if (rawData['Visit City']) locationNames.add(rawData['Visit City']);
        if (rawData['Visit Location'] && rawData['Visit Location'] !== rawData['Visit City']) {
          locationNames.add(rawData['Visit Location']);
        }

        // Generate random prices
        const basePrice = Math.floor(Math.random() * (500000 - 100000 + 1) + 100000);

        return new VisitService({
          id: `service-${Math.random().toString(36).substr(2, 9)}`,
          name: rawData['Visit Title'] || '',
          type: ServiceType.VISIT,
          serviceLevel: ServiceLevel.TEMPLATE,
          locations: Array.from(locationNames),
          sentence: rawData['PROGRAMME'] || '',
          serviceStatus: ServiceStatus.ACTIVE,
          price: basePrice,
          quotedPrice: basePrice * 1.2,
          actualPrice: basePrice * 0.9,
          duration: 0,
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
