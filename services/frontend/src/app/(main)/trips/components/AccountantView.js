'use client';

import {
  formatCurrency,
  getStatusBadgeClasses,
  getStatusLabel,
  TRIP_STATUS,
} from '@/mocks/tripsData';
import { DollarSign } from 'lucide-react';

export default function AccountantView({ trips }) {
  // Nhóm trips theo status
  const groupedTrips = {
    [TRIP_STATUS.PROCESSING]: trips.filter((trip) => trip.status === TRIP_STATUS.PROCESSING),
    [TRIP_STATUS.COMPLETED]: trips.filter((trip) => trip.status === TRIP_STATUS.COMPLETED),
    [TRIP_STATUS.ARCHIVED]: trips.filter((trip) => trip.status === TRIP_STATUS.ARCHIVED),
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {/* Processing Column */}
      <div className="flex-1 min-w-[350px]">
        <h3 className="font-medium mb-4 text-gray-700">Đang thanh toán</h3>
        <div className="space-y-4">
          {groupedTrips[TRIP_STATUS.PROCESSING].map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>

      {/* Completed Column */}
      <div className="flex-1 min-w-[350px]">
        <h3 className="font-medium mb-4 text-gray-700">Hoàn thành</h3>
        <div className="space-y-4">
          {groupedTrips[TRIP_STATUS.COMPLETED].map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </div>

      {/* Archived Column */}
      <div className="flex-1 min-w-[350px]">
        <h3 className="font-medium mb-4 text-gray-700">Đã lưu trữ</h3>
        <div className="space-y-4">
          {groupedTrips[TRIP_STATUS.ARCHIVED].map((trip) => (
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
          <DollarSign className="w-4 h-4" />
          <span>Dự toán: {formatCurrency(trip.estimatedCost)}</span>
        </div>
        {trip.finalCost && (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            <DollarSign className="w-4 h-4" />
            <span>Quyết toán: {formatCurrency(trip.finalCost)}</span>
          </div>
        )}
        <div className="text-sm text-gray-500">Hóa đơn: 5/10 (50%)</div>
      </div>

      <div className="flex justify-between items-center">
        <button className="text-sm text-primary hover:text-primary/80">
          {trip.status === TRIP_STATUS.PROCESSING ? 'Cập nhật hóa đơn' : 'Xem chi tiết'}
        </button>
        <button className="text-sm text-gray-600 hover:text-gray-800">
          {trip.status === TRIP_STATUS.PROCESSING ? 'Quyết toán' : 'Xuất báo cáo'}
        </button>
      </div>
    </div>
  );
}
