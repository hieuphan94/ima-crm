// 1. Routes công khai
export const PUBLIC_ROUTES = ['/login', '/forgot-password', '/trips/new', '/api/sheet']; // THÊM VÀO SAU

// 2. Tất cả routes trong hệ thống
export const ROUTES = {
  // Public routes
  login: '/login',
  forgotPassword: '/forgot-password',

  // Common routes
  dashboard: '/dashboard',
  profile: '/profile',
  library: '/library',
  libraryTemplates: '/library/templates',
  libraryDayTemplates: '/library/templates/day-templates',
  libraryServicesRepository: '/library/templates/services-repository',

  // Admin routes
  users: '/users',
  settings: '/settings',

  // Department routes (Sales)
  sales: '/sales',
  tours: '/tours',
  trips: '/trips',
  tripsDetail: '/trips/:id',

  // Office routes
  office: '/office',
  officeInbox: '/office?tab=inbox',
  officePipeline: '/office?tab=pipeline',
  officeTodo: '/office?tab=todo',

  // Room routes
  room: '/room',
  roomDetails: '/room/details',
  roomSettings: '/room/settings',

  // Personal route
  personal: '/personal',
};

// 3. Ba loại role có thể có
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
};

// 4. Hiện tại chỉ có department Sales
export const DEPARTMENTS = {
  SALES: 'sales',
};

// 5. Phân quyền theo department
export const DEPARTMENT_PERMISSIONS = {
  [DEPARTMENTS.SALES]: [
    ROUTES.dashboard,
    ROUTES.sales,
    ROUTES.tours,
    ROUTES.trips,
    ROUTES.profile,
    ROUTES.library,
    ROUTES.libraryTemplates,
    ROUTES.libraryDayTemplates,
    ROUTES.libraryServicesRepository,
    ROUTES.settings,
    // Thêm quyền truy cập Office cho Sales
    ROUTES.office,
    ROUTES.officeInbox,
    ROUTES.officePipeline,
    ROUTES.officeTodo,
  ],
};

// 6. Helper function để check public route
export const isPublicRoute = (path) => {
  // Check path có hợp lệ
  if (!path || typeof path !== 'string') {
    console.warn('Invalid path:', path);
    return false;
  }

  return PUBLIC_ROUTES.some((route) => path.startsWith(route));
};

// 7. Check permission
export const hasPermission = (role, department, path) => {
  // 1. Validate path
  if (!path || typeof path !== 'string') {
    console.warn('Invalid path:', path);
    return false;
  }

  // 2. Validate role & department
  if (!role || typeof role !== 'string') {
    console.warn('Invalid role:', role);
    return false;
  }

  if (!department || typeof department !== 'string') {
    console.warn('Invalid department:', department);
    return false;
  }

  // 3. Check role is valid
  if (!Object.values(ROLES).includes(role)) {
    console.warn('Unknown role:', role);
    return false;
  }

  // 4. Check department is valid
  if (!Object.values(DEPARTMENTS).includes(department)) {
    console.warn('Unknown department:', department);
    return false;
  }

  // 5. Admin luôn có quyền
  if (role === ROLES.ADMIN) return true;

  // 6. Check department permissions
  const departmentPerms = DEPARTMENT_PERMISSIONS[department];
  if (!departmentPerms) return false;

  // 7. Check if path starts with any allowed route
  return departmentPerms.some((route) => path.startsWith(route));
};

// 8. Get default route
export const getDefaultRoute = (role, department) => {
  // 1. Validate role & department
  if (!role || typeof role !== 'string') {
    console.warn('Invalid role:', role);
    return ROUTES.login;
  }

  if (!department || typeof department !== 'string') {
    console.warn('Invalid department:', department);
    return ROUTES.login;
  }

  // 2. Check role is valid
  if (!Object.values(ROLES).includes(role)) {
    console.warn('Unknown role:', role);
    return ROUTES.login;
  }

  // 3. Check department is valid
  if (!Object.values(DEPARTMENTS).includes(department)) {
    console.warn('Unknown department:', department);
    return ROUTES.login;
  }

  // 4. Return route based on role/department
  if (role === ROLES.ADMIN) {
    return ROUTES.dashboard;
  }

  if (department === DEPARTMENTS.SALES) {
    return ROUTES.dashboard;
  }

  return ROUTES.dashboard;
};

export const ROUTE_PERMISSIONS = {
  [ROUTES.room]: ['admin', 'user', 'manager'],
  [ROUTES.roomDetails]: ['admin', 'user', 'manager'],
  [ROUTES.roomSettings]: ['admin', 'manager'],
};

export const ROUTES_PERMISSIONS = {
  [ROUTES.personal]: {
    roles: ['admin', 'user'],
    redirectTo: '/auth/login',
  },
};
