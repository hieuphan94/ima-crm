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

export const calculatePriceByStarRating = (type, mealType, paxChangeOfDay, globalPax) => {
  const pax = paxChangeOfDay ?? globalPax;

  if (type === 'food' && mealType === 'breakfast') {
    return 0;
  } else if (type === 'food') {
    switch (starRating) {
      case 3:
        return EXCHANGE_RATE.VND_TO_USD * 2 * pax;
      case 4:
        return EXCHANGE_RATE.VND_TO_USD * 5 * pax;
      case 5:
        return EXCHANGE_RATE.VND_TO_USD * 10 * pax;
      default:
        return EXCHANGE_RATE.VND_TO_USD * pax;
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

export const normalizedServices = (daySchedule, paxChangeOfDay, globalPax) => {
  if (!daySchedule) return [];

  const timeKeys = Object.keys(daySchedule).filter((key) => /^\d/.test(key));

  return timeKeys
    .flatMap((timeKey) => {
      const timeSlotServices = Array.isArray(daySchedule[timeKey]) ? daySchedule[timeKey] : [];

      return timeSlotServices.map((service) => {
        let price = 0;
        let name = '';

        if (service.type === 'food') {
          price = calculatePriceByStarRating(
            'food',
            service.meal.mealType,
            paxChangeOfDay,
            globalPax
          );
          name = service.name.split(' - ').slice(1).join(' - ');
        } else {
          price = service.price;
          name = service.name;
        }
        return {
          time: timeKey,
          timeInMinutes: convertTimeToMinutes(timeKey),
          name,
          price,
          priceUSD: convertVNDtoUSD(price),
          type: service.type,
        };
      });
    })
    .sort((a, b) => a.timeInMinutes - b.timeInMinutes);
};
