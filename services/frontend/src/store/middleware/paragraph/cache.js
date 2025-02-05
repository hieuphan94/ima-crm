// src/store/middleware/paragraph/cache.js
class ParagraphCache {
  constructor() {
    this.cache = new Map();
    this.maxAge = 5 * 60 * 1000; // 5 minutes
  }

  getKey(dayId, services) {
    const servicesHash = JSON.stringify(services);
    return `${dayId}_${servicesHash}`;
  }

  get(dayId, services) {
    const key = this.getKey(dayId, services);
    const cached = this.cache.get(key);

    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() - cached.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }

  set(dayId, services, paragraph) {
    const key = this.getKey(dayId, services);
    this.cache.set(key, {
      value: paragraph,
      timestamp: Date.now(),
    });
  }

  clear() {
    this.cache.clear();
  }

  clearForDay(dayId) {
    // Xóa tất cả cache entries cho một ngày cụ thể
    for (const [key] of this.cache.entries()) {
      if (key.startsWith(`${dayId}_`)) {
        this.cache.delete(key);
      }
    }
  }

  getKeyWithMetadata(dayId, daySchedule) {
    // Tạo key bao gồm cả metadata quan trọng
    const metadata = {
      title: daySchedule.titleOfDay,
      distance: daySchedule.distance,
      services: Object.entries(daySchedule)
        .filter(([key]) => /^\d/.test(key))
        .map(([, services]) => services.map((s) => s.id)),
    };
    return `${dayId}_${JSON.stringify(metadata)}`;
  }
}

export const paragraphCache = new ParagraphCache();
