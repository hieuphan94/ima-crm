import { EXCHANGE_RATE } from './constants';

export const truncateText = (text, limit) => {
  if (text.length <= limit) return text;
  return text.slice(0, limit) + '...';
};

export const convertVNDtoUSD = (amount) => {
  if (!amount) return 0;
  if (amount === 1) return 1;
  const amountNum = parseFloat(amount) || 0;
  return Number((amountNum / EXCHANGE_RATE.VND_TO_USD).toFixed(2));
};

export const starRatingFormula = (star) => {
  switch (star) {
    case 3:
      return 2 * EXCHANGE_RATE.VND_TO_USD;
    case 4:
      return 5 * EXCHANGE_RATE.VND_TO_USD;
    case 5:
      return 10 * EXCHANGE_RATE.VND_TO_USD;
    default:
      return 1 * EXCHANGE_RATE.VND_TO_USD;
  }
};

export const formulaFoodPriceByStarRating = (services, starRating, pax) => {
  return services.reduce((total, service) => {
    if (service.meal.mealType === 'breakfast') {
      return total;
    }
    return total + service.meal.price * starRatingFormula(starRating) * pax;
  }, 0);
};

export const convertTimeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

export const timeKeysOnDaySchedule = (daySchedule) => {
  return Object.keys(daySchedule)
    .filter((key) => /^\d/.test(key))
    .sort();
};

export const aggregatedLocation = (normalizedServices) => {
  const { visit } = normalizedServices;
  const locations = new Set();
  visit.forEach((service) => {
    if (service.location) {
      locations.add(service.location);
    }
  });

  return {
    firstLocation: Array.from(locations)[0],
    otherLocations: Array.from(locations).slice(1),
  };
};

export const foodServices = (services) => {
  if (!services) return [];
  return services.filter((service) => service.type === 'food');
};

export const guideServices = (services) => {
  if (!services) return [];
  return services.filter((service) => service.type === 'guide');
};

export const visitServices = (services) => {
  if (!services) return [];
  return services.filter((service) => service.type === 'visit');
};

export const hotelServices = (services) => {
  if (!services) return [];
  return services.filter((service) => service.type === 'hotel');
};

export const normalizedServices = (daySchedule) => {
  const timeKeys = timeKeysOnDaySchedule(daySchedule);

  // Tạo mảng chứa tất cả services từ daySchedule
  const allServices = [];
  timeKeys.forEach((timeKey) => {
    const timeSlotServices = daySchedule[timeKey] || [];
    timeSlotServices.forEach((service) => {
      allServices.push({
        ...service,
        timeKey,
      });
    });
  });

  // Phân loại services theo type
  const servicesDivided = {
    food: foodServices(allServices),
    visit: visitServices(allServices),
    hotel: hotelServices(allServices),
    guide: guideServices(allServices),
  };

  return servicesDivided;
};
