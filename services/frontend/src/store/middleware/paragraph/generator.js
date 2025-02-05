import { FoodVenueType } from '@/data/models/enums';

// Track used connectors for the whole day
let availableConnectors = ['Ensuite, ', 'Puis, ', 'Après, '];

const getNextConnector = () => {
  // Reset if all connectors have been used
  if (availableConnectors.length === 0) {
    availableConnectors = ['Ensuite, ', 'Puis, ', 'Après, '];
  }
  // Get and remove first connector
  return availableConnectors.shift();
};

export const generateDescription = (daySchedule) => {
  if (!daySchedule || typeof daySchedule !== 'object') {
    console.warn('Invalid daySchedule:', daySchedule);
    return {
      paragraphFromLocation: '',
      paragraphTotal: '',
    };
  }

  let description = '';
  availableConnectors = ['Ensuite, ', 'Puis, ', 'Après, '];

  // Phân loại services theo thời gian
  const timeKeys = Object.keys(daySchedule).filter((key) => /^\d/.test(key));
  const services = {
    food: [],
    visit: [],
  };

  // Phân loại services
  timeKeys.forEach((timeKey) => {
    const items = daySchedule[timeKey] || [];
    items.forEach((item) => {
      const hour = parseInt(timeKey.split(':')[0]);
      if (item.type === 'food') {
        services.food.push({
          ...item,
          hour,
          time: timeKey,
        });
      } else {
        services.visit.push({
          ...item,
          hour,
          time: timeKey,
        });
      }
    });
  });

  // Phân loại food theo bữa ăn
  const meals = {
    breakfast: services.food.find((s) => s.meal?.mealType === 'breakfast'),
    lunch: services.food.find((s) => s.meal?.mealType === 'lunch'),
    dinner: services.food.find((s) => s.meal?.mealType === 'dinner'),
  };

  // Phân loại visit theo thời gian
  const periods = {
    morning: services.visit
      .filter((s) => s.hour >= 6 && s.hour < 12)
      .sort((a, b) => a.hour - b.hour),
    afternoon: services.visit
      .filter((s) => s.hour >= 12 && s.hour < 17)
      .sort((a, b) => a.hour - b.hour),
    evening: services.visit
      .filter((s) => s.hour >= 17 && s.hour < 21)
      .sort((a, b) => a.hour - b.hour),
  };

  // Thêm bữa sáng nếu có
  if (meals.breakfast) {
    description += `Petit déjeuner ${formatVenuePhrase(meals.breakfast.meal.venueType)}.\n\n`;
  }

  // Morning section
  if (periods.morning.length) {
    description += 'En matinée, ';
    // First morning service
    const firstService = periods.morning[0];
    if (firstService?.sentence) {
      description += firstService.sentence.charAt(0).toLowerCase() + firstService.sentence.slice(1);
    }
    // Remaining morning services with connectors
    for (let i = 1; i < periods.morning.length; i++) {
      const service = periods.morning[i];
      if (service?.sentence) {
        description +=
          '. ' +
          getNextConnector() +
          service.sentence.charAt(0).toLowerCase() +
          service.sentence.slice(1);
      }
    }
    description += '\n\n';
  }

  // Thêm bữa trưa nếu có
  if (meals.lunch) {
    description += `Déjeuner ${formatVenuePhrase(meals.lunch.meal.venueType)}.\n\n`;
  }

  // Afternoon section
  if (periods.afternoon.length) {
    description += 'En après-midi, ';
    // First afternoon service
    const firstService = periods.afternoon[0];
    if (firstService?.sentence) {
      description += firstService.sentence.charAt(0).toLowerCase() + firstService.sentence.slice(1);
    }
    // Remaining afternoon services with connectors
    for (let i = 1; i < periods.afternoon.length; i++) {
      const service = periods.afternoon[i];
      if (service?.sentence) {
        description +=
          ' ' +
          getNextConnector() +
          service.sentence.charAt(0).toLowerCase() +
          service.sentence.slice(1);
      }
    }
    description += '\n\n';
  }

  // Evening section
  if (periods.evening.length) {
    // First evening service
    const firstService = periods.evening[0];
    if (firstService?.sentence) {
      description += firstService.sentence;
    }
    // Remaining evening services with connectors
    for (let i = 1; i < periods.evening.length; i++) {
      const service = periods.evening[i];
      if (service?.sentence) {
        description +=
          ' ' +
          getNextConnector() +
          service.sentence.charAt(0).toLowerCase() +
          service.sentence.slice(1);
      }
    }
    description += '\n\n';
  }

  // Thêm bữa tối nếu có
  if (meals.dinner) {
    description += `Dîner ${formatVenuePhrase(meals.dinner.meal.venueType)}.`;
  }

  return {
    paragraphFromLocation: '',
    paragraphTotal: description,
  };
};

// Helper function to format venue phrase
const formatVenuePhrase = (venueType) => {
  const venuePhrases = {
    [FoodVenueType.HOTEL]: `à l'hôtel`,
    [FoodVenueType.LOCAL_RESTAURANT]: 'dans un restaurant local',
    [FoodVenueType.HOMESTAY]: "chez l'habitant",
    [FoodVenueType.PICNIC]: 'en pique-nique',
    [FoodVenueType.FREE_CHOICE]: 'libre',
  };
  return venuePhrases[venueType] || `à l'hôtel`;
};

// New helper function to get meal types
const getMealTypes = (daySchedule) => {
  if (!daySchedule) return [];

  return Object.keys(daySchedule)
    .filter((key) => /^\d/.test(key))
    .flatMap((timeKey) => {
      const services = Array.isArray(daySchedule[timeKey]) ? daySchedule[timeKey] : [];
      return services
        .filter((service) => service.type === 'food' && service.meal?.mealType)
        .map((service) => {
          const mealType = service.meal.mealType;
          const venueType = service.meal.venueType || 'hotel';
          return { mealType, venueType };
        });
    });
};
