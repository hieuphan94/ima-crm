'use client';

import {
  addScheduleImage,
  removeScheduleImage,
  updateCustomerInfo,
} from '@/store/slices/useDailyScheduleSlice';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DailySchedule from '../DailySchedule';

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
      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`pb-2 px-1 ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary font-medium'
                : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'basic' ? (
        // Trip Info Content
        <>
          {/* Header with collapse button */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium ml-1">Traveller request</h2>
            </div>
          </div>

          {/* Request Information */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm text-gray-600">Request ID</label>
              <div className="font-medium">{customerInfo.requestId || '1529636'}</div>
            </div>

            <div className="grid grid-cols-2 gap-x-8">
              <div>
                <label className="block text-sm text-gray-600">Traveller first name</label>
                <input
                  type="text"
                  value={customerInfo.name || ''}
                  onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Traveller surname</label>
                <input
                  type="text"
                  value={customerInfo.surname || ''}
                  onChange={(e) => handleCustomerInfoChange('surname', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600">Destination</label>
              <input
                type="text"
                value={customerInfo.destination || ''}
                onChange={(e) => handleCustomerInfoChange('destination', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-x-8">
              <div>
                <label className="block text-sm text-gray-600">Arrival date</label>
                <input
                  type="date"
                  value={customerInfo.arrivalDate || ''}
                  onChange={(e) => handleCustomerInfoChange('arrivalDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Departure date</label>
                <input
                  type="date"
                  value={customerInfo.departureDate || ''}
                  onChange={(e) => handleCustomerInfoChange('departureDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm text-gray-600">Number of travellers</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customerInfo.numberOfTravellers || ''}
                  onChange={(e) => handleCustomerInfoChange('numberOfTravellers', e.target.value)}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="relative group">
                  <button className="w-5 h-5 rounded-full border border-blue-500 text-blue-500 flex items-center justify-center">
                    i
                  </button>
                  <div className="hidden group-hover:block absolute bottom-full left-0 w-64 p-4 bg-white border rounded-lg shadow-lg mb-2">
                    <h4 className="font-medium mb-2">Important</h4>
                    <p className="text-sm text-gray-600">
                      If you need to adjust the number of pax please go to Request Manager. Please
                      refresh this page when you've done the modifications in Request Manager.
                    </p>
                    <button className="mt-2 text-green-700 font-medium">
                      GOT TO REQUEST MANAGER
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personalize Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
              <h2 className="text-lg font-medium">Personalize</h2>
              <button className="p-2">
                <span className="transform rotate-180">^</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600">Quote title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Au coeur de l'Indochine"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">Language of quote</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="fr">Français</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600">Cover photo</label>
                <div className="grid grid-cols-3 gap-4">
                  {scheduleImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Cover ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1 bg-white text-gray-600 rounded-full hover:bg-gray-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {scheduleImages.length < 3 && (
                    <button
                      onClick={handleAddImage}
                      className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary/50"
                    >
                      <span className="text-md text-gray-400">📷 Max 3 images</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Trip Schedule Content
        <DailySchedule />
      )}
    </div>
  );
}
