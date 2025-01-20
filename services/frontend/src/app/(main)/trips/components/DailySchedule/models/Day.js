class Day {
  constructor(data = {}) {
    // Basic properties
    this.titleOfDay = data.titleOfDay || '';
    this.dayImages = data.dayImages || [];
    this.dayParagraph = data.dayParagraph || '';
    this.customParagraph = data.customParagraph || '';
    this.locations = data.locations || [];

    // Pax and Price properties
    this.globalPax = data.globalPax ?? null;
    this.paxChangeOfDay = data.paxChangeOfDay || null;
    this.priceBaseDistance = {
      distance: data.priceBaseDistance?.distance || 0,
      priceDt: data.priceBaseDistance?.priceDt || 0,
    };
    this.dayTotalPrice = data.dayTotalPrice || 0;
    this.dayAdditionalPrice = {
      value: data.dayAdditionalPrice?.value || 0,
      note: data.dayAdditionalPrice?.note || '',
    };
    this.dayFinalPrice = data.dayFinalPrice || 0;

    // Notes
    this.dayNotes = data.dayNotes || [];

    // Time slots for services
    this.timeSlots = {};
    if (data) {
      Object.keys(data).forEach((key) => {
        if (this.isTimeSlot(key)) {
          this.timeSlots[key] = [...(data[key] || [])];
        }
      });
    }
  }

  // Helper methods
  isTimeSlot(key) {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(key);
  }

  // Getters
  getTimeSlot(time) {
    return this.timeSlots[time] || [];
  }

  getAllTimeSlots() {
    return this.timeSlots;
  }

  // Service management
  addService(time, service) {
    if (!this.timeSlots[time]) {
      this.timeSlots[time] = [];
    }
    if (!this.timeSlots[time].some((s) => s.id === service.id)) {
      this.timeSlots[time].push(service);
      this.updateLocations();
      return true;
    }
    return false;
  }

  removeService(time, index) {
    if (!this.timeSlots[time]) return false;
    this.timeSlots[time].splice(index, 1);
    if (this.timeSlots[time].length === 0) {
      delete this.timeSlots[time];
    }
    this.updateLocations();
    return true;
  }

  reorderServices(time, newServices) {
    if (!this.timeSlots[time]) return false;
    if (JSON.stringify(this.timeSlots[time]) === JSON.stringify(newServices)) {
      return false;
    }
    this.timeSlots[time] = newServices;
    this.updateLocations();
    return true;
  }

  // Day management
  updateTitle(title) {
    this.titleOfDay = title;
  }

  updateImages(images) {
    this.dayImages = images;
  }

  updateParagraph(customParagraph) {
    this.customParagraph = customParagraph;
  }

  updatePax(newPax) {
    this.paxChangeOfDay = newPax;
  }

  // Price management
  updatePriceBaseDistance(distance, priceDt) {
    this.priceBaseDistance = {
      distance: distance || 0,
      priceDt: priceDt || 0,
    };
    this.updateDayTotalPrice();
  }

  updateAdditionalPrice(value, note) {
    this.dayAdditionalPrice = { value, note };
    this.updateDayFinalPrice();
  }

  // Notes management
  addNote(content, createdBy) {
    this.dayNotes.push({
      content,
      createdBy,
      createdAt: new Date().toISOString(),
    });
  }

  // Private methods (using # for truly private)
  #updateLocations() {
    const locations = new Set();
    Object.entries(this.timeSlots).forEach(([time, services]) => {
      services.forEach((service) => {
        if (service.location) {
          locations.add({
            ...service.location,
            time,
          });
        }
      });
    });
    this.locations = Array.from(locations);
  }

  #updateDayTotalPrice() {
    let total = 0;
    // Add service prices
    Object.values(this.timeSlots).forEach((services) => {
      services.forEach((service) => {
        total += service.price || 0;
      });
    });
    // Add distance-based price
    total += this.priceBaseDistance.distance * this.priceBaseDistance.priceDt;
    this.dayTotalPrice = total;
    this.#updateDayFinalPrice();
  }

  #updateDayFinalPrice() {
    this.dayFinalPrice = this.dayTotalPrice + (this.dayAdditionalPrice.value || 0);
  }

  // Serialization
  toJSON() {
    return {
      titleOfDay: this.titleOfDay,
      dayImages: this.dayImages,
      dayParagraph: this.dayParagraph,
      customParagraph: this.customParagraph,
      locations: this.locations,
      globalPax: this.globalPax,
      paxChangeOfDay: this.paxChangeOfDay,
      priceBaseDistance: this.priceBaseDistance,
      dayTotalPrice: this.dayTotalPrice,
      dayAdditionalPrice: this.dayAdditionalPrice,
      dayFinalPrice: this.dayFinalPrice,
      dayNotes: this.dayNotes,
      ...this.timeSlots,
    };
  }

  // Static factory method
  static fromJSON(data) {
    return new Day(data);
  }
}

export default Day;
