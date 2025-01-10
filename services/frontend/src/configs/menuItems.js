import {
  FiBook,
  FiCalendar,
  FiDollarSign,
  FiHome,
  FiSettings,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import { ROUTES } from './routesPermission';

export const getMenuItems = (t) => ({
  // ADMIN - Toàn quyền quản lý
  admin: [
    {
      key: 'dashboard',
      label: t('sidebar.dashboard'),
      href: ROUTES.dashboard,
      icon: FiHome,
    },
    {
      key: 'users',
      label: t('sidebar.users'),
      href: ROUTES.users,
      icon: FiUsers,
    },
    {
      key: 'trips',
      label: t('sidebar.trips'),
      href: ROUTES.trips,
      icon: FiCalendar,
    },
    {
      key: 'library',
      label: t('sidebar.library'),
      href: ROUTES.library,
      icon: FiBook,
    },
    {
      key: 'settings',
      label: t('sidebar.settings'),
      href: ROUTES.settings,
      icon: FiSettings,
    },
  ],

  // SALES - Nhân viên bán hàng
  sales: [
    {
      key: 'dashboard',
      label: t('sidebar.dashboard'),
      href: ROUTES.dashboard,
      icon: FiHome,
    },
    {
      key: 'sales',
      label: t('sidebar.sales'),
      href: ROUTES.sales,
      icon: FiDollarSign,
    },
    {
      key: 'trips',
      label: t('sidebar.trips'),
      href: ROUTES.trips,
      icon: FiCalendar,
    },
    {
      key: 'library',
      label: t('sidebar.library'),
      href: ROUTES.library,
      icon: FiBook,
    },
    {
      key: 'profile',
      label: t('sidebar.profile'),
      href: ROUTES.profile,
      icon: FiUser,
    },
  ],
});
