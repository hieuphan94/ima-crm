'use client';

import { useUI } from '@/hooks/useUI';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DailySchedule from '../components/DailySchedule';

export default function NewTripPage() {
  const router = useRouter();
  const { notifyError } = useUI();
  const [numberOfDays, setNumberOfDays] = useState(null);
  const [numberOfGuests, setNumberOfGuests] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [getScheduleData, setGetScheduleData] = useState(null);

  const handleDaysChange = (e) => {
    const value = e.target.value;

    // Nếu input trống
    if (!value) {
      setNumberOfDays(null);
      return;
    }

    // Kiểm tra nếu không phải số
    if (!/^\d+$/.test(value)) {
      notifyError('Vui lòng chỉ nhập số ngày');
      return;
    }

    // Convert sang số và kiểm tra range
    const numValue = parseInt(value, 10);
    if (numValue < 1) {
      notifyError('Số ngày phải lớn hơn 0');
      return;
    }

    // Nếu hợp lệ
    setNumberOfDays(numValue);
  };

  const handleGuestsChange = (e) => {
    const value = e.target.value;

    // Nếu input trống
    if (!value) {
      setNumberOfGuests(null);
      return;
    }

    // Kiểm tra nếu không phải số
    if (!/^\d+$/.test(value)) {
      notifyError('Vui lòng chỉ nhập số khách');
      return;
    }

    // Convert sang số và kiểm tra range
    const numValue = parseInt(value, 10);
    if (numValue < 1) {
      notifyError('Số khách phải lớn hơn 0');
      return;
    }

    // Nếu hợp lệ
    setNumberOfGuests(numValue);
  };

  const handlePreview = () => {
    if (getScheduleData) {
      // Thay vì gọi getScheduleData(), gọi getScheduleData
      const data = getScheduleData; // Bỏ dấu ()
      setPreviewData(data);
      console.log('Preview data:', data);
    }
  };

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
                value={numberOfGuests || ''}
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
        <DailySchedule
          numberOfDays={numberOfDays}
          pax={numberOfGuests}
          onPreview={setGetScheduleData}
        />
      </div>

      {/* TODO: Add Preview Modal component */}
    </div>
  );
}
