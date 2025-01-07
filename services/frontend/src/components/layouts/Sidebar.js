'use client';

import { getMenuItems } from '@/configs/menuItems';
import { useAuth } from '@/hooks/useAuth';
import { Listbox, ListboxItem } from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useTranslation();

  const allMenuItems = getMenuItems(t);
  const menuItems = user ? allMenuItems[user.role] || allMenuItems.user : [];

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white border-r">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-36 min-h-screen">
        <Listbox
          aria-label="Menu"
          className="p-2 gap-1"
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
                startContent={<Icon className="w-5 h-5" />}
                className={`${
                  pathname === item.href ? 'bg-green-100 text-green-600' : 'text-gray-600'
                } rounded-lg`}
              >
                {item.label}
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
