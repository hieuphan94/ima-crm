'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RoomPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Room Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Room content will go here */}
        <div className="p-6 rounded-xl bg-white shadow-sm">
          <p className="text-gray-500">Room content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
