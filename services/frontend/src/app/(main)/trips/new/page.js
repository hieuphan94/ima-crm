'use client';

import { useUI } from '@/hooks/useUI';
import { resetDays, setSettingsSchedule } from '@/store/slices/useDailyScheduleSlice';
import debounce from 'lodash/debounce';
import { ChevronLeft, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DailySchedule from '../components/DailySchedule';
import ResetDaysModal from '../components/DailySchedule/components/ResetDaysModal';

export default function NewTripPage() {
  const dispatch = useDispatch();
  const { numberOfDays, globalPax } = useSelector((state) => state.dailySchedule.settings);
  const scheduleItems = useSelector((state) => state.dailySchedule.scheduleItems);

  const router = useRouter();
  const { notifyError } = useUI();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const debouncedValidation = useCallback(
    debounce((value) => {
      const existingDaysCount = Object.keys(scheduleItems).length;
      if (value < existingDaysCount) {
        notifyError(`Số ngày không thể nhỏ hơn số ngày hiện tại (${existingDaysCount} ngày)`);
        return false;
      }
      return true;
    }, 1000),
    [scheduleItems]
  );

  const debouncedUpdateSettings = useCallback(
    debounce((field, value) => {
      dispatch(
        setSettingsSchedule({
          ...(field === 'numberOfDays'
            ? { numberOfDays: value, globalPax }
            : { globalPax: value, numberOfDays }),
        })
      );
    }, 200),
    [dispatch, numberOfDays, globalPax]
  );

  const handleDaysChange = (e) => {
    const value = e.target.value;
    if (!value) {
      debouncedUpdateSettings('numberOfDays', null);
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

    if (numValue > 35) {
      notifyError('Số ngày không lớn hơn 35');
      return;
    }

    // Cập nhật state ngay lập tức để UI responsive
    debouncedUpdateSettings('numberOfDays', numValue);
    // Validate sau 500ms để đợi người dùng nhập xong
    debouncedValidation(numValue);
  };

  const handleDaysBlur = (e) => {
    const value = e.target.value;
    if (!value) return;

    const numValue = parseInt(value, 10);
    if (numValue < 1) {
      notifyError('Số ngày phải lớn hơn 0');
      return;
    }

    // Kiểm tra số ngày mới không được nhỏ hơn số ngày hiện có
    const existingDaysCount = Object.keys(scheduleItems).length;
    if (numValue < existingDaysCount) {
      notifyError(`Số ngày không thể nhỏ hơn số ngày hiện tại (${existingDaysCount} ngày)`);
      debouncedUpdateSettings('numberOfDays', existingDaysCount);
      return;
    }
  };

  const handleGuestsChange = (e) => {
    const value = e.target.value;
    if (!value) {
      debouncedUpdateSettings('globalPax', null);
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
    if (numValue > 500) {
      notifyError('Số khách không lớn hơn 500');
      return;
    }
    debouncedUpdateSettings('globalPax', numValue);
  };

  const handlePreview = () => {};

  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  const handleConfirmReset = () => {
    dispatch(resetDays());
    setIsResetModalOpen(false);
  };

  return (
    <>
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
              <div className="relative">
                <input
                  type="text"
                  className="w-[100px] px-4 py-2 pr-8 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Days"
                  value={numberOfDays || ''}
                  onChange={handleDaysChange}
                  onBlur={handleDaysBlur}
                />
                {numberOfDays > 1 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    title="Reset to default"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div>
                <input
                  type="text"
                  className="w-[100px] px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Pax"
                  value={globalPax || ''}
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
          <DailySchedule />
        </div>
      </div>

      <ResetDaysModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </>
  );
}
