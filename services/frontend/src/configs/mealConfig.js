import { FoodVenueType, MealType } from '@/data/models/enums';

export const BaseMealConfig = {
  [MealType.BREAKFAST]: {
    allowedVenues: [FoodVenueType.HOTEL, FoodVenueType.HOMESTAY, FoodVenueType.PICNIC],
    pricing: {
      [FoodVenueType.HOTEL]: 'free', // Đổi từ 'included' thành 'free'
      [FoodVenueType.HOMESTAY]: 'free', // Giữ nguyên 'free'
      [FoodVenueType.PICNIC]: 'custom', // Giữ nguyên 'custom' cho ăn tự do
    },
  },
  [MealType.LUNCH]: {
    allowedVenues: [
      FoodVenueType.HOTEL,
      FoodVenueType.HOMESTAY,
      FoodVenueType.LOCAL_RESTAURANT,
      FoodVenueType.FREE_CHOICE,
    ],
    pricing: {
      [FoodVenueType.HOTEL]: 'fixed',
      [FoodVenueType.HOMESTAY]: 'fixed',
      [FoodVenueType.LOCAL_RESTAURANT]: 'fixed',
      [FoodVenueType.FREE_CHOICE]: 'free',
    },
  },
  [MealType.DINNER]: {
    allowedVenues: [
      FoodVenueType.HOTEL,
      FoodVenueType.HOMESTAY,
      FoodVenueType.LOCAL_RESTAURANT,
      FoodVenueType.FREE_CHOICE,
    ],
    pricing: {
      [FoodVenueType.HOTEL]: 'fixed',
      [FoodVenueType.HOMESTAY]: 'fixed',
      [FoodVenueType.LOCAL_RESTAURANT]: 'fixed',
      [FoodVenueType.FREE_CHOICE]: 'free',
    },
  },
};
