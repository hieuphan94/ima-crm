import { v4 as uuidv4 } from 'uuid';
import {
  AccommodationType,
  RoomTypesByAccommodation,
  ServiceLevel,
  ServiceStatus,
  ServiceType,
} from '../enums';
import { Service } from '../Service';

// Room Class for Accommodation
export class Room {
  constructor({
    id = `room-${uuidv4()}`, // Generate ID
    type = 'Standard', // Default room type
    name = '',
    description = '',
    capacity = 2, // Default 2 người
    quantity = 1, // Default 1 phòng
    price = 0,
    quotedPrice = 0,
    actualPrice = null, // Null vì chỉ có ở actual
    images = [],
    amenities = [],
    bedConfig = ['1 Double'], // Default là 1 giường đôi
    size = 0, // Default 0 m2
    view = 'City', // Default là City view
    isAvailable = true,
  }) {
    // Validation
    if (capacity <= 0) {
      throw new Error('Room capacity must be greater than 0');
    }
    if (quantity <= 0) {
      throw new Error('Room quantity must be greater than 0');
    }
    if (price < 0) {
      throw new Error('Room price cannot be negative');
    }

    this.id = id;
    this.type = type;
    this.name = name;
    this.description = description;
    this.capacity = capacity;
    this.quantity = quantity;
    this.price = price;
    this.quotedPrice = quotedPrice;
    this.actualPrice = actualPrice;
    this.images = images;
    this.amenities = amenities;
    this.bedConfig = bedConfig;
    this.size = size;
    this.view = view;
    this.isAvailable = isAvailable;
  }

  calculateTotal(quantity) {
    return this.price * quantity;
  }

  getProfit() {
    if (this.actualPrice) {
      return this.quotedPrice - this.actualPrice;
    }
    return 0;
  }
}

// Accommodation Service Class
export class AccommodationService extends Service {
  constructor({
    id = `accommodation-${uuidv4()}`, // Generate ID
    name = '',
    icon = null,
    supplier = null, // Null vì chỉ có ở actual
    type = ServiceType.ACCOMMODATION,
    locations = [],
    address = '',
    sentence = '',
    images = [],
    description = '',
    tags = [],
    accommodationType = AccommodationType.HOTEL, // Default là HOTEL
    rooms = [], // Empty array
    checkIn = '14:00', // Default check-in time
    checkOut = '12:00', // Default check-out time
    amenities = [],
    policies = {},
    rating = 0,
    isFeatured = false,
    priceRange = { min: 0, max: 0 },
    cancellationPolicy = '',
    additionalServices = [], // spa, restaurant, etc.
    serviceLevel = ServiceLevel.TEMPLATE, // Default là TEMPLATE
    templateId = null, // Null vì chỉ có ở actual
    quotedPrice = 0,
    actualPrice = null, // Null vì chỉ có ở actual
    serviceStatus = ServiceStatus.ACTIVE, // Default là ACTIVE
  }) {
    // Validation for check-in/check-out
    if (!checkIn || !checkOut) {
      throw new Error('Check-in and check-out times are required');
    }

    super({
      id,
      name,
      icon,
      price: 0, // Price sẽ được update từ rooms
      supplier,
      type,
      locations,
      address,
      sentence,
      images,
      description,
      tags,
      serviceLevel,
      templateId,
      quotedPrice,
      actualPrice,
      serviceStatus,
    });

    this.accommodationType = accommodationType;
    // Validate and create rooms
    this.rooms = rooms.map((room) => {
      if (!this.isValidRoomType(room.type)) {
        throw new Error(`Invalid room type "${room.type}" for ${this.accommodationType}`);
      }
      return new Room(room);
    });
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.amenities = amenities;
    this.policies = policies;
    this.rating = rating;
    this.isFeatured = isFeatured;
    this.priceRange = this._calculatePriceRange();
    this.cancellationPolicy = cancellationPolicy;
    this.additionalServices = additionalServices;
  }

  isValidRoomType(roomType) {
    return RoomTypesByAccommodation[this.accommodationType].includes(roomType);
  }

  _calculatePriceRange() {
    if (!this.rooms.length) return { min: 0, max: 0 };
    const prices = this.rooms.map((room) => room.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }

  getRoomPriceRange(roomType) {
    const rooms = this.getRoomsByType(roomType);
    if (!rooms.length) return { min: 0, max: 0 };
    const prices = rooms.map((room) => room.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }

  getAvailableRooms() {
    return this.rooms.filter((room) => room.isAvailable);
  }

  getRoomsByType(type) {
    return this.rooms.filter((room) => room.type === type);
  }

  calculateTotal(selectedRooms) {
    return selectedRooms.reduce((total, selection) => {
      const room = this.rooms.find((r) => r.id === selection.roomId);
      return total + (room ? room.calculateTotal(selection.quantity) : 0);
    }, 0);
  }

  checkAvailability(roomId, quantity) {
    const room = this.rooms.find((r) => r.id === roomId);
    return room && room.isAvailable && room.quantity >= quantity;
  }

  checkRoomAvailabilityByDate(roomId, startDate, endDate, quantity) {
    const room = this.rooms.find((r) => r.id === roomId);
    if (!room) return false;

    // Thêm logic kiểm tra booking trong khoảng thời gian
    return room.isAvailable && room.quantity >= quantity;
  }

  updateRoomAvailability(roomId, isAvailable, quantity) {
    const room = this.rooms.find((r) => r.id === roomId);
    if (room) {
      room.isAvailable = isAvailable;
      room.quantity = quantity;
    }
  }
}
