'use client';

import {
  formatCurrency,
  getStatusBadgeClasses,
  getStatusLabel,
  TRIP_STATUS,
} from '@/data/mocks/tripsData';
import { Calendar, DollarSign, Users } from 'lucide-react';

export default function OperatorView({ trips }) {
  // Nhóm trips theo status
  const groupedTrips = {
    [TRIP_STATUS.OPERATING]: trips.filter((trip) => trip.status === TRIP_STATUS.OPERATING),
    [TRIP_STATUS.BOOKING]: trips.filter((trip) => trip.status === TRIP_STATUS.BOOKING),
    [TRIP_STATUS.BOOKED]: trips.filter((trip) => trip.status === TRIP_STATUS.BOOKED),
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {/* Operating Column */}
      <div className="flex-1 min-w-[350px]">
        <h3 className="font-medium mb-4 text-gray-700">Đang xử lý</h3>
        <div className="space-y-4">
          {groupedTrips[TRIP_STATUS.OPERATING].map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>

      {/* Booking Column */}
      <div className="flex-1 min-w-[350px]">
        <h3 className="font-medium mb-4 text-gray-700">Đang book</h3>
        <div className="space-y-4">
          {groupedTrips[TRIP_STATUS.BOOKING].map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>

      {/* Booked Column */}
      <div className="flex-1 min-w-[350px]">
        <h3 className="font-medium mb-4 text-gray-700">Đã book xong</h3>
        <div className="space-y-4">
          {groupedTrips[TRIP_STATUS.BOOKED].map((trip) => (
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
          <span className="text-sm text-primary font-medium">Mã đoàn: {trip.tourCode}</span>
        </div>
        <span className={getStatusBadgeClasses(trip.status)}>{getStatusLabel(trip.status)}</span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4" />
          <span>Khởi hành: {new Date(trip.startDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4" />
          <span>Số khách: {trip.capacity}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <DollarSign className="w-4 h-4" />
          <span>Dự toán: {formatCurrency(trip.estimatedCost)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button className="text-sm text-primary hover:text-primary/80">
          {trip.status === TRIP_STATUS.OPERATING ? 'Book dịch vụ' : 'Xem chi tiết'}
        </button>
        <button className="text-sm text-gray-600 hover:text-gray-800">Cập nhật giá</button>
      </div>
    </div>
  );
}
