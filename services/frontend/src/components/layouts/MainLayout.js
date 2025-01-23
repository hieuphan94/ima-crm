'use client';

import AppHeader from './Header';
import Sidebar from './Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="relative min-h-screen">
      <AppHeader />
      <div className="flex">
        <Sidebar />
        <main className="relative flex-grow p-2 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
