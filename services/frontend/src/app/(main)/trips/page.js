'use client';

import { useUI } from '@/hooks/useUI';
import { MOCK_TRIPS } from '@/mocks/tripsData';
import { ChevronLeft, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AccountantView from './components/AccountantView';
import OperatorView from './components/OperatorView';
import SalesView from './components/SalesView';

export default function TripsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('sales'); // Default to sales view
  const { toggleSidebar } = useUI();

  const renderDepartmentView = () => {
    switch (departmentFilter) {
      case 'sales':
        return <SalesView trips={MOCK_TRIPS} />;
      case 'operator':
        return <OperatorView trips={MOCK_TRIPS} />;
      case 'accountant':
        return <AccountantView trips={MOCK_TRIPS} />;
      default:
        return <SalesView trips={MOCK_TRIPS} />;
    }
  };

  const handleNewTrip = () => {
    toggleSidebar(); // Thu gọn sidebar
    router.push('/trips/new'); // Chuyển đến trang tạo trip mới
  };

  return (
    <div className="space-y-6 p-6">
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
      </div>

      {/* Header with Department Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-900">Trip Programs</h1>
          <button
            onClick={handleNewTrip}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            <span>New Trip</span>
          </button>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setDepartmentFilter('sales')}
            className={`pb-2 px-4 ${departmentFilter === 'sales' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
          >
            Sales
          </button>
          <button
            onClick={() => setDepartmentFilter('operator')}
            className={`pb-2 px-4 ${departmentFilter === 'operator' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
          >
            Tour Operator
          </button>
          <button
            onClick={() => setDepartmentFilter('accountant')}
            className={`pb-2 px-4 ${departmentFilter === 'accountant' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
          >
            Accountant
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search trips..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Department Specific View */}
      {renderDepartmentView()}
    </div>
  );
}
