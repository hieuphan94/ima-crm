export const REGIONS = {
  north: 'Miền Bắc',
  central: 'Miền Trung',
  south: 'Miền Nam',
};

// HA NOI, DIEN BIEN PHU, HOA BINH, MAI CHAU, SON LA, NINH BINH, NAM DINH, VINH, QUANG BINH, MU CANG CHAI, NGHIA LO
// THAC BA, THAN UYEN, TAM DUONG, SAPA, BAC HA, HOANG SU PHI, HA GIANG, DONG VAN, MEO VAC, BAO LAC, CAO BANG, BA BE
// BAC KAN, HA LONG, CAT BA, HUE, HOI AN, DA NANG, HO CHI MINH, TAY NINH, BEN TRE, CHO LACH, TRA VINH, CAN THO, SOC TRANG
// SA DEC, LONG XUYEN, CHAU DOC, RACH GIA, HA TIEN, MY THO, CAI BE, VUNG TAU, PHAN THIET, DA LAT, QUY NHON, NHA TRANG
// BINH DUONG, KON TUM, PleiKu, BUON MA THUOT, DONG NAI, PHAN RANG

export const VIETNAM_LOCATIONS = [
  // Miền Bắc
  {
    id: 'hanoi',
    name: 'Hà Nội',
    region: 'north',
    coordinates: { lat: 21.028511, lng: 105.804817 },
  },
  {
    id: 'dienbienphu',
    name: 'Điện Biên Phủ',
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
    id: 'maichau',
    name: 'Mai Châu',
    region: 'north',
    coordinates: { lat: 20.683333, lng: 104.995833 },
  },
  {
    id: 'sonla',
    name: 'Sơn La',
    region: 'north',
    coordinates: { lat: 21.327165, lng: 103.912308 },
  },
  {
    id: 'ninhbinh',
    name: 'Ninh Bình',
    region: 'north',
    coordinates: { lat: 20.250225, lng: 105.974731 },
  },
  {
    id: 'namdinh',
    name: 'Nam Định',
    region: 'north',
    coordinates: { lat: 20.428832, lng: 106.162919 },
  },
  {
    id: 'mucangchai',
    name: 'Mù Cang Chải',
    region: 'north',
    coordinates: { lat: 21.851389, lng: 104.150833 },
  },
  {
    id: 'nghialo',
    name: 'Nghĩa Lộ',
    region: 'north',
    coordinates: { lat: 21.595833, lng: 104.493056 },
  },
  {
    id: 'thacba',
    name: 'Thác Bà',
    region: 'north',
    coordinates: { lat: 21.977222, lng: 104.773333 },
  },
  {
    id: 'thanuyen',
    name: 'Than Uyên',
    region: 'north',
    coordinates: { lat: 21.994722, lng: 103.891667 },
  },
  {
    id: 'tamduong',
    name: 'Tam Đường',
    region: 'north',
    coordinates: { lat: 22.333333, lng: 103.533333 },
  },
  {
    id: 'sapa',
    name: 'Sa Pa',
    region: 'north',
    coordinates: { lat: 22.336389, lng: 103.844167 },
  },
  {
    id: 'bacha',
    name: 'Bắc Hà',
    region: 'north',
    coordinates: { lat: 22.537778, lng: 104.290833 },
  },
  {
    id: 'hoangsuphi',
    name: 'Hoàng Su Phì',
    region: 'north',
    coordinates: { lat: 22.741667, lng: 104.678889 },
  },
  {
    id: 'hagiang',
    name: 'Hà Giang',
    region: 'north',
    coordinates: { lat: 22.823752, lng: 104.983955 },
  },
  {
    id: 'dongvan',
    name: 'Đồng Văn',
    region: 'north',
    coordinates: { lat: 23.272778, lng: 105.363056 },
  },
  {
    id: 'meovac',
    name: 'Mèo Vạc',
    region: 'north',
    coordinates: { lat: 23.156944, lng: 105.441944 },
  },
  {
    id: 'baolac',
    name: 'Bảo Lạc',
    region: 'north',
    coordinates: { lat: 22.948611, lng: 105.677222 },
  },
  {
    id: 'caobang',
    name: 'Cao Bằng',
    region: 'north',
    coordinates: { lat: 22.665418, lng: 106.25861 },
  },
  {
    id: 'babe',
    name: 'Ba Bể',
    region: 'north',
    coordinates: { lat: 22.395833, lng: 105.618056 },
  },
  {
    id: 'backan',
    name: 'Bắc Kạn',
    region: 'north',
    coordinates: { lat: 22.147495, lng: 105.834917 },
  },
  {
    id: 'halong',
    name: 'Hạ Long',
    region: 'north',
    coordinates: { lat: 20.959444, lng: 107.042778 },
  },
  {
    id: 'catba',
    name: 'Cát Bà',
    region: 'north',
    coordinates: { lat: 20.726111, lng: 107.048333 },
  },

  // Miền Trung
  {
    id: 'vinh',
    name: 'Vinh',
    region: 'central',
    coordinates: { lat: 18.679585, lng: 105.681335 },
  },
  {
    id: 'quangbinh',
    name: 'Quảng Bình',
    region: 'central',
    coordinates: { lat: 17.465185, lng: 106.622924 },
  },
  {
    id: 'hue',
    name: 'Huế',
    region: 'central',
    coordinates: { lat: 16.463713, lng: 107.584474 },
  },
  {
    id: 'hoian',
    name: 'Hội An',
    region: 'central',
    coordinates: { lat: 15.880556, lng: 108.338333 },
  },
  {
    id: 'danang',
    name: 'Đà Nẵng',
    region: 'central',
    coordinates: { lat: 16.054407, lng: 108.202164 },
  },
  {
    id: 'quynhon',
    name: 'Quy Nhơn',
    region: 'central',
    coordinates: { lat: 13.775389, lng: 109.223889 },
  },
  {
    id: 'nhatrang',
    name: 'Nha Trang',
    region: 'central',
    coordinates: { lat: 12.238791, lng: 109.196749 },
  },
  {
    id: 'dalat',
    name: 'Đà Lạt',
    region: 'central',
    coordinates: { lat: 11.940419, lng: 108.458313 },
  },
  {
    id: 'kontum',
    name: 'Kon Tum',
    region: 'central',
    coordinates: { lat: 14.354167, lng: 108.017778 },
  },
  {
    id: 'pleiku',
    name: 'Pleiku',
    region: 'central',
    coordinates: { lat: 13.983333, lng: 108.0 },
  },
  {
    id: 'buonmathuot',
    name: 'Buôn Ma Thuột',
    region: 'central',
    coordinates: { lat: 12.666667, lng: 108.05 },
  },
  {
    id: 'phanthiet',
    name: 'Phan Thiết',
    region: 'central',
    coordinates: { lat: 10.933465, lng: 108.102493 },
  },
  {
    id: 'phanrang',
    name: 'Phan Rang',
    region: 'central',
    coordinates: { lat: 11.567778, lng: 108.990833 },
  },

  // Miền Nam
  {
    id: 'hochiminh',
    name: 'Hồ Chí Minh',
    region: 'south',
    coordinates: { lat: 10.762622, lng: 106.660172 },
  },
  {
    id: 'tayninh',
    name: 'Tây Ninh',
    region: 'south',
    coordinates: { lat: 11.310142, lng: 106.098366 },
  },
  {
    id: 'bentre',
    name: 'Bến Tre',
    region: 'south',
    coordinates: { lat: 10.243544, lng: 106.375557 },
  },
  {
    id: 'cholach',
    name: 'Chợ Lách',
    region: 'south',
    coordinates: { lat: 10.221667, lng: 106.155556 },
  },
  {
    id: 'travinh',
    name: 'Trà Vinh',
    region: 'south',
    coordinates: { lat: 9.934929, lng: 106.342475 },
  },
  {
    id: 'cantho',
    name: 'Cần Thơ',
    region: 'south',
    coordinates: { lat: 10.045162, lng: 105.746857 },
  },
  {
    id: 'soctrang',
    name: 'Sóc Trăng',
    region: 'south',
    coordinates: { lat: 9.60318, lng: 105.973848 },
  },
  {
    id: 'sadec',
    name: 'Sa Đéc',
    region: 'south',
    coordinates: { lat: 10.290556, lng: 105.754722 },
  },
  {
    id: 'longxuyen',
    name: 'Long Xuyên',
    region: 'south',
    coordinates: { lat: 10.386184, lng: 105.438257 },
  },
  {
    id: 'chaudoc',
    name: 'Châu Đốc',
    region: 'south',
    coordinates: { lat: 10.706389, lng: 105.117778 },
  },
  {
    id: 'rachgia',
    name: 'Rạch Giá',
    region: 'south',
    coordinates: { lat: 10.012813, lng: 105.076401 },
  },
  {
    id: 'hatien',
    name: 'Hà Tiên',
    region: 'south',
    coordinates: { lat: 10.383333, lng: 104.483333 },
  },
  {
    id: 'mytho',
    name: 'Mỹ Tho',
    region: 'south',
    coordinates: { lat: 10.360238, lng: 106.363181 },
  },
  {
    id: 'caibe',
    name: 'Cái Bè',
    region: 'south',
    coordinates: { lat: 10.406667, lng: 105.933333 },
  },
  {
    id: 'vungtau',
    name: 'Vũng Tàu',
    region: 'south',
    coordinates: { lat: 10.346577, lng: 107.084351 },
  },
  {
    id: 'binhduong',
    name: 'Bình Dương',
    region: 'south',
    coordinates: { lat: 11.327438, lng: 106.477147 },
  },
  {
    id: 'dongnai',
    name: 'Đồng Nai',
    region: 'south',
    coordinates: { lat: 10.943712, lng: 106.82438 },
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
