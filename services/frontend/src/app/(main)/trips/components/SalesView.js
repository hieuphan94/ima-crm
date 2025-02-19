'use client';

import { getStatusBadgeClasses, getStatusLabel, TRIP_STATUS } from '@/data/mocks/tripsData';
import { Calendar, DollarSign, MapPin } from 'lucide-react';

export default function SalesView({ trips }) {
  // Nhóm trips theo status
  const groupedTrips = {
    [TRIP_STATUS.DRAFT]: trips.filter((trip) => trip.status === TRIP_STATUS.DRAFT),
    [TRIP_STATUS.PENDING_CUSTOMER]: trips.filter(
      (trip) => trip.status === TRIP_STATUS.PENDING_CUSTOMER
    ),
    [TRIP_STATUS.CONFIRMED]: trips.filter((trip) => trip.status === TRIP_STATUS.CONFIRMED),
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {/* Draft Column */}
      <div className="flex-1 min-w-[350px]">
        <h3 className="font-medium mb-4 text-gray-700">Bản nháp</h3>
        <div className="space-y-4">
          {groupedTrips[TRIP_STATUS.DRAFT].map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>

      {/* Pending Customer Column */}
      <div className="flex-1 min-w-[350px]">
        <h3 className="font-medium mb-4 text-gray-700">Chờ khách duyệt</h3>
        <div className="space-y-4">
          {groupedTrips[TRIP_STATUS.PENDING_CUSTOMER].map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>

      {/* Confirmed Column */}
      <div className="flex-1 min-w-[350px]">
        <h3 className="font-medium mb-4 text-gray-700">Đã xác nhận</h3>
        <div className="space-y-4">
          {groupedTrips[TRIP_STATUS.CONFIRMED].map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TripCard({ trip }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{trip.title}</h3>
          {trip.tourCode && (
            <span className="text-sm text-primary font-medium">Mã đoàn: {trip.tourCode}</span>
          )}
        </div>
        <span className={getStatusBadgeClasses(trip.status)}>{getStatusLabel(trip.status)}</span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{trip.destination}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{new Date(trip.startDate).toLocaleDateString()}</span>
        </div>
        {trip.estimatedCost && (
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <DollarSign className="w-4 h-4" />
            <span>Báo giá: {trip.estimatedCost}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button className="text-sm text-primary hover:text-primary/80">
          {trip.status === TRIP_STATUS.DRAFT ? 'Gửi khách duyệt' : 'Xem chi tiết'}
        </button>
        <button className="text-sm text-gray-600 hover:text-gray-800">Chỉnh sửa</button>
      </div>
    </div>
  );
}
