'use client';

import { AlertCircle } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// Import Map component dynamically to avoid SSR issues
const Map = dynamic(() => import('@/app/(main)/trips/components/Map/MapLibre'), {
  ssr: false,
});

// Thêm bounds cho Việt Nam
const VIETNAM_BOUNDS = {
  north: 23.393395, // Latitude của điểm cực Bắc
  south: 8.559615, // Latitude của điểm cực Nam
  west: 102.144796, // Longitude của điểm cực Tây
  east: 109.469469, // Longitude của điểm cực Đông
};

export default function TripPreview() {
  const params = useParams();
  const [tripData, setTripData] = useState(null);
  const [error, setError] = useState(null);
  const scheduleItems = useSelector((state) => state.dailySchedule.scheduleItems);

  useEffect(() => {
    try {
      const tripId = params.tripId;
      const savedTrip = localStorage.getItem(tripId);

      console.log('savedTrip', savedTrip);

      if (!savedTrip) {
        throw new Error('Trip not found');
      }

      const parsedTrip = JSON.parse(savedTrip);
      setTripData(parsedTrip);
    } catch (error) {
      console.error('Error loading trip:', error);
      setError(error.message);
    }
  }, [params.tripId]);

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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 bg-red-50 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-700">Error Loading Trip</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Trip Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{tripData.tripInfo.title}</h1>
        <div className="flex items-center gap-4 text-gray-600">
          <span>{tripData.tripInfo.numberOfDays} days</span>
          <span>•</span>
          <span>{tripData.tripInfo.pax} pax</span>
          <span>•</span>
          <span>{tripData.tripInfo.starRating}★</span>
        </div>
      </div>

      {/* Map Section */}
      <div className="mb-8 rounded-lg overflow-hidden border">
        <div className="h-[400px]">
          <Map
            locations={getLocationsFromSchedule()}
            initialBounds={VIETNAM_BOUNDS}
            padding={50} // Thêm padding để không bị sát viền
          />
        </div>
      </div>

      {/* Schedule Content */}
      <div className="space-y-6">
        {Object.entries(tripData.scheduleData).map(([dayId, dayData]) => {
          // Skip non-schedule fields
          if (
            ['distance', 'meals', 'order', 'paragraphDay', 'paxChangeOfDay', 'titleOfDay'].includes(
              dayId
            )
          ) {
            return null;
          }

          const dayActivities = Object.entries(dayData)
            .filter(
              ([time]) =>
                ![
                  'distance',
                  'meals',
                  'order',
                  'paragraphDay',
                  'paxChangeOfDay',
                  'titleOfDay',
                ].includes(time)
            )
            .sort(([timeA], [timeB]) => timeA.localeCompare(timeB));

          if (dayActivities.length === 0) return null;

          return (
            <div key={dayId} className="border rounded-lg overflow-hidden">
              <h2 className="text-xl font-semibold p-4 bg-gray-50">
                Day {dayData.order || parseInt(dayId.split('-')[0]) + 1}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-y">
                      <th className="py-2 px-4 text-left w-24">Time</th>
                      <th className="py-2 px-4 text-left">Service</th>
                      <th className="py-2 px-4 text-left w-48">Location</th>
                      <th className="py-2 px-4 text-right w-24">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {dayActivities.map(([time, activities]) => {
                      const activity = activities[0]; // Assuming single activity per time slot
                      if (!activity) return null;

                      return (
                        <tr key={time} className="hover:bg-gray-50">
                          <td className="py-2 px-4 text-gray-600">{time}</td>
                          <td className="py-2 px-4">
                            <div className="font-medium">{activity.name}</div>
                            {activity.type && (
                              <div className="text-xs text-gray-500">{activity.type}</div>
                            )}
                          </td>
                          <td className="py-2 px-4 text-gray-600">
                            {activity.location && (
                              <div className="flex items-center gap-1">
                                <span>📍</span>
                                <span>{activity.location}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-4 text-right text-gray-600">
                            {activity.duration && (
                              <div className="flex items-center justify-end gap-1">
                                <span>⏱️</span>
                                <span>{activity.duration}m</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Trip Details</h3>
        <div className="text-sm text-gray-600">
          Published on:{' '}
          {new Date(tripData.date).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
}
