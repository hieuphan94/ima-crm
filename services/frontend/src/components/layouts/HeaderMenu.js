'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FiInbox, FiUser, FiUsers } from 'react-icons/fi';

const menuItems = [
  {
    key: 'office',
    label: 'Office',
    href: '/office',
    icon: FiInbox,
  },
  {
    key: 'room',
    label: 'Room',
    href: '/room',
    icon: FiUsers,
  },
  {
    key: 'personal',
    label: 'Personal',
    href: '/personal',
    icon: FiUser,
  },
];

export default function HeaderMenu() {
  const router = useRouter();
  const pathname = usePathname();

  // Helper function to check if a path is active
  const isActive = (path) => {
    return pathname.startsWith(path);
  };

  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.key}
            onClick={() => router.push(item.href)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium
              transition-colors duration-150 ease-in-out
              ${
                isActive(item.href)
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:bg-white/50'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
