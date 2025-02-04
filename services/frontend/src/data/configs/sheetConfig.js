import { ServiceType } from '../models/enums';

export const SheetConfig = {
  // Cấu hình cho main sheet (sheet hiện tại)
  mainSheet: {
    name: 'Programme Sheet',
    mapping: {
      location: {
        city: 'LOCATION', // Column chứa city/province
        name: 'LOCATION', // Tên địa danh (sẽ được parse sau)
      },
      service: {
        name: 'PROGRAMME', // Column chứa tên dịch vụ
        description: 'PROGRAMME', // Column chứa description
      },
    },
    // Parse functions
    parsers: {
      location: (value) => {
        // Tách city và location name
        const [city, ...locationParts] = value.split('/').map((p) => p.trim());
        return {
          city: city,
          name: locationParts.join(' / '),
        };
      },
      service: (value) => {
        // Tách service name và description
        const lines = value.split('\n').map((line) => line.trim());
        return {
          name: lines[0],
          description: lines[1] || '',
        };
      },
    },
  },

  // Cấu hình cho additional sheets (sẽ thêm sau)
  additionalSheets: {
    PRICES: {
      name: 'Prices Sheet',
      mapping: {
        serviceName: 'Service Name',
        price: 'Price',
        currency: 'Currency',
      },
    },
    SCHEDULES: {
      name: 'Schedules Sheet',
      mapping: {
        serviceName: 'Service Name',
        startTime: 'Start Time',
        duration: 'Duration',
      },
    },
    SUPPLIERS: {
      name: 'Suppliers Sheet',
      mapping: {
        serviceName: 'Service Name',
        supplierName: 'Supplier',
        contact: 'Contact',
      },
    },
  },

  // Functions để detect service type
  serviceTypeDetection: {
    isVisitService: (name) => {
      const keywords = ['temple', 'pagode', 'musée', 'visite'];
      return keywords.some((k) => name.toLowerCase().includes(k));
    },
    isActivityService: (name) => {
      const keywords = ['cyclo', 'balade', 'exploration'];
      return keywords.some((k) => name.toLowerCase().includes(k));
    },
    isFoodService: (name) => {
      const keywords = ['gastronomie', 'marché', 'restaurant'];
      return keywords.some((k) => name.toLowerCase().includes(k));
    },
  },

  // Helper functions
  helpers: {
    // Detect service type từ name
    detectServiceType: (serviceName) => {
      if (SheetConfig.serviceTypeDetection.isVisitService(serviceName)) return ServiceType.VISIT;
      if (SheetConfig.serviceTypeDetection.isActivityService(serviceName))
        return ServiceType.ACTIVITY;
      if (SheetConfig.serviceTypeDetection.isFoodService(serviceName)) return ServiceType.FOOD;
      return ServiceType.VISIT; // Default type
    },

    // Merge data từ additional sheets
    mergeAdditionalData: (service, additionalData) => {
      if (additionalData.prices) {
        service.price = additionalData.prices.price;
      }
      if (additionalData.schedules) {
        service.duration = additionalData.schedules.duration;
      }
      if (additionalData.suppliers) {
        service.supplier = additionalData.suppliers.supplierName;
      }
      return service;
    },
  },
};

// Import function
export const importFromMainSheet = async (sheetData) => {
  return sheetData.map((row) => {
    // Parse location
    const location = SheetConfig.mainSheet.parsers.location(
      row[SheetConfig.mainSheet.mapping.location.city]
    );

    // Parse service
    const service = SheetConfig.mainSheet.parsers.service(
      row[SheetConfig.mainSheet.mapping.service.name]
    );

    // Detect service type
    const serviceType = SheetConfig.helpers.detectServiceType(service.name);

    // Create base service object
    return {
      name: service.name,
      description: service.description,
      type: serviceType,
      locations: [location.name],
      city: location.city,
    };
  });
};

// Function để merge với additional data
export const mergeWithAdditionalSheets = (services, additionalSheets) => {
  return services.map((service) => {
    const additionalData = {
      prices: additionalSheets.PRICES?.find((p) => p.serviceName === service.name),
      schedules: additionalSheets.SCHEDULES?.find((s) => s.serviceName === service.name),
      suppliers: additionalSheets.SUPPLIERS?.find((s) => s.serviceName === service.name),
    };

    return SheetConfig.helpers.mergeAdditionalData(service, additionalData);
  });
};
