import { AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useState } from 'react';

import { useSelector } from 'react-redux';

const previewTabs = [
  { id: 'validation', label: 'Validation Status', icon: AlertCircle },
  { id: 'details', label: 'Trip Details', icon: CheckCircle },
];

export default function PreviewTab() {
  const scheduleItems = useSelector((state) => state.dailySchedule.scheduleItems);
  const scheduleInfo = useSelector((state) => state.dailySchedule.scheduleInfo);
  const [expandedDays, setExpandedDays] = useState({});
  const [activePreviewTab, setActivePreviewTab] = useState('validation');

  const Map = dynamic(() => import('@/app/(main)/trips/components/Map/MapLibre'), {
    ssr: false,
  });

  const toggleDay = (dayId) => {
    setExpandedDays((prev) => {
      // If clicking the same day that's already open, close it
      if (prev[dayId]) {
        return {};
      }
      // Otherwise, close all days and open only the clicked day
      return {
        [dayId]: true,
      };
    });
  };

  const renderImage = (imageUrl) => {
    if (!imageUrl) return null;

    return (
      <div className="relative h-40 w-full mb-4">
        <Image
          src={imageUrl}
          alt="Service image"
          fill
          className="object-cover rounded-lg"
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  };

  const renderDayServices = (dayData) => {
    const timeSlots = Object.entries(dayData).filter(
      ([key]) => !['order', 'distance', 'titleOfDay', 'meals', 'paragraphDay'].includes(key)
    );

    if (timeSlots.length === 0) {
      return (
        <div className="text-sm text-gray-500 italic">No activities scheduled for this day</div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
              >
                Time
              </th>
              <th
                scope="col"
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Activity
              </th>
              <th
                scope="col"
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
              >
                Duration
              </th>
              <th
                scope="col"
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {timeSlots.map(
              ([time, services]) =>
                Array.isArray(services) &&
                services.map((service, index) => (
                  <tr key={`${time}-${index}`}>
                    {index === 0 && (
                      <td
                        className="px-4 py-2 text-sm text-gray-900 align-top"
                        rowSpan={services.length}
                      >
                        {time}
                      </td>
                    )}
                    <td className="px-4 py-2 text-sm text-gray-500">
                      <div className="font-medium text-gray-900">{service.name}</div>
                      {service.image && renderImage(service.image)}
                      {service.description && (
                        <div className="mt-1 text-sm text-gray-500">{service.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">{service.duration || '-'}</td>
                    <td className="px-4 py-2 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        service.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : service.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                      >
                        {service.status || 'Not set'}
                      </span>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const sortedDays = Object.entries(scheduleItems).sort(([, a], [, b]) => a.order - b.order);

  const getLocationsFromSchedule = () => {
    const locations = sortedDays
      .map(([, dayData]) => {
        const dayLocations = [];
        // Collect all locations from all services in the day
        for (const [, services] of Object.entries(dayData)) {
          if (Array.isArray(services)) {
            services.forEach((service) => {
              if (service.locations?.length > 0) {
                service.locations.forEach((location) => {
                  // Normalize location string
                  const normalizedLocation = location
                    .split(' ')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                    .join(' ')
                    .replace(/'/g, '');
                  dayLocations.push(normalizedLocation);
                });
              }
            });
          }
        }
        return dayLocations;
      })
      .flat(); // Flatten the array of arrays

    // Remove duplicates using Set
    return [...new Set(locations)];
  };

  const renderValidationStatus = () => (
    <div className="space-y-3">
      <div className="p-3 border rounded-lg bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className={`w-2 h-2 rounded-full ${scheduleInfo?.title?.trim() ? 'bg-green-500' : 'bg-red-500'}`}
            ></span>
            <span className="font-medium">Trip Title</span>
            {scheduleInfo?.title && (
              <span className="text-gray-600 truncate">- {scheduleInfo.title}</span>
            )}
          </div>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {scheduleInfo?.title?.trim() ? 'Complete' : 'Missing requirement'}
          </span>
        </div>
        {!scheduleInfo?.title?.trim() && (
          <div className="mt-2 text-sm text-red-500">• Trip title is required</div>
        )}
      </div>

      {sortedDays.map(([dayId, dayData]) => {
        const hasServices = Object.entries(dayData).some(
          ([key, value]) => Array.isArray(value) && value.length > 0
        );
        const hasDayTitle = !!dayData.titleOfDay;
        const hasValidDistance = dayData.distance && parseFloat(dayData.distance) > 0;

        // Check all meals are included and have types specified
        const hasAllMeals =
          dayData.meals &&
          ['breakfast', 'lunch', 'dinner'].every(
            (meal) => dayData.meals[meal]?.included && dayData.meals[meal]?.type
          );

        const isValid = hasServices && hasDayTitle && hasValidDistance && hasAllMeals;

        return (
          <div key={dayId} className="p-3 border rounded-lg bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full ${isValid ? 'bg-green-500' : 'bg-red-500'}`}
                ></span>
                <span className="font-medium">Day {dayData.order}</span>
                {dayData.titleOfDay && (
                  <span className="text-gray-600 truncate">- {dayData.titleOfDay}</span>
                )}
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {isValid ? 'Complete' : 'Missing requirements'}
              </span>
            </div>
            {!isValid && (
              <div className="mt-2 text-sm text-red-500 flex flex-wrap gap-x-4">
                {!hasServices && <div>• No activities</div>}
                {!hasDayTitle && <div>• No title</div>}
                {!hasValidDistance && <div>• Distance = 0</div>}
                {!hasAllMeals && (
                  <div>
                    • Missing meals:{' '}
                    {['breakfast', 'lunch', 'dinner']
                      .filter(
                        (meal) => !dayData.meals?.[meal]?.included || !dayData.meals?.[meal]?.type
                      )
                      .join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderTripDetails = () => (
    <div className="space-y-2">
      {sortedDays.map(([dayId, dayData]) => (
        <div key={dayId} className="border rounded-lg overflow-hidden">
          <button
            onClick={() => toggleDay(dayId)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex items-center gap-4">
              <span className="font-medium">Day {dayData.order}</span>
              {dayData.titleOfDay && <span className="text-gray-600">- {dayData.titleOfDay}</span>}
              {dayData.paxChangeOfDay && (
                <span className="text-gray-600 truncate">
                  - Pax Change: {dayData.paxChangeOfDay}
                </span>
              )}
            </div>
            {expandedDays[dayId] ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </button>

          {expandedDays[dayId] && (
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Distance:</span> {dayData.distance} km
                </div>

                {dayData.meals && (
                  <div className="text-sm">
                    <span className="font-medium">Meals:</span>
                    <div className="ml-4">
                      {Object.entries(dayData.meals).map(
                        ([meal, details]) =>
                          details.included && (
                            <div key={meal}>
                              • {meal.charAt(0).toUpperCase() + meal.slice(1)}:{' '}
                              {details.type || 'Not specified'}
                              {details.price > 0 && ` - ${details.price}`}
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <div className="font-medium mb-2">Activities:</div>
                  {renderDayServices(dayData)}
                </div>

                {dayData.paragraphDay?.paragraphTotal && (
                  <div className="mt-4">
                    <div className="font-medium">Description:</div>
                    <div
                      className="text-sm text-gray-600 mt-1 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: dayData.paragraphDay.paragraphTotal.replace(/\n/g, '<br/>'),
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
      <Map locations={getLocationsFromSchedule()} />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {previewTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePreviewTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md ${
                activePreviewTab === tab.id ? 'bg-white shadow-sm' : 'hover:bg-white/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        {activePreviewTab === 'validation' ? renderValidationStatus() : renderTripDetails()}
      </div>
    </div>
  );
}

export const isScheduleValid = (scheduleData) => {
  const errors = [];

  // Check trip title
  if (!scheduleData.scheduleInfo?.title?.trim()) {
    errors.push('Trip title is required');
  }

  // Check schedule items
  const dayErrors = Object.entries(scheduleData.scheduleItems)
    .map(([, dayData]) => {
      const dayErrors = [];

      // Check services
      const hasServices = Object.entries(dayData).some(
        ([key, value]) => Array.isArray(value) && value.length > 0
      );
      if (!hasServices) {
        dayErrors.push('activities');
      }

      // Check day title
      if (!dayData.titleOfDay) {
        dayErrors.push('title');
      }

      // Check distance
      if (!dayData.distance || parseFloat(dayData.distance) <= 0) {
        dayErrors.push('distance');
      }

      // Check all meals
      const missingMeals = ['breakfast', 'lunch', 'dinner'].filter(
        (meal) => !dayData.meals?.[meal]?.included || !dayData.meals?.[meal]?.type
      );

      if (missingMeals.length > 0) {
        dayErrors.push(`meals (${missingMeals.join(', ')})`);
      }

      return {
        day: `Day ${dayData.order}`,
        missing: dayErrors,
      };
    })
    .filter((day) => day.missing.length > 0);

  // Build error message
  if (errors.length > 0 || dayErrors.length > 0) {
    let errorMessage = '';

    if (errors.length > 0) {
      errorMessage += errors.join(', ') + '. ';
    }

    if (dayErrors.length > 0) {
      errorMessage += dayErrors
        .map((day) => `${day.day} is missing: ${day.missing.join(', ')}`)
        .join('. ');
      errorMessage += '. Please check the Preview tab for more details.';
    }

    return {
      isValid: false,
      error: errorMessage,
    };
  }

  return {
    isValid: true,
    error: null,
  };
};
