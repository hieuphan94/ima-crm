import { ServiceLevel, ServiceStatus, ServiceType } from '@/data/models/enums';
import { VisitService } from '@/data/models/Service';
import { GoogleSheetService } from '@/services/googleSheet';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    // Format city thành dạng viết hoa, không dấu và bỏ khoảng trắng
    const normalizeText = (text) => {
      return (text || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .replace(/\s+/g, '')
        .replace(/-/g, '');
    };

    const city = normalizeText(searchParams.get('city') || 'hanoi');
    // Ví dụ: 'Hà Nội' -> 'HANOI'
    //        'Ha Noi' -> 'HANOI'
    //        'ha noi' -> 'HANOI'
    //        'HA NOI' -> 'HANOI'

    const sheetService = new GoogleSheetService(process.env.GOOGLE_SHEETS_ID);
    // Lấy toàn bộ dữ liệu từ sheet
    const data = await sheetService.getSheetData('TÁCH ĐỊA ĐIỂM!A1:D53');

    const headers = data[0];
    const visitCityIndex = headers.findIndex((header) => header === 'Visit City');

    const services = data
      .slice(1)
      .filter((row) => {
        const visitCity = normalizeText(row[visitCityIndex]);
        return visitCity && visitCity === city;
      })
      .map((row) => {
        const rawData = {};
        headers.forEach((header, index) => {
          if (header && row[index]) {
            rawData[header] = row[index];
          }
        });

        // Xử lý locations - chỉ lấy unique location
        const locationNames = new Set();
        if (rawData['Visit City']) locationNames.add(rawData['Visit City']);
        if (rawData['Visit Location'] && rawData['Visit Location'] !== rawData['Visit City']) {
          locationNames.add(rawData['Visit Location']);
        }

        // Tạo instance của VisitService
        return new VisitService({
          id: `service-${Math.random().toString(36).substr(2, 9)}`,
          name: rawData['Visit Title'] || '',
          type: ServiceType.VISIT,
          serviceLevel: ServiceLevel.TEMPLATE,
          locations: Array.from(locationNames), // Mảng các string
          sentence: rawData['PROGRAMME'] || '',
          serviceStatus: ServiceStatus.ACTIVE,
          // Các trường bắt buộc của VisitService
          duration: 0,
          ticketInfo: {},
          openingHours: {},
          highlights: [],
        });
      })
      .filter((service) => service.name);

    // Chuyển đổi instance thành plain object trước khi trả về
    const servicesData = services.map((service) => ({
      ...service,
      locations: service.locations, // Đảm bảo locations là mảng string
    }));

    return Response.json(servicesData);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
