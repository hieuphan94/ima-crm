import { v4 as uuidv4 } from 'uuid';
import { FoodVenueType, ServiceLevel, ServiceType } from '../models/enums';

export const SampleDataGenerator = {
  // Generate common service data
  generateCommonData: () => ({
    id: `service-${uuidv4()}`,
    icon: null,
    price: Math.floor(Math.random() * 500000) + 100000,
    quotedPrice: 0,
    actualPrice: null,
    supplier: null,
    serviceLevel: ServiceLevel.TEMPLATE,
    templateId: null,
    images: [],
    tags: [],
    address: '',
  }),

  // Generate sample data based on service type
  generateByType: {
    [ServiceType.VISIT]: (baseService) => ({
      ...baseService,
      duration: Math.floor(Math.random() * 3) + 1, // 1-3 hours
      ticketInfo: {
        adult: Math.floor(Math.random() * 200000) + 50000,
        child: Math.floor(Math.random() * 100000) + 25000,
      },
      openingHours: {
        open: '08:00',
        close: '17:00',
      },
      highlights: [],
    }),

    [ServiceType.ACTIVITY]: (baseService) => ({
      ...baseService,
      duration: Math.floor(Math.random() * 4) + 2, // 2-5 hours
      difficulty: 'easy',
      included: ['Guide', 'Equipment', 'Water'],
      requirements: ['Comfortable shoes', 'Camera'],
    }),

    [ServiceType.FOOD]: (baseService) => ({
      ...baseService,
      foodServiceType: 'BASE',
      meal: {
        id: `meal-${uuidv4()}`,
        mealType: 'LUNCH',
        venueType: FoodVenueType.LOCAL_RESTAURANT,
        price: baseService.price,
        servingTime: '12:00',
      },
      maxCapacity: 50,
      minimumPax: 2,
    }),
  },

  // Combine sheet data with sample data
  enrichServiceData: (sheetService) => {
    // Get base sample data
    const commonData = SampleDataGenerator.generateCommonData();

    // Generate type-specific data
    const typeSpecificData =
      SampleDataGenerator.generateByType[sheetService.type]?.(commonData) || {};

    // Combine with sheet data (sheet data takes precedence)
    return {
      ...commonData,
      ...typeSpecificData,
      ...sheetService,
      // Ensure these fields from sheet are preserved
      name: sheetService.name,
      description: sheetService.description,
      locations: sheetService.locations,
      type: sheetService.type,
    };
  },
};

// Helper function to enrich multiple services
export const enrichServicesWithSampleData = (sheetServices) => {
  return sheetServices.map((service) => SampleDataGenerator.enrichServiceData(service));
};
