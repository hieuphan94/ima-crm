const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const URLS = {
  // Auth URLs
  AUTH: {
    LOGIN: `${BASE_URL}/users/login`,
    REGISTER: `${BASE_URL}/users/register`,
    PROFILE: `${BASE_URL}/users/profile`,
    LOGOUT: `${BASE_URL}/users/logout`,
  },

  // User URLs
  USERS: {
    LIST: `${BASE_URL}/users`,
    DETAIL: (id) => `${BASE_URL}/users/${id}`,
    UPDATE: (id) => `${BASE_URL}/users/${id}`,
    DELETE: (id) => `${BASE_URL}/users/${id}`,
    CHANGE_PASSWORD: (id) => `${BASE_URL}/users/${id}/change-password`,
  },

  // Tour URLs
  TOURS: {
    LIST: `${BASE_URL}/tours`,
    DETAIL: (id) => `${BASE_URL}/tours/${id}`,
    CREATE: `${BASE_URL}/tours`,
    UPDATE: (id) => `${BASE_URL}/tours/${id}`,
    DELETE: (id) => `${BASE_URL}/tours/${id}`,
    MY_TOURS: `${BASE_URL}/tours/my-tours`,
  },

  // Library URLs
  LIBRARY: {
    LIST: `${BASE_URL}/library`,
    UPLOAD: `${BASE_URL}/library/upload`,
    DELETE: (id) => `${BASE_URL}/library/${id}`,
  },

  // Settings URLs
  SETTINGS: {
    GET: `${BASE_URL}/settings`,
    UPDATE: `${BASE_URL}/settings`,
  },

  // Reports URLs
  REPORTS: {
    SALES: `${BASE_URL}/reports/sales`,
    FINANCE: `${BASE_URL}/reports/finance`,
    TOURS: `${BASE_URL}/reports/tours`,
  },
};

export default URLS;
