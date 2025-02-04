export const REGIONS = {
  north: 'Miền Bắc',
  central: 'Miền Trung',
  south: 'Miền Nam',
};

export const VIETNAM_LOCATIONS = [
  // Miền Bắc
  {
    id: 'hanoi',
    name: 'Hà Nội',
    region: 'north',
    coordinates: { lat: 21.028511, lng: 105.804817 },
  },
  {
    id: 'haiphong',
    name: 'Hải Phòng',
    region: 'north',
    coordinates: { lat: 20.844912, lng: 106.688084 },
  },
  {
    id: 'quangninh',
    name: 'Quảng Ninh',
    region: 'north',
    coordinates: { lat: 20.953848, lng: 107.084351 },
  },
  {
    id: 'bacninh',
    name: 'Bắc Ninh',
    region: 'north',
    coordinates: { lat: 21.186226, lng: 106.076019 },
  },
  {
    id: 'bacgiang',
    name: 'Bắc Giang',
    region: 'north',
    coordinates: { lat: 21.271442, lng: 106.194107 },
  },
  {
    id: 'vinhphuc',
    name: 'Vĩnh Phúc',
    region: 'north',
    coordinates: { lat: 21.30088, lng: 105.591894 },
  },
  {
    id: 'hanam',
    name: 'Hà Nam',
    region: 'north',
    coordinates: { lat: 20.583515, lng: 105.923413 },
  },
  {
    id: 'namdinh',
    name: 'Nam Định',
    region: 'north',
    coordinates: { lat: 20.428832, lng: 106.162919 },
  },
  {
    id: 'thaibinh',
    name: 'Thái Bình',
    region: 'north',
    coordinates: { lat: 20.446912, lng: 106.336296 },
  },
  {
    id: 'ninhbinh',
    name: 'Ninh Bình',
    region: 'north',
    coordinates: { lat: 20.250225, lng: 105.974731 },
  },
  {
    id: 'laocai',
    name: 'Lào Cai',
    region: 'north',
    coordinates: { lat: 22.485605, lng: 103.975239 },
  },
  {
    id: 'yenbai',
    name: 'Yên Bái',
    region: 'north',
    coordinates: { lat: 21.722666, lng: 104.907037 },
  },
  {
    id: 'dienbien',
    name: 'Điện Biên',
    region: 'north',
    coordinates: { lat: 21.385735, lng: 103.01783 },
  },
  {
    id: 'hoabinh',
    name: 'Hòa Bình',
    region: 'north',
    coordinates: { lat: 20.813927, lng: 105.338531 },
  },
  {
    id: 'laichau',
    name: 'Lai Châu',
    region: 'north',
    coordinates: { lat: 22.386374, lng: 103.491154 },
  },
  {
    id: 'sonla',
    name: 'Sơn La',
    region: 'north',
    coordinates: { lat: 21.327165, lng: 103.912308 },
  },
  {
    id: 'hagiang',
    name: 'Hà Giang',
    region: 'north',
    coordinates: { lat: 22.823752, lng: 104.983955 },
  },
  {
    id: 'tuyenquang',
    name: 'Tuyên Quang',
    region: 'north',
    coordinates: { lat: 21.82491, lng: 105.214571 },
  },
  {
    id: 'caobang',
    name: 'Cao Bằng',
    region: 'north',
    coordinates: { lat: 22.665418, lng: 106.25861 },
  },
  {
    id: 'backan',
    name: 'Bắc Kạn',
    region: 'north',
    coordinates: { lat: 22.147495, lng: 105.834917 },
  },
  {
    id: 'thainguyen',
    name: 'Thái Nguyên',
    region: 'north',
    coordinates: { lat: 21.592498, lng: 105.844833 },
  },
  {
    id: 'langson',
    name: 'Lạng Sơn',
    region: 'north',
    coordinates: { lat: 21.853733, lng: 106.761519 },
  },
  {
    id: 'phutho',
    name: 'Phú Thọ',
    region: 'north',
    coordinates: { lat: 21.322428, lng: 105.402237 },
  },
  {
    id: 'hungyen',
    name: 'Hưng Yên',
    region: 'north',
    coordinates: { lat: 20.646708, lng: 106.051519 },
  },

  // Miền Trung
  {
    id: 'thanhhoa',
    name: 'Thanh Hóa',
    region: 'central',
    coordinates: { lat: 19.806692, lng: 105.784818 },
  },
  {
    id: 'nghean',
    name: 'Nghệ An',
    region: 'central',
    coordinates: { lat: 18.679585, lng: 105.681335 },
  },
  {
    id: 'hatinh',
    name: 'Hà Tĩnh',
    region: 'central',
    coordinates: { lat: 18.340749, lng: 105.88797 },
  },
  {
    id: 'quangbinh',
    name: 'Quảng Bình',
    region: 'central',
    coordinates: { lat: 17.465185, lng: 106.622924 },
  },
  {
    id: 'quangtri',
    name: 'Quảng Trị',
    region: 'central',
    coordinates: { lat: 16.811979, lng: 107.100876 },
  },
  {
    id: 'hue',
    name: 'Huế',
    region: 'central',
    coordinates: { lat: 16.463713, lng: 107.584474 },
  },
  {
    id: 'danang',
    name: 'Đà Nẵng',
    region: 'central',
    coordinates: { lat: 16.054407, lng: 108.202164 },
  },
  {
    id: 'quangnam',
    name: 'Quảng Nam',
    region: 'central',
    coordinates: { lat: 15.537168, lng: 108.019546 },
  },
  {
    id: 'quangngai',
    name: 'Quảng Ngãi',
    region: 'central',
    coordinates: { lat: 15.12146, lng: 108.804207 },
  },
  {
    id: 'binhdinh',
    name: 'Bình Định',
    region: 'central',
    coordinates: { lat: 13.776372, lng: 109.223595 },
  },
  {
    id: 'phuyen',
    name: 'Phú Yên',
    region: 'central',
    coordinates: { lat: 13.088094, lng: 109.092644 },
  },
  {
    id: 'khanhhoa',
    name: 'Khánh Hòa',
    region: 'central',
    coordinates: { lat: 12.246871, lng: 109.196657 },
  },
  {
    id: 'ninhthuan',
    name: 'Ninh Thuận',
    region: 'central',
    coordinates: { lat: 11.574183, lng: 108.989708 },
  },
  {
    id: 'binhthuan',
    name: 'Bình Thuận',
    region: 'central',
    coordinates: { lat: 10.933465, lng: 108.102493 },
  },

  // Miền Nam
  {
    id: 'hochiminh',
    name: 'Hồ Chí Minh',
    region: 'south',
    coordinates: { lat: 10.762622, lng: 106.660172 },
  },
  {
    id: 'dongnai',
    name: 'Đồng Nai',
    region: 'south',
    coordinates: { lat: 10.943712, lng: 106.82438 },
  },
  {
    id: 'binhduong',
    name: 'Bình Dương',
    region: 'south',
    coordinates: { lat: 11.327438, lng: 106.477147 },
  },
  {
    id: 'vungtau',
    name: 'Bà Rịa - Vũng Tàu',
    region: 'south',
    coordinates: { lat: 10.346577, lng: 107.084351 },
  },
  {
    id: 'tayninh',
    name: 'Tây Ninh',
    region: 'south',
    coordinates: { lat: 11.310142, lng: 106.098366 },
  },
  {
    id: 'binhphuoc',
    name: 'Bình Phước',
    region: 'south',
    coordinates: { lat: 11.751145, lng: 106.723404 },
  },
  {
    id: 'longan',
    name: 'Long An',
    region: 'south',
    coordinates: { lat: 10.695572, lng: 106.243195 },
  },
  {
    id: 'tiengiang',
    name: 'Tiền Giang',
    region: 'south',
    coordinates: { lat: 10.449558, lng: 106.342475 },
  },
  {
    id: 'bentre',
    name: 'Bến Tre',
    region: 'south',
    coordinates: { lat: 10.243544, lng: 106.375557 },
  },
  {
    id: 'travinh',
    name: 'Trà Vinh',
    region: 'south',
    coordinates: { lat: 9.934929, lng: 106.342475 },
  },
  {
    id: 'vinhlong',
    name: 'Vĩnh Long',
    region: 'south',
    coordinates: { lat: 10.253971, lng: 105.972618 },
  },
  {
    id: 'dongthap',
    name: 'Đồng Tháp',
    region: 'south',
    coordinates: { lat: 10.493271, lng: 105.688259 },
  },
  {
    id: 'angiang',
    name: 'An Giang',
    region: 'south',
    coordinates: { lat: 10.386184, lng: 105.438257 },
  },
  {
    id: 'kiengiang',
    name: 'Kiên Giang',
    region: 'south',
    coordinates: { lat: 10.012813, lng: 105.076401 },
  },
  {
    id: 'cantho',
    name: 'Cần Thơ',
    region: 'south',
    coordinates: { lat: 10.045162, lng: 105.746857 },
  },
  {
    id: 'haugiang',
    name: 'Hậu Giang',
    region: 'south',
    coordinates: { lat: 9.757897, lng: 105.642029 },
  },
  {
    id: 'soctrang',
    name: 'Sóc Trăng',
    region: 'south',
    coordinates: { lat: 9.60318, lng: 105.973848 },
  },
  {
    id: 'baclieu',
    name: 'Bạc Liêu',
    region: 'south',
    coordinates: { lat: 9.294871, lng: 105.728595 },
  },
  {
    id: 'camau',
    name: 'Cà Mau',
    region: 'south',
    coordinates: { lat: 9.176232, lng: 105.150139 },
  },
];

// Helper function để group locations theo region
export const getLocationsByRegion = () => {
  return VIETNAM_LOCATIONS.reduce((acc, location) => {
    if (!acc[location.region]) {
      acc[location.region] = [];
    }
    acc[location.region].push(location);
    return acc;
  }, {});
};
