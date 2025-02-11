'use client';
import { Building2, Car, MapPin, Plane, Star, Users, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';

const bookingTabs = [
  {
    id: 'hotel',
    label: 'Hotel',
    icon: Building2,
    fields: [
      { id: 'hotelName', label: 'Hotel Name', type: 'text' },
      { id: 'checkIn', label: 'Check-in', type: 'date' },
      { id: 'checkOut', label: 'Check-out', type: 'date' },
      {
        id: 'roomType',
        label: 'Room Type',
        type: 'select',
        options: ['Single', 'Double', 'Twin', 'Suite'],
      },
      {
        id: 'mealPlan',
        label: 'Meal Plan',
        type: 'select',
        options: ['Room Only', 'Breakfast', 'Half Board', 'Full Board'],
      },
    ],
  },
  {
    id: 'restaurant',
    label: 'Restaurant',
    icon: UtensilsCrossed,
    fields: [
      { id: 'restaurantName', label: 'Restaurant Name', type: 'text' },
      { id: 'date', label: 'Date', type: 'date' },
      { id: 'time', label: 'Time', type: 'time' },
      {
        id: 'menuType',
        label: 'Menu Type',
        type: 'select',
        options: ['Set Menu', 'Buffet', 'A La Carte'],
      },
    ],
  },
  {
    id: 'special',
    label: 'Special Service',
    icon: Star,
    fields: [
      { id: 'serviceName', label: 'Service Name', type: 'text' },
      { id: 'serviceDate', label: 'Date', type: 'date' },
      { id: 'serviceDetails', label: 'Details', type: 'textarea' },
    ],
  },
  {
    id: 'guide',
    label: 'Guide',
    icon: Users,
    fields: [
      { id: 'guideName', label: 'Guide Name', type: 'text' },
      {
        id: 'language',
        label: 'Language',
        type: 'select',
        options: ['English', 'French', 'Spanish', 'Chinese', 'Japanese'],
      },
      { id: 'startDate', label: 'Start Date', type: 'date' },
      { id: 'endDate', label: 'End Date', type: 'date' },
    ],
  },
  {
    id: 'fly',
    label: 'Fly',
    icon: Plane,
    fields: [
      { id: 'flightNo', label: 'Flight Number', type: 'text' },
      { id: 'departure', label: 'Departure', type: 'text' },
      { id: 'arrival', label: 'Arrival', type: 'text' },
      { id: 'departureDate', label: 'Departure Date', type: 'date' },
      { id: 'departureTime', label: 'Departure Time', type: 'time' },
    ],
  },
  {
    id: 'transport',
    label: 'Car | Train | Bus',
    icon: Car,
    fields: [
      {
        id: 'transportType',
        label: 'Transport Type',
        type: 'select',
        options: ['Car', 'Train', 'Bus'],
      },
      { id: 'from', label: 'From', type: 'text' },
      { id: 'to', label: 'To', type: 'text' },
      { id: 'date', label: 'Date', type: 'date' },
      { id: 'time', label: 'Time', type: 'time' },
    ],
  },
  {
    id: 'visit',
    label: 'Visit',
    icon: MapPin,
    fields: [
      { id: 'location', label: 'Location', type: 'text' },
      { id: 'visitDate', label: 'Date', type: 'date' },
      { id: 'visitTime', label: 'Time', type: 'time' },
      { id: 'duration', label: 'Duration (hours)', type: 'number' },
    ],
  },
];

export default function BookingLayout() {
  const [activeTab, setActiveTab] = useState('hotel');
  const [formData, setFormData] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value,
      },
    }));
  };

  const currentTab = bookingTabs.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {bookingTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {currentTab.fields.map((field) => (
            <div key={field.id} className="space-y-1">
              <label className="text-sm font-medium text-gray-700">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData[activeTab]?.[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                >
                  <option value="">Select {field.label}</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  value={formData[activeTab]?.[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              ) : (
                <input
                  type={field.type}
                  className="w-full p-2 border rounded-md"
                  value={formData[activeTab]?.[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-4 pt-4">
            <button
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
              onClick={() => {
                // Handle save draft
              }}
            >
              Save Draft
            </button>
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              onClick={() => {
                // Handle submit
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
