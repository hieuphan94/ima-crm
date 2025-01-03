export const APP_ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    TOURS: '/tours',
    SERVICES: '/services',
};

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        PROFILE: '/auth/profile',
    },
    TOURS: {
        LIST: '/tours',
        DETAIL: (id) => `/tours/${id}`,
        CREATE: '/tours',
        UPDATE: (id) => `/tours/${id}`,
        DELETE: (id) => `/tours/${id}`,
    },
    SERVICES: {
        LIST: '/services',
        DETAIL: (id) => `/services/${id}`,
    },
};

export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
};

export const APP_CONFIG = {
    DEFAULT_PAGE_SIZE: 10,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    SUPPORTED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
};