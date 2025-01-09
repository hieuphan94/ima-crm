'use client';

import { getMenuItems } from '@/configs/menuItems';
import { DEPARTMENTS, ROLES } from '@/configs/routesPermission';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/hooks/useUI';
import { Listbox, ListboxItem } from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { FiChevronLeft } from 'react-icons/fi';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useTranslation();
  const { sidebarOpen, toggleSidebar } = useUI();

  const allMenuItems = getMenuItems(t);

  const getMenuByRoleAndDepartment = (user) => {
    if (!user) return [];

    // Admin có menu riêng
    if (user.role === ROLES.ADMIN) {
      return allMenuItems.admin;
    }

    // User thuộc Sales department
    if (user.department === DEPARTMENTS.SALES) {
      return allMenuItems.sales;
    }

    // Trường hợp không xác định
    console.warn('Unknown user role/department:', user);
    return [];
  };

  // Get menu items based on user role and department
  const menuItems = getMenuByRoleAndDepartment(user);

  if (!user || !menuItems.length) {
    console.warn('No menu items for user:', user);
    return null;
  }

  return (
    <div className="bg-white border-r relative">
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block min-h-screen transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-48' : 'w-14'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-4 top-8 bg-orange-50 border-orange-200 border rounded-full p-2 shadow-lg hover:bg-orange-100 cursor-pointer z-50 text-orange-500"
          aria-label="Toggle Sidebar"
        >
          <FiChevronLeft
            className={`w-5 h-5 transition-transform duration-300 ${
              !sidebarOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <Listbox
          aria-label="Menu"
          className="p-3 gap-2"
          onAction={(key) => {
            const item = menuItems.find((item) => item.key === key);
            if (item) {
              router.push(item.href);
            }
          }}
          selectedKeys={[pathname.split('/')[1] || 'dashboard']}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <ListboxItem
                key={item.key}
                startContent={<Icon className={`w-5 h-5 ${!sidebarOpen ? 'mx-auto' : 'mr-2'}`} />}
                className={`${
                  pathname === item.href ? 'bg-green-100 text-green-600' : 'text-gray-600'
                } rounded-lg hover:bg-gray-100 ${!sidebarOpen ? 'justify-center px-0' : 'px-3'}`}
              >
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </ListboxItem>
            );
          })}
        </Listbox>
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex justify-around p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => router.push(item.href)}
                className={`p-2 rounded-full ${
                  pathname === item.href ? 'text-green-600 bg-green-50' : 'text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
