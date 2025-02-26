import { v4 as uuidv4 } from 'uuid';
import { AccommodationType, ServiceType } from '../enums';
import { Service } from '../Service';

// Accommodation Service Class
export class AccommodationService extends Service {
  constructor({
    rating = 0,
    accommodationType = AccommodationType.HOTEL,
    rooms = {
      roomName: '',
      price: {
        fit_price: 0,
        git_price: 0,
        foc_price: 0,
        sup_price: 0,
      },
    },
    note = '',
    website = '',
    year = 2025,
    isFeatured = false,
    ...serviceData
  }) {
    super({
      id: `accommodation-${uuidv4()}`,
      type: ServiceType.ACCOMMODATION,
      ...serviceData,
    });

    this.accommodationType = accommodationType;
    this.rooms = rooms;
    this.rating = rating;
    this.isFeatured = isFeatured;
    this.note = note;
    this.website = website;
    this.year = year;
  }
}
