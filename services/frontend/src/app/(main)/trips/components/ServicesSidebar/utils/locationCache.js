export const LocationCache = {
  // Key format: location_{locationName}
  getKey: (locationName) => `location_${locationName}`,

  // Cache expiration time (e.g., 1 hour)
  CACHE_DURATION: 60 * 60 * 1000,

  set: (locationName, services) => {
    try {
      // Kiểm tra services có hợp lệ không
      if (!Array.isArray(services) || services.length === 0) {
        console.warn('Invalid services data, skipping cache');
        return;
      }

      // Kiểm tra cache hiện tại
      const currentCache = LocationCache.get(locationName);

      // So sánh dữ liệu mới và cũ
      if (currentCache) {
        const isEqual = JSON.stringify(currentCache) === JSON.stringify(services);
        if (isEqual) return; // Không lưu nếu dữ liệu giống nhau
      }

      // Chỉ lưu khi dữ liệu mới khác với cache
      const data = {
        timestamp: Date.now(),
        services: services,
      };
      localStorage.setItem(LocationCache.getKey(locationName), JSON.stringify(data));
    } catch (error) {
      console.warn('Cache set failed:', error);
    }
  },

  get: (locationName) => {
    try {
      const cached = localStorage.getItem(LocationCache.getKey(locationName));
      if (!cached) return null;

      const data = JSON.parse(cached);

      // Check if cache is expired
      if (Date.now() - data.timestamp > LocationCache.CACHE_DURATION) {
        localStorage.removeItem(LocationCache.getKey(locationName));
        return null;
      }

      return data.services;
    } catch {
      return null;
    }
  },

  clear: () => {
    // Clear all location caches
    Object.keys(localStorage)
      .filter((key) => key.startsWith('location_'))
      .forEach((key) => localStorage.removeItem(key));
  },
};
