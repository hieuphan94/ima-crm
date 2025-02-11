'use client';
import { Camera, Clock, Map, Users, Wallet } from 'lucide-react';
import { useState } from 'react';

const tripSections = [
  {
    id: 'itinerary',
    title: 'Itinerary Update',
    icon: Map,
    fields: [
      { id: 'destination', label: 'Destination', type: 'text' },
      { id: 'duration', label: 'Duration (days)', type: 'number' },
      { id: 'startDate', label: 'Start Date', type: 'date' },
      { id: 'endDate', label: 'End Date', type: 'date' },
      { id: 'description', label: 'Trip Description', type: 'textarea' },
    ],
  },
  {
    id: 'schedule',
    title: 'Daily Schedule',
    icon: Clock,
    fields: [
      { id: 'dayNumber', label: 'Day Number', type: 'number' },
      { id: 'activities', label: 'Activities', type: 'textarea' },
      { id: 'meals', label: 'Meals Included', type: 'text' },
      { id: 'accommodation', label: 'Accommodation', type: 'text' },
    ],
  },
  {
    id: 'group',
    title: 'Group Details',
    icon: Users,
    fields: [
      { id: 'groupSize', label: 'Group Size', type: 'number' },
      { id: 'specialRequests', label: 'Special Requests', type: 'textarea' },
      { id: 'guideAssigned', label: 'Guide Assigned', type: 'text' },
    ],
  },
  {
    id: 'costs',
    title: 'Cost Updates',
    icon: Wallet,
    fields: [
      { id: 'accommodation', label: 'Accommodation Cost', type: 'number' },
      { id: 'transportation', label: 'Transportation Cost', type: 'number' },
      { id: 'activities', label: 'Activities Cost', type: 'number' },
      { id: 'other', label: 'Other Costs', type: 'number' },
    ],
  },
  {
    id: 'media',
    title: 'Media & Documents',
    icon: Camera,
    fields: [
      { id: 'photos', label: 'Upload Photos', type: 'file', multiple: true },
      { id: 'documents', label: 'Upload Documents', type: 'file', multiple: true },
      { id: 'notes', label: 'Additional Notes', type: 'textarea' },
    ],
  },
];

export default function UpdateTripLayout() {
  const [activeSection, setActiveSection] = useState('itinerary');
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

  const currentSection = tripSections.find((section) => section.id === activeSection);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {tripSections.map((section) => {
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
              {field.type === 'textarea' ? (
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  value={formData[activeSection]?.[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              ) : field.type === 'file' ? (
                <input
                  type="file"
                  multiple={field.multiple}
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => handleInputChange(field.id, e.target.files)}
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
                // Handle save draft
              }}
            >
              Save Draft
            </button>
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              onClick={() => {
                // Handle update
              }}
            >
              Update Trip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
