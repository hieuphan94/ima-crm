import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import {
  aggregatedLocation,
  getLastLocationOfDay,
  locationToTitle,
  normalizedServices,
  updateAllDayTitles,
} from '../../app/(main)/trips/components/DailySchedule/utils/formatters';

const initialState = {
  settings: {
    globalPax: 1, // Số khách mặc định = guests.length
    numberOfDays: 1, // Số ngày của lịch trình
    starRating: 4, // Thêm mặc định là 4 sao
  },

  // Schedule Info (Thông tin lịch trình)
  scheduleInfo: {
    code: '', // Mã lịch trình
    title: '', // Tên lịch trình
    startDate: null, // Ngày bắt đầu
    endDate: null, // Ngày kết thúc
    version: 1, // Phiên bản lịch trình

    // Status History
    status: {
      current: 'draft', // Trạng thái hiện tại: draft, confirmed, completed, cancelled
      history: [],
    },

    // Internal Info
    internalInfo: {
      createdBy: '', // Người tạo
      createdAt: null, // Ngày tạo
    },

    // Customer Info
    customerInfo: {
      name: '', // Tên khách/đoàn
      nationality: '', // Quốc tịch
      language: '', // Ngôn ngữ sử dụng
      specialRequests: '', // Yêu cầu đặc biệt
    },

    // Group Info (Thông tin đoàn)
    groupInfo: {
      guests: [
        // Danh sách khách
        // {
        //   id: '',        // ID khách
        //   name: '',      // Tên khách
        //   nationality: '', // Quốc tịch
        //   passport: {    // Thông tin passport
        //     status: '',  // Trạng thái: pending, received, verified...
        //     images: [],  // Hình ảnh passport [array]
        //   },
        //   guestImages: [], // Hình ảnh khách [array]
        //   note: '',      // Ghi chú riêng cho khách
        //   specialRequests: '', // Yêu cầu đặc biệt của khách
        // }
      ],
    },

    // Schedule Transport Info (Thông tin vận chuyển toàn bộ lịch trình)
    scheduleTransport: {
      vehicles: [
        // Danh sách phương tiện sử dụng
        // {
        //   type: '',      // Loại xe: 4 seats, 7 seats, 16 seats...
        //   quantity: 0,   // Số lượng xe
        //   provider: '',  // Nhà cung cấp
        //   note: '',      // Ghi chú về phương tiện
        // }
      ],
      totalDistance: 0, // Tổng quãng đường (tự động từ sum(day.priceBaseDistance.distance))
      totalTransportPrice: 0, // Tổng giá vận chuyển
      transportNote: '', // Ghi chú vận chuyển chung
    },

    scheduleImages: [], // Hình ảnh đại diện lịch trình [max 5], có thể chọn từ dayImages
    totalPrice: 0, // Tổng giá = sum(dayTotalPrice)
    additionalPrice: {
      // Giá bổ sung lịch trình
      value: 0, // Số tiền bổ sung
      note: '', // Ghi chú lý do bổ sung giá
    },
    finalPrice: 0, // Giá cuối lịch trình = totalPrice + additionalPrice
    scheduleNotes: [
      // Ghi chú cho toàn bộ lịch trình
      // {
      //   content: '',   // Nội dung ghi chú
      //   createdBy: '', // Người tạo ghi chú
      //   createdAt: null // Thời gian tạo ghi chú
      // }
    ],
  },

  // Schedule Data (Dữ liệu lịch trình)
  scheduleItems: {
    // Thêm giá trị mặc định cho meals khi khởi tạo
    // [dayId]: {
    //   meals: {
    //     included: true,
    //     breakfast: true,
    //     lunch: false,
    //     dinner: false
    //   }
    // }
  },

  ui: {
    modalData: {
      isOpen: false,
      day: null,
      time: null,
      services: [],
    },
    expandedSlots: {},
  },
};

