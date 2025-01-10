'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DailySchedule from '../components/DailySchedule';

export default function NewTripPage() {
  const router = useRouter();
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSchedule(true);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header và form */}
      <div className="flex-none p-6">
        <div className="flex justify-between items-center">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button
              onClick={() => router.back()}
              className="hover:text-primary flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <span>/</span>
            <span>Trips</span>
            <span>/</span>
            <span>New Trip</span>
          </div>

          {/* Quick Create Form */}
          <form className="flex gap-6 items-end" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                className="w-[300px] px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="VD: Hạ Long 3 ngày 2 đêm"
              />
            </div>
            <div>
              <input
                type="number"
                className="w-[100px] px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="VD: 3"
                min="1"
                value={numberOfDays || ''}
                onChange={(e) => setNumberOfDays(parseInt(e.target.value, 10))}
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
            >
              Tạo chương trình
            </button>
          </form>
        </div>
      </div>

      {/* Schedule section */}
      <div className="flex-1 overflow-hidden">
        <DailySchedule numberOfDays={numberOfDays} />
      </div>
    </div>
  );
}
