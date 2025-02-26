// Location Related Enums
export const Region = {
  NORTH: 'north',
  CENTRAL: 'central',
  SOUTH: 'south',
  HIGHLANDS: 'highlands',
  COASTAL: 'coastal',
  MEKONG: 'mekong',
};

export const Country = {
  VIETNAM: 'vietnam',
  LAOS: 'laos',
  CAMBODIA: 'cambodia',
  THAILAND: 'thailand',
  MYANMAR: 'myanmar',
};

// Service Related Enums
export const ServiceType = {
  ACCOMMODATION: 'accommodation',
  FOOD: 'food',
  TRANSPORT: 'transport',
  ACTIVITY: 'activity',
  GUIDE: 'guide',
  VISIT: 'visit',
};

export const AccommodationType = {
  LOCAL: 'local',
  HOTEL: 'hotel',
  RESORT: 'resort',
  HOMESTAY: 'homestay',
  BOAT: 'boat',
  CRUISE: 'cruise',
  VILLA: 'villa',
  APARTMENT: 'apartment',
};

export const RoomTypesByAccommodation = {
  [AccommodationType.HOTEL]: ['Standard', 'Superior', 'Deluxe', 'Suite', 'Executive'],
  [AccommodationType.RESORT]: ['Garden View', 'Pool View', 'Beach Front', 'Villa', 'Bungalow'],
  [AccommodationType.HOMESTAY]: ['Private Room', 'Shared Room', 'Entire House'],
  [AccommodationType.BOAT]: ['Standard Cabin', 'Deluxe Cabin', 'Suite Cabin'],
  [AccommodationType.CRUISE]: ['Interior', 'Ocean View', 'Balcony', 'Suite'],
  [AccommodationType.VILLA]: ['2 Bedrooms', '3 Bedrooms', '4 Bedrooms', 'Penthouse'],
  [AccommodationType.APARTMENT]: ['Studio', '1 Bedroom', '2 Bedrooms', '3 Bedrooms'],
};

export const FoodServiceType = {
  BASE: 'base',
  ADVANCED: 'advanced',
  SPECIAL: 'special',
};

export const MealType = {
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
};

export const FoodVenueType = {
  HOTEL: 'hotel',
  HOMESTAY: 'homestay',
  LOCAL_RESTAURANT: 'local_restaurant',
  PICNIC: 'picnic',
  FREE_CHOICE: 'free_choice',
};

export const TouristSpotType = {
  NATURAL: 'natural',
  BEACH: 'beach',
  MOUNTAIN: 'mountain',
  HISTORICAL: 'historical',
  CULTURAL: 'cultural',
  RELIGIOUS: 'religious',
  ENTERTAINMENT: 'entertainment',
};

// Service Level Related Enums
export const ServiceLevel = {
  TEMPLATE: 'template', // Dịch vụ mẫu cho Sales
  ACTUAL: 'actual', // Dịch vụ thực tế cho Operations
};

// Service Status
export const ServiceStatus = {
  ACTIVE: 'active', // Đang hoạt động bình thường
  INACTIVE: 'inactive', // Tạm ngưng hoạt động
  DISCONTINUED: 'discontinued', // Ngưng hoạt động vĩnh viễn
};
