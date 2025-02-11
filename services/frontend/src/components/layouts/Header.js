'use client';

import { ImageOptimized } from '@/components/common/ImageOptimized';
import HeaderMenu from '@/components/layouts/HeaderMenu';
import { useAuth } from '@/hooks/useAuth';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiUser } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <Navbar maxWidth="full" className="border-b">
      <NavbarContent justify="start">
        <div
          style={{
            position: 'relative', // Thêm position: relative
            width: '120px',
            height: '40px',
            display: 'flex', // Đảm bảo flex layout
            alignItems: 'center', // Căn giữa theo chiều dọc
          }}
        >
          <ImageOptimized
            src="/images/logo-ima.png"
            alt="IMA Logo"
            width={120}
            height={40}
            priority
          />
        </div>
      </NavbarContent>

      <NavbarContent justify="center">
        <NavbarItem>
          <HeaderMenu />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button variant="light" startContent={<Avatar size="sm" icon={<FiUser />} />}>
                {user?.username || 'User'}
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions">
              <DropdownItem key="profile" startContent={<FiUser className="w-4 h-4" />}>
                Thông tin cá nhân
              </DropdownItem>
              <DropdownItem
                key="logout"
                className="text-danger"
                color="danger"
                startContent={<FiLogOut className="w-4 h-4" />}
                onPress={handleLogout}
              >
                Đăng xuất
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
