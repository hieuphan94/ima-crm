import {
  FoodServiceType,
  FoodVenueType,
  MealType,
  ServiceLevel,
  ServiceType,
} from '../models/enums';

// Helper function để tạo food service template cơ bản
const createBasicFoodService = (mealType, venueType) => ({
  id: `food-${mealType}-${venueType}`,
  name: `${getMealTypeName(mealType)} - ${getVenueTypeName(venueType)}`,
  icon: getMealTypeIcon(mealType),
  supplier: null,
  type: ServiceType.FOOD,
  locations: [],
  address: '',
  sentence: '',
  images: [],
  description: '',
  foodServiceType: FoodServiceType.BASE,
  meal: {
    mealType,
    venueType,
    price: 1,
    quotedPrice: 1,
    servingTime: getMealTypeTime(mealType),
  },
  maxCapacity: 0,
  minimumPax: 0,
  isFeatured: false,
  serviceLevel: ServiceLevel.TEMPLATE,
});

// Helper functions để lấy tên và icon phù hợp
const getMealTypeName = (mealType) => {
  switch (mealType) {
    case MealType.BREAKFAST:
      return 'Petit-déjeuner';
    case MealType.LUNCH:
      return 'Déjeuner';
    case MealType.DINNER:
      return 'Dîner';
    default:
      return '';
  }
};

const getVenueTypeName = (venueType) => {
  switch (venueType) {
    case FoodVenueType.HOTEL:
      return 'Hotel';
    case FoodVenueType.HOMESTAY:
      return 'Homestay';
    case FoodVenueType.LOCAL_RESTAURANT:
      return 'Local Restaurant';
    case FoodVenueType.PICNIC:
      return 'Picnic';
    case FoodVenueType.FREE_CHOICE:
      return 'Free Choice';
    default:
      return '';
  }
};

const getMealTypeIcon = (mealType) => {
  switch (mealType) {
    case MealType.BREAKFAST:
      return '🍳';
    case MealType.LUNCH:
      return '🍱';
    case MealType.DINNER:
      return '🍽️';
    default:
      return '🍴';
  }
};

const getMealTypeTime = (mealType) => {
  switch (mealType) {
    case MealType.BREAKFAST:
      return '07:00';
    case MealType.LUNCH:
      return '12:00';
    case MealType.DINNER:
      return '18:00';
    default:
      return '';
  }
};

// Tạo danh sách các dịch vụ theo meal type
export const salesFoodServices = {
  [MealType.BREAKFAST]: Object.values(FoodVenueType).map((venueType) =>
    createBasicFoodService(MealType.BREAKFAST, venueType)
  ),
  [MealType.LUNCH]: Object.values(FoodVenueType).map((venueType) =>
    createBasicFoodService(MealType.LUNCH, venueType)
  ),
  [MealType.DINNER]: Object.values(FoodVenueType).map((venueType) =>
    createBasicFoodService(MealType.DINNER, venueType)
  ),
};
