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

export const formatCurrency = (amount, currency = 'VND') => {
  if (!amount) return '0';

  if (currency === 'USD') {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return `${amount.toLocaleString('vi-VN')}đ`;
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

export const aggregatedLocation = (daySchedule) => {
  if (!daySchedule) return '';

  const timeKeys = Object.keys(daySchedule)
    .filter((key) => /^\d/.test(key))
    .sort(); // Sort time keys to ensure chronological order

  const locations = new Set();
  let firstServiceLocations = []; // Store first service's locations separately

  // Find first service with locations
  for (const timeKey of timeKeys) {
    const timeSlotServices = Array.isArray(daySchedule[timeKey]) ? daySchedule[timeKey] : [];
    for (const service of timeSlotServices) {
      if (Array.isArray(service.locations) && service.locations.length > 0) {
        firstServiceLocations = service.locations.map((loc) => loc.trim());
        break;
      }
    }
    if (firstServiceLocations.length > 0) break;
  }

  // Collect all other locations
  timeKeys.forEach((timeKey) => {
    const timeSlotServices = Array.isArray(daySchedule[timeKey]) ? daySchedule[timeKey] : [];
    timeSlotServices.forEach((service) => {
      if (Array.isArray(service.locations)) {
        service.locations.forEach((loc) => {
          if (loc) locations.add(loc.trim());
        });
      }
    });
  });

  // Combine locations with first service's locations taking priority
  const result = [
    ...firstServiceLocations,
    ...Array.from(locations).filter((loc) => !firstServiceLocations.includes(loc)),
  ]
    .filter(Boolean)
    .join(' - ');

  return result;
};

export const foodServices = (services) => {
  if (!services) return [];
  return services.filter((service) => service.type === 'food');
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
  };

  console.log('servicesDivided', servicesDivided);
  return servicesDivided;
};
