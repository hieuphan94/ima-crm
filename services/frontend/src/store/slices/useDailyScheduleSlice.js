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
    modal: {
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
    setSettingsSchedule: (state, action) => {
      state.settings = action.payload;
    },

    toggleTimeSlot: (state, action) => {
      const time = action.payload;
      state.ui.expandedSlots[time] = !state.ui.expandedSlots[time];
    },

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

      // Update modal if necessary
      if (state.ui.modal.day === day && state.ui.modal.time === time) {
        if (state.scheduleItems[day]?.[time]?.length <= 1) {
          state.ui.modal = { isOpen: false, day: null, time: null, services: [] };
        } else {
          state.ui.modal.services = state.scheduleItems[day][time];
        }
      }
    },

    reorderServices: (state, action) => {
      const { day, time, newServices } = action.payload;

      if (!state.scheduleItems[day]) {
        state.scheduleItems[day] = {};
      }

      state.scheduleItems[day][time] = newServices;

      // Update modal if necessary
      if (state.ui.modal.day === day && state.ui.modal.time === time) {
        state.ui.modal.services = newServices;
      }
    },

    openModal: (state, action) => {
      const { day, time, services } = action.payload;
      if (services.length > 0) {
        state.ui.modal = {
          isOpen: true,
          day,
          time,
          services,
        };
      }
    },

    closeModal: (state) => {
      state.ui.modal = {
        isOpen: false,
        day: null,
        time: null,
        services: [],
      };
    },

    updateDayTitle: (state, action) => {
      const { day, title } = action.payload;
      if (!state.scheduleItems[day]) {
        state.scheduleItems[day] = {};
      }
      state.scheduleItems[day].titleOfDay = title;
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
} = useDailyScheduleSlice.actions;

export default useDailyScheduleSlice.reducer;
