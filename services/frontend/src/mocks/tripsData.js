export const MOCK_TRIPS = [
  {
    id: 1,
    title: 'Ha Long Bay Explorer',
    tourCode: 'HL001',
    destination: 'Ha Long Bay, Vietnam',
    duration: '3 days',
    capacity: '20 people',
    startDate: '2024-04-01',
    status: 'confirmed',
    estimatedCost: '15000000',
    finalCost: '14500000',
    operator: 'Nguyen Van A',
    accountant: 'Tran Thi B',
    documents: {
      customerPDF: true,
      operatorPDF: true,
      accountingPDF: false,
    },
  },
  {
    id: 2,
    title: 'Sapa Trekking Adventure',
    tourCode: 'SP002',
    destination: 'Sapa, Vietnam',
    duration: '4 days',
    capacity: '15 people',
    startDate: '2024-04-15',
    status: 'operating',
    estimatedCost: '12000000',
    finalCost: null,
    operator: 'Le Van C',
    accountant: null,
    documents: {
      customerPDF: true,
      operatorPDF: true,
      accountingPDF: false,
    },
  },
  {
    id: 3,
    title: 'Hoi An Cultural Tour',
    tourCode: null,
    destination: 'Hoi An, Vietnam',
    duration: '2 days',
    capacity: '25 people',
    startDate: '2024-05-01',
    status: 'draft',
    estimatedCost: '8000000',
    finalCost: null,
    operator: null,
    accountant: null,
    documents: {
      customerPDF: false,
      operatorPDF: false,
      accountingPDF: false,
    },
  },
  {
    id: 4,
    title: 'Mekong Delta Experience',
    tourCode: 'MK003',
    destination: 'Mekong Delta, Vietnam',
    duration: '3 days',
    capacity: '18 people',
    startDate: '2024-04-20',
    status: 'booking',
    estimatedCost: '9500000',
    finalCost: null,
    operator: 'Pham Thi D',
    accountant: 'Nguyen Van E',
    documents: {
      customerPDF: true,
      operatorPDF: true,
      accountingPDF: false,
    },
  },
  {
    id: 5,
    title: 'Hanoi City Discovery',
    tourCode: 'HN004',
    destination: 'Hanoi, Vietnam',
    duration: '1 day',
    capacity: '30 people',
    startDate: '2024-04-10',
    status: 'completed',
    estimatedCost: '5000000',
    finalCost: '4800000',
    operator: 'Tran Van F',
    accountant: 'Le Thi G',
    documents: {
      customerPDF: true,
      operatorPDF: true,
      accountingPDF: true,
    },
  },
  {
    id: 6,
    title: 'Phu Quoc Beach Retreat',
    tourCode: null,
    destination: 'Phu Quoc, Vietnam',
    duration: '5 days',
    capacity: '22 people',
    startDate: '2024-05-15',
    status: 'pending_customer',
    estimatedCost: '25000000',
    finalCost: null,
    operator: null,
    accountant: null,
    documents: {
      customerPDF: true,
      operatorPDF: false,
      accountingPDF: false,
    },
  },
  {
    id: 7,
    title: 'Nha Trang Diving Tour',
    tourCode: 'NT005',
    destination: 'Nha Trang, Vietnam',
    duration: '4 days',
    capacity: '12 people',
    startDate: '2024-06-01',
    status: 'processing',
    estimatedCost: '18000000',
    finalCost: '17500000',
    operator: 'Nguyen Van H',
    accountant: 'Pham Thi I',
    documents: {
      customerPDF: true,
      operatorPDF: true,
      accountingPDF: true,
    },
  },
  {
    id: 8,
    title: 'Da Lat Adventure',
    tourCode: 'DL006',
    destination: 'Da Lat, Vietnam',
    duration: '3 days',
    capacity: '20 people',
    startDate: '2024-05-20',
    status: 'booked',
    estimatedCost: '13000000',
    finalCost: null,
    operator: 'Le Van J',
    accountant: 'Tran Thi K',
    documents: {
      customerPDF: true,
      operatorPDF: true,
      accountingPDF: false,
    },
  },
  {
    id: 9,
    title: 'Hue Imperial City Tour',
    tourCode: 'HUE007',
    destination: 'Hue, Vietnam',
    duration: '2 days',
    capacity: '25 people',
    startDate: '2024-06-15',
    status: 'archived',
    estimatedCost: '9000000',
    finalCost: '8800000',
    operator: 'Pham Van L',
    accountant: 'Nguyen Thi M',
    documents: {
      customerPDF: true,
      operatorPDF: true,
      accountingPDF: true,
    },
  },
];

// Constants for trip statuses
export const TRIP_STATUS = {
  // Sales statuses
  DRAFT: 'draft', // Sales đang tạo
  PENDING_CUSTOMER: 'pending_customer', // Đang chờ khách duyệt
  CONFIRMED: 'confirmed', // Khách đã chốt, có mã đoàn

  // Operator statuses
  OPERATING: 'operating', // Tour Operator đang xử lý
  BOOKING: 'booking', // Đang book dịch vụ
  BOOKED: 'booked', // Đã book xong dịch vụ

  // Accountant statuses
  PROCESSING: 'processing', // Kế toán đang xử lý
  COMPLETED: 'completed', // Hoàn thành tour
  ARCHIVED: 'archived', // Lưu trữ
};

// Helper functions for status display
export const getStatusBadgeClasses = (status) => {
  const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';

  switch (status) {
    // Sales statuses
    case TRIP_STATUS.DRAFT:
      return `${baseClasses} bg-gray-100 text-gray-700`;
    case TRIP_STATUS.PENDING_CUSTOMER:
      return `${baseClasses} bg-yellow-100 text-yellow-700`;
    case TRIP_STATUS.CONFIRMED:
      return `${baseClasses} bg-green-100 text-green-700`;

    // Operator statuses
    case TRIP_STATUS.OPERATING:
      return `${baseClasses} bg-blue-100 text-blue-700`;
    case TRIP_STATUS.BOOKING:
      return `${baseClasses} bg-indigo-100 text-indigo-700`;
    case TRIP_STATUS.BOOKED:
      return `${baseClasses} bg-purple-100 text-purple-700`;

    // Accountant statuses
    case TRIP_STATUS.PROCESSING:
      return `${baseClasses} bg-orange-100 text-orange-700`;
    case TRIP_STATUS.COMPLETED:
      return `${baseClasses} bg-teal-100 text-teal-700`;
    case TRIP_STATUS.ARCHIVED:
      return `${baseClasses} bg-gray-100 text-gray-700`;

    default:
      return `${baseClasses} bg-gray-100 text-gray-700`;
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    // Sales statuses
    case TRIP_STATUS.DRAFT:
      return 'Bản nháp';
    case TRIP_STATUS.PENDING_CUSTOMER:
      return 'Chờ khách duyệt';
    case TRIP_STATUS.CONFIRMED:
      return 'Đã xác nhận';

    // Operator statuses
    case TRIP_STATUS.OPERATING:
      return 'Đang xử lý';
    case TRIP_STATUS.BOOKING:
      return 'Đang book';
    case TRIP_STATUS.BOOKED:
      return 'Đã book xong';

    // Accountant statuses
    case TRIP_STATUS.PROCESSING:
      return 'Đang thanh toán';
    case TRIP_STATUS.COMPLETED:
      return 'Hoàn thành';
    case TRIP_STATUS.ARCHIVED:
      return 'Đã lưu trữ';

    default:
      return status;
  }
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};