const useDailyScheduleSlice = createSlice({
  name: 'dailySchedule',
  initialState,
  reducers: {
    // Core
    setSettingsSchedule: (state, action) => {
      state.settings = action.payload;
    },

    initializeDays: (state, action) => {
      const days = action.payload;
      const existingItems = state.scheduleItems;
      const newScheduleItems = {};
      const existingIds = new Set(Object.keys(existingItems));

      for (const { id, order } of days) {
        if (existingIds.has(id)) {
          newScheduleItems[id] = {
            ...existingItems[id],
            order,
            // Update default meal structure
            meals: existingItems[id].meals || {
              breakfast: { included: false, type: '', price: 0 },
              lunch: { included: false, type: '', price: 0 },
              dinner: { included: false, type: '', price: 0 },
            },
            // Giữ lại paragraphDay nếu đã có
            paragraphDay: existingItems[id].paragraphDay || {
              paragraphFromLocation: '',
              paragraphTotal: '',
            },
            // Keep existing guide or set default
            guide: existingItems[id].guide || { included: true },
          };
        } else {
          newScheduleItems[id] = {
            order,
            distance: 0,
            titleOfDay: '',
            // New default meal structure
            meals: {
              breakfast: { included: false, type: '', price: 0 },
              lunch: { included: false, type: '', price: 0 },
              dinner: { included: false, type: '', price: 0 },
            },
            // Thêm paragraphDay mặc định cho ngày mới
            paragraphDay: {
              paragraphFromLocation: '',
              paragraphTotal: '',
            },
            guide: { included: true }, // Default guide setting for new days
          };
        }
      }

      state.scheduleItems = newScheduleItems;
    },

    // Time slot
    toggleTimeSlot: (state, action) => {
      const time = action.payload;
      state.ui.expandedSlots[time] = !state.ui.expandedSlots[time];
    },

    // Add, Remove, Reorder Services
    addService: (state, action) => {
      const { day, time, service } = action.payload;
      const currentPax = state.settings.globalPax;

      // Kiểm tra nếu service là accommodation
      if (service.type === 'accommodation') {
        // Chỉ cho phép thêm accommodation vào time 6:00
        if (time !== '23:00') {
          return;
        }
      } else {
        // Nếu không phải accommodation, không cho thêm vào time 6:00
        if (time === '23:00') {
          return;
        }
      }

      if (!state.scheduleItems[day]) {
        state.scheduleItems[day] = {};
      }
      if (!state.scheduleItems[day][time]) {
        state.scheduleItems[day][time] = [];
      }

      if (!state.scheduleItems[day][time].some((s) => s.id === service.id)) {
        state.scheduleItems[day][time].push(service);

        // Automatically update meals after adding service
        const meals = autoMealFromServiceFood(state.scheduleItems[day]);
        state.scheduleItems[day].meals = meals;

        // Automatically update finalLocation after adding service
        const lastLocation = getLastLocationOfDay(state.scheduleItems[day]);
        if (lastLocation) {
          state.scheduleItems[day].finalLocation = lastLocation || '';
        }

        // Update all day titles
        updateAllDayTitles(state.scheduleItems);
      }
    },

    removeService: (state, action) => {
      const { day, time, index } = action.payload;

      if (!state.scheduleItems[day]?.[time]) return;

      state.scheduleItems[day][time].splice(index, 1);

      // Cleanup empty arrays and objects
      if (state.scheduleItems[day][time].length === 0) {
        delete state.scheduleItems[day][time];
        if (Object.keys(state.scheduleItems[day]).length === 0) {
          delete state.scheduleItems[day];
        }
      }

      // Update modalData if necessary
      if (state.ui.modalData.day === day && state.ui.modalData.time === time) {
        if (state.scheduleItems[day]?.[time]?.length <= 1) {
          state.ui.modalData = { isOpen: false, day: null, time: null, services: [] };
        } else {
          state.ui.modalData.services = state.scheduleItems[day][time];
        }
      }

      // Automatically update meals after removing service
      if (state.scheduleItems[day]) {
        const meals = autoMealFromServiceFood(state.scheduleItems[day]);
        state.scheduleItems[day].meals = meals;
        // Automatically update titleOfDay after removing service
        state.scheduleItems[day].titleOfDay = locationToTitle(
          aggregatedLocation(normalizedServices(state.scheduleItems[day]))
        );
      }

      // Automatically update finalLocation after adding service
      const lastLocation = getLastLocationOfDay(state.scheduleItems[day]);
      if (lastLocation) {
        state.scheduleItems[day].finalLocation = lastLocation || '';
      }

      // Update all day titles
      updateAllDayTitles(state.scheduleItems);
    },

    reorderServices: (state, action) => {
      const { day, time, newServices } = action.payload;

      if (!state.scheduleItems[day]) {
        state.scheduleItems[day] = {};
      }

      // If time slot would be empty after reorder, delete it
      if (!newServices || newServices.length === 0) {
        delete state.scheduleItems[day][time];
        // If day becomes empty, delete it
        if (Object.keys(state.scheduleItems[day]).length === 0) {
          delete state.scheduleItems[day];
        }
      } else {
        state.scheduleItems[day][time] = newServices;
      }

      // Update modalData if necessary
      if (state.ui.modalData.day === day && state.ui.modalData.time === time) {
        if (!newServices || newServices.length === 0) {
          state.ui.modalData = { isOpen: false, day: null, time: null, services: [] };
        } else {
          state.ui.modalData.services = newServices;
        }
      }

      // Automatically update meals after reordering services
      if (state.scheduleItems[day]) {
        const meals = autoMealFromServiceFood(state.scheduleItems[day]);
        state.scheduleItems[day].meals = meals;
        // Automatically update titleOfDay after reordering services
        state.scheduleItems[day].titleOfDay = locationToTitle(
          aggregatedLocation(normalizedServices(state.scheduleItems[day]))
        );
      }

      // Automatically update finalLocation after adding service
      const lastLocation = getLastLocationOfDay(state.scheduleItems[day]);
      if (lastLocation) {
        state.scheduleItems[day].finalLocation = lastLocation || '';
      }

      // Update all day titles
      updateAllDayTitles(state.scheduleItems);
    },

    // Modal
    openModal: (state, action) => {
      const { day, time, services } = action.payload;
      if (services.length > 1) {
        state.ui.modalData = {
          isOpen: true,
          day,
          time,
          services,
        };
      }
    },

    closeModal: (state) => {
      state.ui.modalData = {
        isOpen: false,
        day: null,
        time: null,
        services: [],
      };
    },

    // Day
    updateDayTitle: (state, action) => {
      const { day, title } = action.payload;
      if (!state.scheduleItems[day]) {
        state.scheduleItems[day] = {};
      }
      state.scheduleItems[day].titleOfDay = title;
    },

    setDistance: (state, action) => {
      const { day, distance } = action.payload;

      // Đảm bảo object cho ngày đó tồn tại
      if (!state.scheduleItems[day]) {
        state.scheduleItems[day] = {};
      }

      // Cập nhật distance cho ngày cụ thể
      state.scheduleItems[day].distance = distance;

      // Tự động cập nhật totalDistance trong scheduleTransport
      const allDayDistances = Object.values(state.scheduleItems).map(
        (dayData) => dayData.distance || 0
      );

      state.scheduleInfo.scheduleTransport.totalDistance = allDayDistances.reduce(
        (sum, current) => sum + current,
        0
      );
    },

    // Thêm action để xóa ngày
    removeDay: (state, action) => {
      const { dayId } = action.payload;
      delete state.scheduleItems[dayId];

      // Cập nhật lại order cho các ngày còn lại
      const remainingDays = Object.entries(state.scheduleItems).sort(
        ([, a], [, b]) => a.order - b.order
      );

      remainingDays.forEach(([id, data], index) => {
        state.scheduleItems[id].order = index + 1;
      });

      // Cập nhật numberOfDays trong settings
      state.settings.numberOfDays = remainingDays.length;

      // Update all day titles
      updateAllDayTitles(state.scheduleItems);
    },

    // Cập nhật lại action reorderDays
    reorderDays: (state, action) => {
      const { sourceDayId, targetDayId, sourceOrder, targetOrder } = action.payload;

      // Lấy tất cả các ngày và sắp xếp theo order hiện tại
      const days = Object.entries(state.scheduleItems);

      days.forEach(([dayId, dayData]) => {
        // Trường hợp kéo từ trên xuống (sourceOrder < targetOrder)
        if (sourceOrder < targetOrder) {
          if (dayId === sourceDayId) {
            // Ngày được kéo sẽ có order mới = targetOrder
            state.scheduleItems[dayId].order = targetOrder;
          } else if (dayData.order > sourceOrder && dayData.order <= targetOrder) {
            // Các ngày ở giữa sẽ giảm order đi 1
            state.scheduleItems[dayId].order -= 1;
          }
        }
        // Trường hợp kéo từ dưới lên (sourceOrder > targetOrder)
        else if (sourceOrder > targetOrder) {
          if (dayId === sourceDayId) {
            // Ngày được kéo sẽ có order mới = targetOrder
            state.scheduleItems[dayId].order = targetOrder;
          } else if (dayData.order >= targetOrder && dayData.order < sourceOrder) {
            // Các ngày ở giữa sẽ tăng order lên 1
            state.scheduleItems[dayId].order += 1;
          }
        }
      });
      // Update all day titles
      updateAllDayTitles(state.scheduleItems);
    },

    // Thêm action để cập nhật paxChangeOfDay
    setPaxChangeOfDay: (state, action) => {
      const { dayId, pax } = action.payload;

      // Đảm bảo object cho ngày đó tồn tại
      if (!state.scheduleItems[dayId]) {
        state.scheduleItems[dayId] = {};
      }

      // Cập nhật paxChangeOfDay
      if (pax === '' || pax === null) {
        // Nếu pax rỗng hoặc null, xóa paxChangeOfDay
        delete state.scheduleItems[dayId].paxChangeOfDay;
      } else {
        // Cập nhật giá trị mới
        state.scheduleItems[dayId].paxChangeOfDay = pax;
      }
    },

    // Thêm action resetDays
    resetDays: (state) => {
      // Reset về giá trị mặc định
      state.settings.numberOfDays = 1;
      state.scheduleItems = {};

      // Tạo ngày đầu tiên
      const firstDayId = uuidv4();
      state.scheduleItems[firstDayId] = {
        order: 1,
        distance: 0,
        titleOfDay: '',
      };
    },

    toggleMealIncluded: (state, action) => {
      const { dayId, included } = action.payload;
      if (!state.scheduleItems[dayId]) {
        state.scheduleItems[dayId] = {};
      }
      if (!state.scheduleItems[dayId].meals) {
        state.scheduleItems[dayId].meals = {
          included: true,
          breakfast: true,
          lunch: false,
          dinner: false,
        };
      }
      state.scheduleItems[dayId].meals.included = included;
    },

    toggleMealOption: (state, action) => {
      const { dayId, mealType } = action.payload;
      if (!state.scheduleItems[dayId]) {
        state.scheduleItems[dayId] = {};
      }
      if (!state.scheduleItems[dayId].meals) {
        state.scheduleItems[dayId].meals = {
          included: true,
          breakfast: true,
          lunch: false,
          dinner: false,
        };
      }
      state.scheduleItems[dayId].meals[mealType] = !state.scheduleItems[dayId].meals[mealType];
    },

    // Thêm action riêng để update star rating
    setStarRating: (state, action) => {
      state.settings.starRating = action.payload;
    },

    // Giữ lại reducer đơn giản để update paragraph
    updateDayParagraph: (state, action) => {
      const { dayId, paragraphTotal } = action.payload;

      if (!state.scheduleItems[dayId]) {
        state.scheduleItems[dayId] = {};
      }

      if (!state.scheduleItems[dayId].paragraphDay) {
        state.scheduleItems[dayId].paragraphDay = {
          paragraphFromLocation: '',
          paragraphTotal: '',
        };
      }
      // Update paragraph
      state.scheduleItems[dayId].paragraphDay.paragraphTotal = paragraphTotal;
    },

    loadScheduleItems: (state, action) => {
      // Load schedule items from history
      state.scheduleItems = action.payload;
    },

    setScheduleTitle: (state, action) => {
      state.scheduleInfo.title = action.payload;
    },

    // Customer Info
    updateCustomerInfo: (state, action) => {
      const { field, value } = action.payload;
      state.scheduleInfo.customerInfo[field] = value;
    },

    // Group Info
    updateGroupGuests: (state, action) => {
      state.scheduleInfo.groupInfo.guests = action.payload;
    },

    addGroupGuest: (state) => {
      state.scheduleInfo.groupInfo.guests.push({
        id: Date.now().toString(),
        name: '',
        nationality: '',
      });
    },

    removeGroupGuest: (state, action) => {
      const index = action.payload;
      state.scheduleInfo.groupInfo.guests = state.scheduleInfo.groupInfo.guests.filter(
        (_, i) => i !== index
      );
    },

    updateGroupGuest: (state, action) => {
      const { index, field, value } = action.payload;
      state.scheduleInfo.groupInfo.guests[index][field] = value;
    },

    // Schedule Images
    updateScheduleImages: (state, action) => {
      state.scheduleInfo.scheduleImages = action.payload;
    },

    addScheduleImage: (state, action) => {
      if (state.scheduleInfo.scheduleImages.length < 5) {
        state.scheduleInfo.scheduleImages.push(action.payload);
      }
    },

    removeScheduleImage: (state, action) => {
      const index = action.payload;
      state.scheduleInfo.scheduleImages = state.scheduleInfo.scheduleImages.filter(
        (_, i) => i !== index
      );
    },

    // Add new reducer for guide
    setDayGuide: (state, action) => {
      const { dayId, included } = action.payload;

      if (!state.scheduleItems[dayId]) {
        state.scheduleItems[dayId] = {};
      }

      state.scheduleItems[dayId].guide = {
        included,
      };
    },
  },
});

