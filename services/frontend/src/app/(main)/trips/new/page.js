'use client';

import { VisitService } from '@/data/models';
import { useUI } from '@/hooks/useUI';
import {
  resetDays,
  setSettingsSchedule,
  setStarRating,
} from '@/store/slices/useDailyScheduleSlice';
import debounce from 'lodash/debounce';
import { ChevronLeft, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DailySchedule from '../components/DailySchedule';
import ResetDaysModal from '../components/DailySchedule/components/ResetDaysModal';
import PreviewModal from '../components/PreviewModal';

export default function NewTripPage() {
  const dispatch = useDispatch();
  const { numberOfDays, globalPax, starRating } = useSelector(
    (state) => state.dailySchedule.settings
  );
  const scheduleItems = useSelector((state) => state.dailySchedule.scheduleItems);

  const router = useRouter();
  const { notifyError } = useUI();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sheetData, setSheetData] = useState(null);

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

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  const handleReset = () => {
    setIsResetModalOpen(true);
  };

  const handleConfirmReset = () => {
    dispatch(resetDays());
    setIsResetModalOpen(false);
  };

  const fetchLocationServices = async (locationName) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/sheet?location=${encodeURIComponent(locationName)}`);
      const data = await response.json();

      // Hàm tạo giá random từ 100,000 đến 500,000
      const getRandomPrice = () => {
        return Math.floor(Math.random() * (500000 - 100000 + 1) + 100000);
      };

      // Chuyển đổi dữ liệu thành VisitService instances với giá random
      const services = data.map((serviceData) => {
        const randomPrice = getRandomPrice();
        return new VisitService({
          ...serviceData,
          price: randomPrice,
          quotedPrice: randomPrice * 1.2,
          actualPrice: randomPrice * 0.9,
          duration: serviceData.duration || 0,
          ticketInfo: serviceData.ticketInfo || {},
          openingHours: serviceData.openingHours || {},
          highlights: serviceData.highlights || [],
        });
      });

      setSheetData(services);
    } catch (error) {
      console.error('Error fetching location services:', error);
      notifyError('Không thể lấy dữ liệu dịch vụ cho địa điểm này');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStarChange = (e) => {
    dispatch(setStarRating(parseInt(e.target.value, 10)));
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
              <div>
                <select
                  value={starRating}
                  onChange={handleStarChange}
                  className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value={3}>3 ⭐</option>
                  <option value={4}>4 ⭐</option>
                  <option value={5}>5 ⭐</option>
                </select>
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
          <div className="flex h-full">
            <DailySchedule
              sheetServices={sheetData || []}
              onFetchLocationServices={fetchLocationServices}
            />
          </div>
        </div>
      </div>

      <PreviewModal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} />

      <ResetDaysModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />
    </>
  );
}
