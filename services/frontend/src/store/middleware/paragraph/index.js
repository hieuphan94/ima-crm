// src/store/middleware/paragraph/index.js
import { debounce } from 'lodash';
import {
  aggregatedLocation,
  getLastLocationOfDay,
  locationToShortName,
  locationToTitle,
  normalizedServices,
} from '../../../app/(main)/trips/components/DailySchedule/utils/formatters';
import { updateDayParagraph } from '../../slices/useDailyScheduleSlice';
import { paragraphCache } from './cache';
import { generateDescription } from './generator';

const TRACKED_ACTIONS = [
  // Service actions
  'dailySchedule/addService',
  'dailySchedule/removeService',
  'dailySchedule/reorderServices',

  // Day info actions
  'dailySchedule/updateDayTitle',
  'dailySchedule/setDistance',
  'dailySchedule/setPaxChangeOfDay',

  // Day management actions
  'dailySchedule/initializeDays',
  'dailySchedule/resetDays',
  'dailySchedule/reorderDays',
  'dailySchedule/removeDay',

  // Meal actions
  'dailySchedule/setDayMeals',
  'dailySchedule/toggleMealIncluded',
  'dailySchedule/toggleMealOption',
];

// Map để track pending updates
const pendingUpdates = new Map();

// Thêm helper function mới
const generateDayTitle = (scheduleItems, currentDayId) => {
  const allDays = Object.keys(scheduleItems);
  const currentDayIndex = allDays.indexOf(currentDayId);
  const currentDayLocations = aggregatedLocation(normalizedServices(scheduleItems[currentDayId]));

  if (currentDayIndex > 0) {
    const previousDay = allDays[currentDayIndex - 1];
    const previousLocation = locationToShortName(getLastLocationOfDay(scheduleItems[previousDay]));
    const currentFirstLocation = currentDayLocations[0];

    return previousLocation !== currentFirstLocation
      ? `${previousLocation} - ${locationToTitle(currentDayLocations)}`
      : locationToTitle(currentDayLocations);
  }

  return currentDayLocations.length === 1
    ? `Bonjour ${locationToTitle(currentDayLocations)}`
    : locationToTitle(currentDayLocations);
};

// Xử lý batch updates với debounce
const processBatchUpdates = debounce((store) => {
  const state = store.getState();

  try {
    for (const [dayId, shouldUpdate] of pendingUpdates.entries()) {
      if (shouldUpdate) {
        const daySchedule = state.dailySchedule.scheduleItems[dayId];

        // Double check daySchedule tồn tại
        if (!daySchedule) {
          console.warn(`Day ${dayId} not found in schedule during batch update`);
          pendingUpdates.delete(dayId); // Xóa khỏi pending updates
          continue;
        }

        // Check cache first
        const cacheKey = paragraphCache.getKeyWithMetadata(dayId, daySchedule);
        const cached = paragraphCache.get(cacheKey);

        if (cached) {
          store.dispatch(
            updateDayParagraph({
              dayId,
              ...cached,
            })
          );
          continue;
        }

        // Generate new paragraph if not cached
        const paragraph = generateDescription(daySchedule);

        // Cache the result
        paragraphCache.set(cacheKey, paragraph);

        // Update store
        store.dispatch(
          updateDayParagraph({
            dayId,
            ...paragraph,
          })
        );

        // Clear pending status
        pendingUpdates.delete(dayId); // Sử dụng delete thay vì set false
      }
    }
  } catch (error) {
    console.error('Error processing paragraph updates:', error);
  }
}, 500);

export const paragraphMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Xử lý các action đặc biệt trước
  switch (action.type) {
    case 'dailySchedule/initializeDays': {
      // Đợi state được cập nhật
      setTimeout(() => {
        const state = store.getState();
        const days = Object.keys(state.dailySchedule.scheduleItems);
        days.forEach((dayId) => {
          const daySchedule = state.dailySchedule.scheduleItems[dayId];
          if (daySchedule) {
            const paragraph = generateDescription(daySchedule);
            store.dispatch(
              updateDayParagraph({
                dayId,
                ...paragraph,
              })
            );
          }
        });
      }, 0);
      return result;
    }

    case 'dailySchedule/resetDays': {
      paragraphCache.clear();
      setTimeout(() => {
        const state = store.getState();
        const days = Object.keys(state.dailySchedule.scheduleItems);
        if (days.length > 0) {
          const firstDayId = days[0];
          const daySchedule = state.dailySchedule.scheduleItems[firstDayId];
          if (daySchedule) {
            const paragraph = generateDescription(daySchedule);
            store.dispatch(
              updateDayParagraph({
                dayId: firstDayId,
                ...paragraph,
              })
            );
          }
        }
      }, 0);
      return result;
    }
  }

  // Các actions thông thường
  const ACTIONS_TO_UPDATE = [
    'dailySchedule/addService',
    'dailySchedule/removeService',
    'dailySchedule/reorderServices',
    'dailySchedule/updateDayTitle',
    'dailySchedule/setDistance',
    'dailySchedule/setDayMeals',
  ];

  if (ACTIONS_TO_UPDATE.includes(action.type)) {
    try {
      const state = store.getState();
      const { dayId, day } = action.payload;
      const targetDayId = dayId || day;

      // Kiểm tra day tồn tại trong state
      if (!targetDayId || !state.dailySchedule.scheduleItems[targetDayId]) {
        console.warn(`Day ${targetDayId} not found in schedule, skipping update`);
        return result;
      }

      // Thêm vào pending updates thay vì update ngay
      pendingUpdates.set(targetDayId, true);

      // Trigger batch processing
      processBatchUpdates(store);
    } catch (error) {
      console.error('Error in paragraph middleware:', error);
    }
  }

  return result;
};
