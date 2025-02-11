'use client';
import { History, Printer, Send } from 'lucide-react';
import { useState } from 'react';

const documentSections = [
  {
    id: 'print',
    title: 'Print Documents',
    icon: Printer,
    fields: [
      {
        id: 'documentType',
        label: 'Document Type',
        type: 'select',
        options: ['Itinerary', 'Voucher', 'Invoice', 'Contract'],
      },
      { id: 'copies', label: 'Number of Copies', type: 'number' },
      { id: 'paperSize', label: 'Paper Size', type: 'select', options: ['A4', 'A5', 'Letter'] },
      { id: 'printNotes', label: 'Print Notes', type: 'textarea' },
    ],
  },
  {
    id: 'guide',
    title: 'Send to Guide',
    icon: Send,
    fields: [
      { id: 'guideName', label: 'Guide Name', type: 'text' },
      { id: 'guideEmail', label: 'Guide Email', type: 'email' },
      {
        id: 'documents',
        label: 'Select Documents',
        type: 'select',
        multiple: true,
        options: ['Itinerary', 'Guest List', 'Hotel Vouchers', 'Special Notes'],
      },
      { id: 'message', label: 'Message to Guide', type: 'textarea' },
    ],
  },
  {
    id: 'car',
    title: 'Send to Car Owner',
    icon: Send,
    fields: [
      { id: 'companyName', label: 'Transport Company', type: 'text' },
      { id: 'contactEmail', label: 'Contact Email', type: 'email' },
      { id: 'routeDetails', label: 'Route Details', type: 'textarea' },
      { id: 'pickupPoints', label: 'Pickup Points', type: 'textarea' },
      { id: 'specialInstructions', label: 'Special Instructions', type: 'textarea' },
    ],
  },
  {
    id: 'hotel',
    title: 'Send to Hotel',
    icon: Send,
    fields: [
      { id: 'hotelName', label: 'Hotel Name', type: 'text' },
      { id: 'hotelEmail', label: 'Hotel Email', type: 'email' },
      { id: 'checkInDate', label: 'Check-in Date', type: 'date' },
      { id: 'checkOutDate', label: 'Check-out Date', type: 'date' },
      { id: 'rooming', label: 'Rooming List', type: 'file' },
      { id: 'specialRequests', label: 'Special Requests', type: 'textarea' },
    ],
  },
  {
    id: 'history',
    title: 'Document History',
    icon: History,
    fields: [
      {
        id: 'dateRange',
        label: 'Date Range',
        type: 'select',
        options: ['Last 7 days', 'Last 30 days', 'Last 3 months', 'Custom'],
      },
      {
        id: 'documentType',
        label: 'Document Type',
        type: 'select',
        options: ['All', 'Itinerary', 'Voucher', 'Invoice', 'Contract'],
      },
      {
        id: 'recipient',
        label: 'Recipient',
        type: 'select',
        options: ['All', 'Guide', 'Hotel', 'Car Owner'],
      },
    ],
  },
];

export default function CheckingLayout() {
  const [activeSection, setActiveSection] = useState('print');
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

  const currentSection = documentSections.find((section) => section.id === activeSection);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {documentSections.map((section) => {
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
                  multiple={field.multiple}
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
                />
              ) : field.type === 'file' ? (
                <input
                  type="file"
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => handleInputChange(field.id, e.target.files[0])}
                />
              ) : (
                <input
                  type={field.type}
                  className="w-full p-2 border rounded-md"
                  value={formData[activeSection]?.[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-4 pt-4">
            <button
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
              onClick={() => {
                // Handle preview
              }}
            >
              Preview
            </button>
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              onClick={() => {
                // Handle send/print
              }}
            >
              {activeSection === 'print'
                ? 'Print'
                : activeSection === 'history'
                  ? 'Export'
                  : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
