import { v4 as uuidv4 } from 'uuid';
import { Location } from './Location';
import { ServiceLevel, ServiceStatus, ServiceType } from './enums';

// Base Service Model
export class Service {
  constructor({
    id = `service-${uuidv4()}`,
    name = '',
    icon = null,
    price = 0,
    quotedPrice = 0, // Giá sales báo
    actualPrice = null, // Giá thực tế (optional)
    supplier = null,
    type = ServiceType.FOOD,
    serviceLevel = ServiceLevel.TEMPLATE, // Mặc định là TEMPLATE
    templateId = null, // ID của template service (chỉ có ở ACTUAL)
    locations = [],
    address,
    sentence,
    images = [],
    description = '',
    tags = [],
    serviceStatus = ServiceStatus.ACTIVE, // Default là ACTIVE
  }) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.price = price;
    this.quotedPrice = quotedPrice;
    this.actualPrice = actualPrice;
    this.supplier = supplier;
    this.type = type;
    this.serviceLevel = serviceLevel;
    this.templateId = templateId;
    this.locations = this._processLocations(locations);
    this.address = address;
    this.sentence = sentence;
    this.images = images;
    this.description = description;
    this.tags = tags;
    this.serviceStatus = serviceStatus;
  }

  _processLocations(locations) {
    return locations.map((location) => {
      if (location instanceof Location) {
        return location;
      }
      // Nếu location là ID, có thể tạo mới Location object hoặc giữ nguyên ID
      return location;
    });
  }

  addLocation(location) {
    if (!this.locations.includes(location)) {
      this.locations.push(location);
    }
  }

  removeLocation(locationId) {
    this.locations = this.locations.filter((loc) =>
      loc instanceof Location ? loc.id !== locationId : loc !== locationId
    );
  }

  hasLocation(locationId) {
    return this.locations.some((loc) =>
      loc instanceof Location ? loc.id === locationId : loc === locationId
    );
  }

  isInVietnam() {
    return this.locations.some((loc) => loc instanceof Location && loc.isInVietnam());
  }

  isInNorth() {
    return this.locations.some((loc) => loc instanceof Location && loc.isNorthern());
  }

  isTemplate() {
    return this.serviceLevel === ServiceLevel.TEMPLATE;
  }

  isActual() {
    return this.serviceLevel === ServiceLevel.ACTUAL;
  }

  getProfit() {
    if (this.isActual() && this.actualPrice) {
      return this.quotedPrice - this.actualPrice;
    }
    return 0;
  }

  // Helper methods
  isActiveService() {
    return this.serviceStatus === ServiceStatus.ACTIVE;
  }

  isInactiveService() {
    return this.serviceStatus === ServiceStatus.INACTIVE;
  }

  isDiscontinuedService() {
    return this.serviceStatus === ServiceStatus.DISCONTINUED;
  }
}

// Specific Service Type Models
export class VisitService extends Service {
  constructor({
    id = `visit-${uuidv4()}`,
    duration = 0,
    ticketInfo = {},
    openingHours = {},
    highlights = [],
    ...data
  }) {
    super({ ...data, type: ServiceType.VISIT });
    this.duration = duration;
    this.ticketInfo = ticketInfo;
    this.openingHours = openingHours;
    this.highlights = highlights;
  }
}

export class TransportService extends Service {
  constructor({
    id = `transport-${uuidv4()}`,
    vehicleType = '',
    capacity = 0,
    features = [],
    pickupLocation = '',
    dropoffLocation = '',
    routeType = '',
    distance = 0,
    duration = 0,
    ...data
  }) {
    super({ ...data, type: ServiceType.TRANSPORT });
    this.vehicleType = vehicleType;
    this.capacity = capacity;
    this.features = features;
    this.pickupLocation = pickupLocation;
    this.dropoffLocation = dropoffLocation;
    this.routeType = routeType;
    this.distance = distance;
    this.duration = duration;
  }

  calculatePriceByDistance(distance) {
    return this.price * distance;
  }
}

export class ActivityService extends Service {
  constructor({
    id = `activity-${uuidv4()}`,
    duration = 0,
    difficulty = 'easy',
    included = [],
    requirements = [],
    ...data
  }) {
    super({ ...data, type: ServiceType.ACTIVITY });
    this.duration = duration;
    this.difficulty = difficulty;
    this.included = included;
    this.requirements = requirements;
  }
}

export class GuideService extends Service {
  constructor({
    id = `guide-${uuidv4()}`,
    languages = [],
    specialties = [],
    experience = 0,
    certificates = [],
    ...data
  }) {
    super({ ...data, type: ServiceType.GUIDE });
    this.languages = languages;
    this.specialties = specialties;
    this.experience = experience;
    this.certificates = certificates;
  }
}

// // Export specialized services
// export { AccommodationService } from './services/AccommodationService';
// export { FoodService } from './services/FoodService';