export const {
  setSettingsSchedule,
  setStarRating,
  toggleTimeSlot,
  addService,
  removeService,
  reorderServices,
  openModal,
  closeModal,
  updateDayTitle,
  setDistance,
  initializeDays,
  removeDay,
  reorderDays,
  setPaxChangeOfDay,
  resetDays,
  toggleMealIncluded,
  toggleMealOption,
  updateDayParagraph,
  loadScheduleItems,
  setScheduleTitle,
  updateCustomerInfo,
  updateGroupGuests,
  addGroupGuest,
  removeGroupGuest,
  updateGroupGuest,
  updateScheduleImages,
  addScheduleImage,
  removeScheduleImage,
  setDayGuide,
} = useDailyScheduleSlice.actions;

export default useDailyScheduleSlice.reducer;

// Renamed helper function
const autoMealFromServiceFood = (dayData) => {
  // Initialize default meal structure
  const meals = {
    breakfast: { included: false, type: '', price: 0 },
    lunch: { included: false, type: '', price: 0 },
    dinner: { included: false, type: '', price: 0 },
  };

  // Get all time slots for the day
  const timeSlots = Object.entries(dayData);

  // Analyze each time slot for food services
  timeSlots.forEach(([time, services]) => {
    if (Array.isArray(services)) {
      services.forEach((service) => {
        if (service.type === 'food' && service.meal) {
          const { mealType, venueType, price } = service.meal;

          // Map mealType to our structure (breakfast, lunch, dinner)
          if (meals[mealType]) {
            meals[mealType] = {
              included: true,
              type: venueType || '',
              price: price || 0,
            };
          }
        }
      });
    }
  });

  return meals;
};

// Thêm helper function mới
