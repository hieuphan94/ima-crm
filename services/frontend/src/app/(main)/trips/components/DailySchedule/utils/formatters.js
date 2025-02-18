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

export const calculatePriceByStarRating = (type, mealType, starRating, pax) => {
  if (!type || !pax) return 0;

  if (type === 'food') {
    if (mealType === 'breakfast') {
      return 0;
    }

    const validPax = parseInt(pax) || 1;

    switch (starRating) {
      case 3:
        return EXCHANGE_RATE.VND_TO_USD * 2 * validPax;
      case 4:
        return EXCHANGE_RATE.VND_TO_USD * 5 * validPax;
      case 5:
        return EXCHANGE_RATE.VND_TO_USD * 10 * validPax;
      default:
        return EXCHANGE_RATE.VND_TO_USD * validPax;
    }
  }
  return 0;
};

export const convertTimeToMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
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

export const normalizedServices = (daySchedule, paxCalculate, starRating) => {
  if (!daySchedule || !daySchedule.services) return [];

  return daySchedule.services.map((service) => ({
    ...service,
    priceUSD: calculatePriceByStarRating(service.type, service.mealType, starRating, paxCalculate),
  }));
};
