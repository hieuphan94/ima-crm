'use client';
import { Building2, Car, CreditCard, MapPin, Plane, UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';

const paymentSections = [
  {
    id: 'hotel',
    title: 'Hotel Payment',
    icon: Building2,
    fields: [
      { id: 'hotelName', label: 'Hotel Name', type: 'text' },
      { id: 'bookingRef', label: 'Booking Reference', type: 'text' },
      { id: 'amount', label: 'Amount', type: 'number' },
      { id: 'currency', label: 'Currency', type: 'select', options: ['USD', 'VND', 'EUR'] },
      {
        id: 'paymentMethod',
        label: 'Payment Method',
        type: 'select',
        options: ['Bank Transfer', 'Credit Card', 'Cash'],
      },
      { id: 'dueDate', label: 'Due Date', type: 'date' },
      { id: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid', 'Overdue'] },
    ],
  },
  {
    id: 'restaurant',
    title: 'Restaurant Payment',
    icon: UtensilsCrossed,
    fields: [
      { id: 'restaurantName', label: 'Restaurant Name', type: 'text' },
      { id: 'reservationDate', label: 'Reservation Date', type: 'date' },
      { id: 'amount', label: 'Amount', type: 'number' },
      { id: 'currency', label: 'Currency', type: 'select', options: ['USD', 'VND', 'EUR'] },
      {
        id: 'paymentStatus',
        label: 'Payment Status',
        type: 'select',
        options: ['Pending', 'Paid', 'Cancelled'],
      },
    ],
  },
  {
    id: 'transport',
    title: 'Transport Payment',
    icon: Car,
    fields: [
      { id: 'provider', label: 'Transport Provider', type: 'text' },
      { id: 'serviceDate', label: 'Service Date', type: 'date' },
      { id: 'amount', label: 'Amount', type: 'number' },
      {
        id: 'paymentMethod',
        label: 'Payment Method',
        type: 'select',
        options: ['Bank Transfer', 'Cash', 'Credit Card'],
      },
      { id: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid', 'Cancelled'] },
    ],
  },
  {
    id: 'flight',
    title: 'Flight Payment',
    icon: Plane,
    fields: [
      { id: 'airline', label: 'Airline', type: 'text' },
      { id: 'ticketNumber', label: 'Ticket Number', type: 'text' },
      { id: 'amount', label: 'Amount', type: 'number' },
      { id: 'paymentDeadline', label: 'Payment Deadline', type: 'date' },
      { id: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid', 'Cancelled'] },
    ],
  },
  {
    id: 'attraction',
    title: 'Attraction Payment',
    icon: MapPin,
    fields: [
      { id: 'attractionName', label: 'Attraction Name', type: 'text' },
      { id: 'visitDate', label: 'Visit Date', type: 'date' },
      { id: 'ticketQuantity', label: 'Ticket Quantity', type: 'number' },
      { id: 'totalAmount', label: 'Total Amount', type: 'number' },
      { id: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid', 'Cancelled'] },
    ],
  },
  {
    id: 'summary',
    title: 'Payment Summary',
    icon: CreditCard,
    fields: [
      { id: 'totalPaid', label: 'Total Paid', type: 'number', disabled: true },
      { id: 'totalPending', label: 'Total Pending', type: 'number', disabled: true },
      { id: 'nextPayment', label: 'Next Payment Due', type: 'date', disabled: true },
      { id: 'notes', label: 'Payment Notes', type: 'textarea' },
    ],
  },
];

export default function PaymentLayout() {
  const [activeSection, setActiveSection] = useState('hotel');
  const [formData, setFormData] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [activeSection]: {
        ...prev[activeSection],
        [field]: value,
      },
    }));
  };

  const currentSection = paymentSections.find((section) => section.id === activeSection);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {paymentSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap
                  ${
                    activeSection === section.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{section.title}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {currentSection.fields.map((field) => (
            <div key={field.id} className="space-y-1">
              <label className="text-sm font-medium text-gray-700">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  className="w-full p-2 border rounded-md"
                  value={formData[activeSection]?.[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  disabled={field.disabled}
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
                  value={formData[activeSection]?.[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  disabled={field.disabled}
                />
              ) : (
                <input
                  type={field.type}
                  className="w-full p-2 border rounded-md disabled:bg-gray-100"
                  value={formData[activeSection]?.[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  disabled={field.disabled}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-4 pt-4">
            <button
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
              onClick={() => {
                // Handle payment history
              }}
            >
              Payment History
            </button>
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              onClick={() => {
                // Handle process payment
              }}
            >
              Process Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
