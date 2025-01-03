'use client';

import { AppHeader } from '@/components/common/AppHeader';
// import { Sidebar } from '@/components/common/Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <div className="flex">
        {/* <Sidebar /> */}
        <main className="flex-grow p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
