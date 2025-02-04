import { v4 as uuidv4 } from 'uuid';
import { BaseMealConfig } from '../../configs/mealConfig';
import {
  FoodServiceType,
  FoodVenueType,
  MealType,
  ServiceLevel,
  ServiceStatus,
  ServiceType,
} from '../enums';
import { Service } from '../Service';

// Base Meal Class
export class BaseMeal {
  constructor({
    id = `meal-${uuidv4()}`,
    mealType = MealType.LUNCH,
    venueType = FoodVenueType.LOCAL_RESTAURANT,
    price = 0,
    quotedPrice = 0,
    actualPrice = null,
    servingTime = '12:00',
  }) {
    this.id = id;
    this.mealType = mealType;
    this.venueType = venueType;
    this.price = this._calculatePrice(price);
    this.quotedPrice = quotedPrice;
    this.actualPrice = actualPrice;
    this.servingTime = servingTime;
  }

  _calculatePrice(inputPrice) {
    const config = BaseMealConfig[this.mealType];
    const pricingType = config.pricing[this.venueType];

    switch (pricingType) {
      case 'free':
        return 0;
      case 'custom':
      case 'fixed':
        return inputPrice;
      default:
        return 0;
    }
  }

  isFree() {
    return BaseMealConfig[this.mealType].pricing[this.venueType] === 'free';
  }

  getProfit() {
    if (this.actualPrice) {
      return this.quotedPrice - this.actualPrice;
    }
    return 0;
  }
}

export class FoodService extends Service {
  constructor({
    id = `food-${uuidv4()}`,
    name = '',
    icon = null,
    supplier = null,
    type = ServiceType.FOOD,
    locations = [],
    address = '',
    sentence = '',
    images = [],
    description = '',
    foodServiceType = FoodServiceType.BASE,
    meal = {},
    maxCapacity = 50,
    minimumPax = 2,
    isFeatured = false,
    serviceLevel = ServiceLevel.TEMPLATE,
    templateId = null,
    quotedPrice = 0,
    actualPrice = null,
    serviceStatus = ServiceStatus.ACTIVE,
  }) {
    super({
      id,
      name,
      icon,
      price: 0,
      supplier,
      type,
      locations,
      address,
      sentence,
      images,
      description,
      serviceLevel,
      templateId,
      quotedPrice,
      actualPrice,
      serviceStatus,
    });

    this.foodServiceType = foodServiceType;
    this.meal = new BaseMeal(meal);
    this.maxCapacity = maxCapacity;
    this.minimumPax = minimumPax;
    this.isFeatured = isFeatured;

    // Update price from meal
    this.price = this.meal.price;
  }

  calculateTotal(pax) {
    if (this.meal.isFree()) {
      return 0;
    }
    return this.price * pax;
  }

  isValidVenue() {
    return BaseMealConfig[this.meal.mealType].allowedVenues.includes(this.meal.venueType);
  }
}
