'use client';
import { 
  Listbox, 
  ListboxItem,
  ListboxSection 
} from "@nextui-org/react";
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      href: '/dashboard'
    },
    {
      key: 'customers',
      label: 'Khách hàng',
      href: '/customers'
    },
    {
      key: 'tours',
      label: 'Tours',
      href: '/tours'
    },
    {
      key: 'settings',
      label: 'Cài đặt',
      href: '/settings'
    }
  ];

  return (
    <div className="w-64 h-screen bg-white border-r">
      <Listbox 
        aria-label="Menu"
        className="p-0"
        onAction={(key) => {
          const item = menuItems.find(item => item.key === key);
          if (item) {
            router.push(item.href);
          }
        }}
      >
        {menuItems.map((item) => (
          <ListboxItem key={item.key}>
            {item.label}
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  );
}
