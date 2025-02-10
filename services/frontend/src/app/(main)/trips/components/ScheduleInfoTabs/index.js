'use client';

import {
  addGroupGuest,
  addScheduleImage,
  removeGroupGuest,
  removeScheduleImage,
  updateCustomerInfo,
  updateGroupGuest,
} from '@/store/slices/useDailyScheduleSlice';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DailySchedule from '../../components/DailySchedule';

const tabs = [
  { id: 'basic', label: 'Trip Info' },
  { id: 'schedule', label: 'Trip Schedule' },
];

export default function ScheduleInfoTabs() {
  const [activeTab, setActiveTab] = useState('schedule');
  const dispatch = useDispatch();
  const { customerInfo, groupInfo, scheduleImages } = useSelector(
    (state) => state.dailySchedule.scheduleInfo
  );

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const handleCustomerInfoChange = useCallback(
    (field, value) => {
      dispatch(updateCustomerInfo({ field, value }));
    },
    [dispatch]
  );

  const handleGuestChange = useCallback(
    (index, field, value) => {
      dispatch(updateGroupGuest({ index, field, value }));
    },
    [dispatch]
  );

  const handleAddGuest = useCallback(() => {
    dispatch(addGroupGuest());
  }, [dispatch]);

  const handleRemoveGuest = useCallback(
    (index) => {
      dispatch(removeGroupGuest(index));
    },
    [dispatch]
  );

  const handleAddImage = useCallback(() => {
    // Create hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.multiple = true;

    fileInput.onchange = (e) => {
      const files = Array.from(e.target.files);
      const remainingSlots = 5 - scheduleImages.length;

      // Only process up to the remaining slots
      files.slice(0, remainingSlots).forEach((file) => {
        const imageUrl = URL.createObjectURL(file);
        dispatch(addScheduleImage(imageUrl));
      });
    };

    fileInput.click();
  }, [dispatch, scheduleImages.length]);

  const handleRemoveImage = useCallback(
    (index) => {
      dispatch(removeScheduleImage(index));
    },
    [dispatch]
  );

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 font-medium text-sm transition-colors duration-200
                ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {activeTab === 'basic' ? (
          <div className="space-y-6">
            {/* Customer Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin khách hàng</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên khách/đoàn
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name || ''}
                    onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Nhập tên khách/đoàn..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quốc tịch</label>
                  <input
                    type="text"
                    value={customerInfo.nationality || ''}
                    onChange={(e) => handleCustomerInfoChange('nationality', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Nhập quốc tịch..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngôn ngữ</label>
                  <input
                    type="text"
                    value={customerInfo.language || ''}
                    onChange={(e) => handleCustomerInfoChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Nhập ngôn ngữ sử dụng..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yêu cầu đặc biệt
                  </label>
                  <textarea
                    value={customerInfo.specialRequests || ''}
                    onChange={(e) => handleCustomerInfoChange('specialRequests', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                    rows={2}
                    placeholder="Nhập yêu cầu đặc biệt..."
                  />
                </div>
              </div>
            </div>

            {/* Group Info Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin đoàn</h3>
              <div className="border border-gray-200 rounded-lg p-4">
                {groupInfo.guests.map((guest, index) => (
                  <div key={guest.id || index} className="grid grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      value={guest.name || ''}
                      onChange={(e) => handleGuestChange(index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Tên khách..."
                    />
                    <input
                      type="text"
                      value={guest.nationality || ''}
                      onChange={(e) => handleGuestChange(index, 'nationality', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Quốc tịch..."
                    />
                    <button
                      onClick={() => handleRemoveGuest(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddGuest}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Thêm khách
                </button>
              </div>
            </div>

            {/* Schedule Images Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Hình ảnh lịch trình</h3>
              <div className="grid grid-cols-5 gap-4">
                {scheduleImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Schedule ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {scheduleImages.length < 5 && (
                  <button
                    onClick={handleAddImage}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary/50"
                  >
                    + Thêm ảnh
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500">Tối đa 5 hình ảnh</p>
            </div>
          </div>
        ) : (
          <div className="h-[calc(100vh-200px)] overflow-y-auto">
            <DailySchedule />
          </div>
        )}
      </div>
    </div>
  );
}
