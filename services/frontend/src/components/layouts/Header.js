'use client';

import { useEffect, useState } from 'react';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Link,
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  Button
} from "@nextui-org/react";

export default function AppHeader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit">IMA CRM</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Trang chủ
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Tours
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Dịch vụ
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light">
              Ngôn ngữ
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key="vi">Tiếng Việt</DropdownItem>
            <DropdownItem key="en">English</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
