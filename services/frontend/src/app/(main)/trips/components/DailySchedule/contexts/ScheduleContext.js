'use client';
import { createContext } from 'react';

const defaultScheduleContext = {
  // Global Settings (Cài đặt chung)
  settings: {
    globalPax: null, // Số khách mặc định = guests.length
    numberOfDays: 0, // Số ngày của lịch trình
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
      history: [
        // {
        //   status: 'draft',
        //   timestamp: '2024-03-20T10:00:00Z',
        //   updatedBy: 'user123'
        // }
      ],
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
    // day1: {
    //   titleOfDay: '',           // Tiêu đề ngày
    //   dayImages: [],            // Hình ảnh đại diện ngày [max 3]
    //   dayParagraph: '',         // Đoạn văn mô tả lịch trình của ngày (tự động từ sentences)
    //   customParagraph: '',      // Đoạn văn tùy chỉnh (nếu user muốn sửa)
    //   locations: [              // Danh sách địa điểm trong ngày (tự động từ các dịch vụ)
    //     // {
    //     //   id: '',            // ID địa điểm
    //     //   name: '',          // Tên địa điểm
    //     //   address: '',       // Địa chỉ
    //     //   coordinates: {     // Tọa độ
    //     //     lat: 0,
    //     //     lng: 0
    //     //   },
    //     //   time: '09:00',     // Thời gian ghé thăm
    //     // }
    //   ],
    //   paxChangeOfDay: null,     // Số khách riêng của ngày (null = dùng globalPax)
    //   priceBaseDistance: {      // Giá dựa trên khoảng cách
    //     distance: 0,            // Khoảng cách (km)
    //     priceDt: 0,            // Giá/km (tự động tính theo số khách)
    //   },
    //   dayTotalPrice: 0,        // Tổng giá dịch vụ + di chuyển của ngày
    //   dayAdditionalPrice: {    // Giá bổ sung của ngày
    //     value: 0,              // Số tiền bổ sung
    //     note: '',              // Ghi chú lý do bổ sung giá
    //   },
    //   dayFinalPrice: 0,        // Giá cuối của ngày = dayTotalPrice + dayAdditionalPrice.value
    //   dayNotes: [             // Ghi chú cho ngày
    //     {
    //       content: '',         // Nội dung ghi chú
    //       createdBy: '',      // Người tạo ghi chú
    //       createdAt: null      // Thời gian tạo ghi chú
    //     }
    //   ],
    //   '09:00': [               // Các dịch vụ theo giờ
    //     {
    //       id: '',              // ID dịch vụ
    //       name: '',            // Tên dịch vụ
    //       type: '',            // Loại dịch vụ: sightseeing, restaurant, transport...
    //       sentences: [         // Các câu mô tả dịch vụ
    //         // {
    //         //   id: '',       // ID câu mô tả
    //         //   content: '',  // Nội dung câu mô tả (VD: "Đi ăn nhà hàng tại {name}")
    //         // }
    //       ],
    //       serviceImages: [],   // Hình ảnh của dịch vụ [max 3]
    //       location: {          // Địa điểm dịch vụ
    //         id: '',            // ID địa điểm
    //         name: '',          // Tên địa điểm
    //         address: '',       // Địa chỉ
    //         coordinates: {     // Tọa độ
    //           lat: 0,
    //           lng: 0
    //         }
    //       },
    //       contactInfo: {       // Thông tin liên hệ
    //         name: '',          // Tên người liên hệ
    //         phone: '',         // Số điện thoại
    //         email: '',         // Email
    //         note: '',          // Ghi chú liên hệ
    //       },
    //       price: 0,            // Giá dịch vụ (có thể phụ thuộc vào pax)
    //       serviceNotes: [      // Ghi chú cho dịch vụ
    //         {
    //           content: '',     // Nội dung ghi chú
    //           createdBy: '',   // Người tạo ghi chú
    //           createdAt: null   // Thời gian tạo ghi chú
    //         }
    //       ]
    //     }
    //   ],
    // }
  },

  // UI State (Trạng thái giao diện)
  modalData: { isOpen: false, day: null, time: null, services: [] },
  expandedSlots: {},

  // 1. Schedule Basic Actions (Các hành động cơ bản của lịch trình)
  updateScheduleCode: (code) => {}, // Cập nhật mã lịch trình
  updateScheduleTitle: (title) => {}, // Cập nhật tên lịch trình
  updateScheduleDates: (startDate, endDate) => {}, // Cập nhật ngày bắt đầu/kết thúc
  updateScheduleVersion: (version) => {}, // Cập nhật phiên bản
  updateScheduleStatus: (newStatus) => {}, // Cập nhật trạng thái lịch trình
  updateScheduleImages: (images) => {}, // Cập nhật hình lịch trình
  updateScheduleNote: (note) => {}, // Cập nhật ghi chú lịch trình
  updateAdditionalPrice: (price, note) => {}, // Cập nhật giá bổ sung lịch trình

  // 2. Info Update Actions (Các hành động cập nhật thông tin)
  updateInternalInfo: (field, value) => {}, // Cập nhật thông tin nội bộ
  updateCustomerInfo: (field, value) => {}, // Cập nhật thông tin khách hàng

  // 3. Group Actions (Các hành động với thông tin đoàn)
  updateGuests: (guests) => {}, // Cập nhật danh sách khách
  updateGuestInfo: (guestId, field, value) => {}, // Cập nhật thông tin khách
  updateGuestPassport: (guestId, status, images) => {}, // Cập nhật thông tin passport
  updateGuestImages: (guestId, images) => {}, // Cập nhật hình ảnh khách

  // 4. Transport Actions (Các hành động với vận chuyển)
  updateScheduleTransport: (field, value) => {}, // Cập nhật thông tin vận chuyển chung
  updateDayTransport: (day, field, value) => {}, // Cập nhật thông tin vận chuyển ngày
  updateTransportVehicles: (vehicles) => {}, // Cập nhật danh sách phương tiện
  updateDayVehicles: (day, vehicles) => {}, // Cập nhật phương tiện của ngày
  updateDriverInfo: (day, vehicleIndex, driverInfo) => {}, // Cập nhật thông tin tài xế

  // 5. Day Actions (Các hành động với ngày)
  updateDayTitle: (day, title) => {}, // Cập nhật tiêu đề ngày
  updateDayImages: (day, images) => {}, // Cập nhật hình của ngày
  updateDayNote: (day, note) => {}, // Cập nhật ghi chú ngày
  updateDayAdditionalPrice: (day, price, note) => {}, // Cập nhật giá bổ sung ngày
  updateDayParagraph: (day, customParagraph) => {}, // Cập nhật đoạn văn tùy chỉnh
  getDayLocations: (day) => {}, // Lấy danh sách địa điểm trong ngày
  updateDayPax: (day, pax) => {}, // Cập nhật số khách cho ngày
  updateDistance: (day, distance) => {}, // Cập nhật khoảng cách

  // 6. Service Actions (Các hành động với dịch vụ)
  addService: (day, time, service) => {}, // Thêm dịch vụ
  removeService: (day, time, index) => {}, // Xóa dịch vụ
  reorderServices: (day, time, newOrder) => {}, // Sắp xếp dịch vụ
  updateServicePrice: (day, time, index, price) => {}, // Cập nhật giá dịch vụ
  updateServiceNote: (day, time, index, note) => {}, // Cập nhật ghi chú dịch vụ
  updateServiceSentence: (day, time, serviceIndex, sentenceId) => {}, // Chọn câu mô tả cho dịch vụ

  // 7. Settings Actions (Các hành động với cài đặt)
  updateGlobalPax: (newPax) => {}, // Cập nhật số khách mặc định
  updateNumberOfDays: (days) => {}, // Cập nhật số ngày

  // 8. UI Actions (Các hành động với giao diện)
  toggleTimeSlot: (time) => {}, // Mở/đóng time slot
  openModal: (day, time, services) => {}, // Mở modal
  closeModal: () => {}, // Đóng modal

  // 9. Export Actions (Các hành động xuất dữ liệu)
  exportDayData: (day) => {}, // Xuất dữ liệu ngày
  exportAllData: () => {}, // Xuất toàn bộ dữ liệu
  exportScheduleItems: () => {}, // Xuất dữ liệu scheduleItems
};

export const ScheduleContext = createContext(defaultScheduleContext);
export { defaultScheduleContext };
