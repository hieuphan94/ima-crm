import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  settings: {
    globalPax: 1, // Số khách mặc định = guests.length
    numberOfDays: 1, // Số ngày của lịch trình
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
  scheduleItems: {},

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
      // Reset scheduleItems và tạo mới với UUID
      state.scheduleItems = days.reduce((acc, { id, order }) => {
        acc[id] = {
          order,
          distance: 0,
          titleOfDay: '',
          // ... other day properties
        };
        return acc;
      }, {});
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

      if (!state.scheduleItems[day]) {
        state.scheduleItems[day] = {};
      }
      if (!state.scheduleItems[day][time]) {
        state.scheduleItems[day][time] = [];
      }

      if (!state.scheduleItems[day][time].some((s) => s.id === service.id)) {
        state.scheduleItems[day][time].push(service);
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
    },
  },
});

export const {
  setSettingsSchedule,
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
} = useDailyScheduleSlice.actions;

export default useDailyScheduleSlice.reducer;
