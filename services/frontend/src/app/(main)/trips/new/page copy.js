'use client';

import { useUI } from '@/hooks/useUI';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DailySchedule from '../components/DailySchedule';
import { useScheduleState } from '../components/DailySchedule/states/useScheduleState';

export default function NewTripPage() {
  const router = useRouter();
  const { notifyError } = useUI();
  const [numberOfDays, setNumberOfDays] = useState(null);
  const { pax, updatePax } = useScheduleState();

  // Copy các handlers từ trang cũ
  const handleDaysChange = (e) => {
    const value = e.target.value;
    if (!value) {
      setNumberOfDays(null);
      return;
    }
    if (!/^\d+$/.test(value)) {
      notifyError('Vui lòng chỉ nhập số ngày');
      return;
    }
    const numValue = parseInt(value, 10);
    if (numValue < 1) {
      notifyError('Số ngày phải lớn hơn 0');
      return;
    }
    setNumberOfDays(numValue);
  };

  const handleGuestsChange = (e) => {
    const value = e.target.value;
    if (!value) {
      updatePax(null);
      return;
    }
    if (!/^\d+$/.test(value)) {
      notifyError('Vui lòng chỉ nhập số khách');
      return;
    }
    const numValue = parseInt(value, 10);
    if (numValue < 1) {
      notifyError('Số khách phải lớn hơn 0');
      return;
    }
    console.log('numValue', numValue);
    updatePax(numValue);
  };

  const handlePreview = () => {};

  return (
    <div className="h-full flex flex-col overflow-hidden">
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
          <form className="flex gap-6 items-end">
            <div>
              <input
                type="text"
                className="w-[300px] px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="VD: Hạ Long 3 ngày 2 đêm"
              />
            </div>
            <div>
              <input
                type="text"
                className="w-[100px] px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Days"
                value={numberOfDays || ''}
                onChange={handleDaysChange}
              />
            </div>
            <div>
              <input
                type="text"
                className="w-[100px] px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Pax"
                value={pax || ''}
                onChange={handleGuestsChange}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePreview}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
              >
                Preview
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                Draft
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
              >
                Xuất bản
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <DailySchedule numberOfDays={numberOfDays} pax={pax} />
      </div>
    </div>
  );
}
