import {
  FiHome,
  FiUsers,
  FiMap,
  FiSettings,
  FiUser,
  FiCalendar,
  FiBook,
  FiDollarSign,
  FiClipboard,
} from 'react-icons/fi';

export const getMenuItems = (t) => ({
  // ADMIN - Toàn quyền quản lý
  admin: [
    {
      key: 'dashboard',
      label: t('sidebar.dashboard'),
      href: '/dashboard',
      icon: FiHome,
    },
    {
      key: 'users',
      label: t('sidebar.users'),
      href: '/users',
      icon: FiUsers,
    },
    {
      key: 'tours',
      label: t('sidebar.tours'),
      href: '/tours',
      icon: FiMap,
    },
    {
      key: 'library',
      label: t('sidebar.library'),
      href: '/library',
      icon: FiBook,
    },
    {
      key: 'settings',
      label: t('sidebar.settings'),
      href: '/settings',
      icon: FiSettings,
    },
  ],

  // SALES - Nhân viên bán hàng
  sales: [
    {
      key: 'dashboard',
      label: t('sidebar.dashboard'),
      href: '/dashboard',
      icon: FiHome,
    },
    {
      key: 'sales',
      label: t('sidebar.sales'),
      href: '/sales',
      icon: FiDollarSign,
    },
    {
      key: 'tours',
      label: t('sidebar.tours'),
      href: '/tours',
      icon: FiMap,
    },
    {
      key: 'profile',
      label: t('sidebar.profile'),
      href: '/profile',
      icon: FiUser,
    },
  ],

  // TOUR OPERATOR - Điều hành tour
  tourOperator: [
    {
      key: 'dashboard',
      label: t('sidebar.dashboard'),
      href: '/dashboard',
      icon: FiHome,
    },
    {
      key: 'tours',
      label: t('sidebar.tourManagement'),
      href: '/tour-management',
      icon: FiMap,
    },
    {
      key: 'schedules',
      label: t('sidebar.schedules'),
      href: '/schedules',
      icon: FiCalendar,
    },
    {
      key: 'profile',
      label: t('sidebar.profile'),
      href: '/profile',
      icon: FiUser,
    },
  ],

  // ACCOUNTANT - Kế toán
  account: [
    {
      key: 'dashboard',
      label: t('sidebar.dashboard'),
      href: '/dashboard',
      icon: FiHome,
    },
    {
      key: 'finance',
      label: t('sidebar.finance'),
      href: '/finance',
      icon: FiDollarSign,
    },
    {
      key: 'reports',
      label: t('sidebar.reports'),
      href: '/reports',
      icon: FiClipboard,
    },
    {
      key: 'profile',
      label: t('sidebar.profile'),
      href: '/profile',
      icon: FiUser,
    },
  ],

  // Default USER
  user: [
    {
      key: 'dashboard',
      label: t('sidebar.dashboard'),
      href: '/dashboard',
      icon: FiHome,
    },
    {
      key: 'profile',
      label: t('sidebar.profile'),
      href: '/profile',
      icon: FiUser,
    },
    {
      key: 'my-tours',
      label: t('sidebar.myTours'),
      href: '/my-tours',
      icon: FiCalendar,
    },
    {
      key: 'library',
      label: t('sidebar.library'),
      href: '/library',
      icon: FiBook,
    },
  ],
});
