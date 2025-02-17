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

  // Hàm để bôi đậm các từ viết hoa trong text
  const boldProperNouns = (text) => {
    if (!text) return text;

    const words = text.split(' ');
    let insideQuotes = false;

    const processedWords = words.map((word, index) => {
      // Check for opening/closing quotes
      if (word.includes('"')) {
        insideQuotes = !insideQuotes;
        return word;
      }

      // Skip bolding if inside quotes
      if (insideQuotes) return word;

      // Skip bolding in these cases:
      if (index === 0) return word;
      if (index > 0 && words[index - 1].endsWith('.')) return word;
      if (index > 0 && words[index - 1].endsWith(';')) return word;
      if (index > 0 && words[index - 1].endsWith(':')) return word;

      // Handle words with l', d' prefixes (both straight and curly apostrophes)
      const prefixMatch = word.match(/^([ldLD]['’'])/);
      if (prefixMatch) {
        const prefix = prefixMatch[0];
        const restOfWord = word.slice(prefix.length);
        // Check if the rest of the word starts with capital letter
        if (/^[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐĨŨƠƯẾỀỂỄỆỐ]/.test(restOfWord)) {
          return `<strong>${word}</strong>`;
        }
        return word;
      }

      // Regular cases for bolding - words starting with capital letter
      if (/^[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐĨŨƠƯẾỀỂỄỆỐ]/.test(word)) {
        return `<strong>${word}</strong>`;
      }

      return word;
    });

    return processedWords.join(' ');
  };

  let description = '';
  availableConnectors = ['Ensuite, ', 'Puis, ', 'Après, '];

  // Phân loại visit services theo thời gian
  const timeKeys = Object.keys(daySchedule).filter((key) => /^\d/.test(key));
  const visitServices = [];

  // Chỉ lấy visit services
  timeKeys.forEach((timeKey) => {
    const items = daySchedule[timeKey] || [];
    items.forEach((item) => {
      const hour = parseInt(timeKey.split(':')[0]);
      if (item.type !== 'food') {
        visitServices.push({
          ...item,
          hour,
          time: timeKey,
        });
      }
    });
  });

  // Phân loại visit theo thời gian
  const periods = {
    morning: visitServices
      .filter((s) => s.hour >= 6 && s.hour < 12)
      .sort((a, b) => a.hour - b.hour),
    afternoon: visitServices
      .filter((s) => s.hour >= 12 && s.hour < 17)
      .sort((a, b) => a.hour - b.hour),
    evening: visitServices
      .filter((s) => s.hour >= 17 && s.hour < 21)
      .sort((a, b) => a.hour - b.hour),
  };

  // Sử dụng meals đã được tính toán sẵn
  const { meals = {} } = daySchedule;

  // Thêm bữa sáng nếu có
  if (meals?.breakfast?.included) {
    description += `<p>Petit déjeuner ${formatVenuePhrase(meals.breakfast.type)}.</p>`;
  }

  // Morning section
  if (periods.morning.length) {
    description += '<p>En matinée, ';
    // First morning service
    const firstService = periods.morning[0];
    if (firstService?.sentence) {
      description += boldProperNouns(
        firstService.sentence.charAt(0).toLowerCase() + firstService.sentence.slice(1)
      );
    }
    // Remaining morning services with connectors
    for (let i = 1; i < periods.morning.length; i++) {
      const service = periods.morning[i];
      if (service?.sentence) {
        description +=
          ' ' +
          getNextConnector() +
          boldProperNouns(service.sentence.charAt(0).toLowerCase() + service.sentence.slice(1));
      }
    }
    description += '</p>';
  }

  // Thêm bữa trưa nếu có
  if (meals?.lunch?.included) {
    description += `<p>Déjeuner ${formatVenuePhrase(meals.lunch.type)}.</p>`;
  }

  // Afternoon section
  if (periods.afternoon.length) {
    description += '<p>En après-midi, ';
    // First afternoon service
    const firstService = periods.afternoon[0];
    if (firstService?.sentence) {
      description += boldProperNouns(
        firstService.sentence.charAt(0).toLowerCase() + firstService.sentence.slice(1)
      );
    }
    // Remaining afternoon services with connectors
    for (let i = 1; i < periods.afternoon.length; i++) {
      const service = periods.afternoon[i];
      if (service?.sentence) {
        description +=
          ' ' +
          getNextConnector() +
          boldProperNouns(service.sentence.charAt(0).toLowerCase() + service.sentence.slice(1));
      }
    }
    description += '</p>';
  }

  // Evening section
  if (periods.evening.length) {
    description += '<p>';
    // First evening service
    const firstService = periods.evening[0];
    if (firstService?.sentence) {
      description += boldProperNouns(firstService.sentence);
    }
    // Remaining evening services with connectors
    for (let i = 1; i < periods.evening.length; i++) {
      const service = periods.evening[i];
      if (service?.sentence) {
        description +=
          ' ' +
          getNextConnector() +
          boldProperNouns(service.sentence.charAt(0).toLowerCase() + service.sentence.slice(1));
      }
    }
    description += '</p>';
  }

  // Thêm bữa tối nếu có
  if (meals?.dinner?.included) {
    description += `<p>Dîner ${formatVenuePhrase(meals.dinner.type)}.</p>`;
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
