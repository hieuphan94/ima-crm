import { GoogleSheetService } from '@/api/credentials/googleSheet';
import { AccommodationType } from '@/data/models/enums';
import { AccommodationService } from '@/data/models/services/AccommodationService';

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
    const data = await sheetService.getSheetData('Hotel!A2:K270');

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
      CATEGORY: 2, // Cột C
      ROOM: 3, // Cột D
      FIT: 4, // Cột E
      GIT: 5, // Cột F,
      FOC: 6, // Cột G,
      SUP: 7, // Cột H,
      NOTE: 8, // Cột I,
      WEBSITE: 9, // Cột J,
      YEAR: 10, // Cột K,
    };

    // Lọc services theo location
    const filteredServices = data.slice(1).filter((row) => {
      const rowLocation = normalizeLocationName(row[columnIndexes.LOCATION]);
      return rowLocation && rowLocation === normalizedLocation;
    });

    // console.log('filteredServices', filteredServices);

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

    const accommodationTypeCheck = (type) => {
      if (type === 'local') return AccommodationType.LOCAL;
      return AccommodationType.HOTEL;
    };

    const categoryCheck = (type) => {
      if (type !== 'local') return type;
      return 0;
    };

    // Chuyển đổi dữ liệu theo cấu trúc mới
    const services = filteredServices
      .map((row) => {
        return new AccommodationService({
          location: row[columnIndexes.LOCATION] || '',
          name: row[columnIndexes.NAME] || '',
          rating: categoryCheck(row[columnIndexes.CATEGORY]),
          rooms: {
            roomName: row[columnIndexes.ROOM] || '',
            price: {
              fit_price: parseFloat(row[columnIndexes.FIT]) || 0,
              git_price: parseFloat(row[columnIndexes.GIT]) || 0,
              foc_price: parseFloat(row[columnIndexes.FOC]) || 0,
              sup_price: parseFloat(row[columnIndexes.SUP]) || 0,
            },
          },
          accommodationType: accommodationTypeCheck(row[columnIndexes.CATEGORY]),
          note: row[columnIndexes.NOTE] || '',
          website: row[columnIndexes.WEBSITE] || '',
          year: row[columnIndexes.YEAR] || 2025,
        });
      })
      .filter((service) => service.name);

    // Return success response with processed services
    return Response.json(
      {
        success: true,
        status: 200,
        message: 'Services fetched successfully',
        data: services,
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
