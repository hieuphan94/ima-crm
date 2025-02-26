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

export const locationToShortName = (location) => {
  if (!location) return '';
  const mainLocation = location.split(',')[0].trim();
  const abbreviation = mainLocation
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .join('');
  return abbreviation;
};

export const aggregatedLocation = (normalizedServices) => {
  const { visit, accommodation } = normalizedServices;
  // Combine all services with their locations and timeKeys
  const servicesWithLocation = [...visit, ...accommodation]
    .filter((service) => service.location)
    .sort((a, b) => convertTimeToMinutes(a.timeKey) - convertTimeToMinutes(b.timeKey));

  // Use Set to keep unique locations while maintaining order
  const locations = [];
  servicesWithLocation.forEach((service) => {
    const shortName = locationToShortName(service.location);
    if (!locations.includes(shortName)) {
      locations.push(shortName);
    }
  });

  return locations;
};

export const locationToTitle = (locations) => {
  return locations.join(' - ');
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

export const accommodationServices = (services) => {
  if (!services) return [];
  return services.filter((service) => service.type === 'accommodation');
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
    accommodation: accommodationServices(allServices),
    guide: guideServices(allServices),
  };

  return servicesDivided;
};
