import { v4 as uuidv4 } from 'uuid';
import { Country, Region } from './enums';

// Base Location Model
export class Location {
  constructor({
    id = `location-${uuidv4()}`,
    name = '',
    country = Country.VIETNAM,
    region = Region.NORTH,
    description = '',
    coordinates = null, // { lat: number, lng: number }
    images = [], // Array of image URLs
    highlights = [], // Array of location highlights
    bestTimeToVisit = [], // Array of months or seasons
    climate = {}, // Climate information
    tags = [], // Array of tags for categorization
  }) {
    this.id = id;
    this.name = name;
    this.country = country;
    this.region = region;
    this.description = description;
    this.coordinates = coordinates;
    this.images = images;
    this.highlights = highlights;
    this.bestTimeToVisit = bestTimeToVisit;
    this.climate = climate;
    this.tags = tags;
  }

  // Helper method để kiểm tra xem location có nằm ở miền Bắc không
  isNorthern() {
    return this.region === Region.NORTH;
  }

  // Helper method để kiểm tra xem location có nằm ở Việt Nam không
  isInVietnam() {
    return this.country === Country.VIETNAM;
  }

  // Helper method để lấy tọa độ dạng string
  getCoordinatesString() {
    if (!this.coordinates) return '';
    return `${this.coordinates.lat},${this.coordinates.lng}`;
  }

  // Helper method để lấy URL Google Maps
  getGoogleMapsUrl() {
    if (!this.coordinates) return '';
    return `https://www.google.com/maps?q=${this.getCoordinatesString()}`;
  }
}

// Specific Location Types (nếu cần)
export class City extends Location {
  constructor(data) {
    super(data);
    this.population = data.population;
    this.districts = data.districts || [];
    this.airports = data.airports || [];
    this.isCapital = data.isCapital || false;
  }
}

export class Province extends Location {
  constructor(data) {
    super(data);
    this.capital = data.capital;
    this.cities = data.cities || [];
    this.area = data.area;
    this.population = data.population;
  }
}

export class TouristSpot extends Location {
  constructor(data) {
    super(data);
    this.type = data.type; // 'beach', 'mountain', 'historical', etc.
    this.entranceFee = data.entranceFee;
    this.openingHours = data.openingHours;
    this.facilities = data.facilities || [];
    this.activities = data.activities || [];
    this.nearbyAccommodations = data.nearbyAccommodations || [];
  }
}

// Sample usage:
/*
const hanoi = new City({
  id: 'hanoi',
  name: 'Hà Nội',
  country: Country.VIETNAM,
  region: Region.NORTH,
  description: 'Thủ đô ngàn năm văn hiến',
  coordinates: { lat: 21.0285, lng: 105.8542 },
  population: 8000000,
  isCapital: true,
  airports: ['Nội Bài International Airport'],
  districts: ['Hoàn Kiếm', 'Ba Đình', 'Đống Đa'],
  highlights: [
    'Phố cổ Hà Nội',
    'Hồ Hoàn Kiếm',
    'Văn Miếu - Quốc Tử Giám'
  ],
  bestTimeToVisit: ['October', 'November', 'March', 'April'],
  climate: {
    summer: { temp: '32-38°C', humidity: 'High' },
    winter: { temp: '15-20°C', humidity: 'Medium' }
  },
  tags: ['capital', 'culture', 'history', 'food']
});

const halongBay = new TouristSpot({
  id: 'halong-bay',
  name: 'Vịnh Hạ Long',
  country: Country.VIETNAM,
  region: Region.NORTH,
  description: 'Di sản thiên nhiên thế giới UNESCO',
  coordinates: { lat: 20.9101, lng: 107.1839 },
  type: 'natural',
  entranceFee: {
    adult: 250000,
    child: 120000,
    currency: 'VND'
  },
  activities: ['Kayaking', 'Cave Exploring', 'Swimming'],
  facilities: ['Parking', 'Restrooms', 'Restaurants'],
  highlights: [
    'Hang Sửng Sốt',
    'Đảo Ti Tốp',
    'Hang Đầu Gỗ'
  ],
  bestTimeToVisit: ['March', 'April', 'October', 'November'],
  climate: {
    summer: { temp: '28-32°C', humidity: 'High' },
    winter: { temp: '15-20°C', humidity: 'Medium' }
  },
  tags: ['unesco', 'nature', 'cruise', 'island']
});
*/
