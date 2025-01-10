import { ROUTES } from '@/configs/routesPermission';
import { Box, Calendar, Database } from 'lucide-react';

export const LIBRARY_ITEMS = [
  {
    title: 'Templates',
    icon: Calendar,
    route: ROUTES.libraryTemplates,
  },
  {
    title: 'Day Templates',
    icon: Box,
    route: ROUTES.libraryDayTemplates,
  },
  {
    title: 'Services Repository',
    icon: Database,
    route: ROUTES.libraryServicesRepository,
  },
];
