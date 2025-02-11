'use client';
import { Calendar, CreditCard, FileText, Plane } from 'lucide-react';
import { useState } from 'react';

const ticketSteps = [
  {
    id: 'flight-info',
    title: 'Flight Information',
    icon: Plane,
    fields: [
      { id: 'airline', label: 'Airline', type: 'text' },
      { id: 'flightNumber', label: 'Flight Number', type: 'text' },
      { id: 'departureDate', label: 'Departure Date', type: 'date' },
      { id: 'returnDate', label: 'Return Date', type: 'date' },
      { id: 'passengerCount', label: 'Number of Passengers', type: 'number' },
    ],
  },
  {
    id: 'schedule',
    title: 'Schedule Details',
    icon: Calendar,
    fields: [
      { id: 'departureCity', label: 'Departure City', type: 'text' },
      { id: 'arrivalCity', label: 'Arrival City', type: 'text' },
      { id: 'departureTime', label: 'Departure Time', type: 'time' },
      { id: 'arrivalTime', label: 'Arrival Time', type: 'time' },
    ],
  },
  {
    id: 'payment',
    title: 'Payment Information',
    icon: CreditCard,
    fields: [
      { id: 'ticketPrice', label: 'Ticket Price', type: 'number' },
      { id: 'taxFees', label: 'Tax & Fees', type: 'number' },
      { id: 'totalAmount', label: 'Total Amount', type: 'number', disabled: true },
    ],
  },
  {
    id: 'documents',
    title: 'Documents',
    icon: FileText,
    fields: [
      { id: 'passportNumber', label: 'Passport Number', type: 'text' },
      { id: 'passportExpiry', label: 'Passport Expiry', type: 'date' },
      { id: 'visaNumber', label: 'Visa Number', type: 'text' },
      { id: 'visaExpiry', label: 'Visa Expiry', type: 'date' },
    ],
  },
];

export default function ExportTicketLayout() {
  const [activeStep, setActiveStep] = useState('flight-info');
  const [formData, setFormData] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [activeStep]: {
        ...prev[activeStep],
        [field]: value,
      },
    }));
  };

  const currentStep = ticketSteps.find((step) => step.id === activeStep);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {ticketSteps.map((step) => {
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap
                  ${
                    activeStep === step.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{step.title}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {currentStep.fields.map((field) => (
            <div key={field.id} className="space-y-1">
              <label className="text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type={field.type}
                disabled={field.disabled}
                className="w-full p-2 border rounded-md disabled:bg-gray-100"
                value={formData[activeStep]?.[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
              />
            </div>
          ))}

          <div className="flex justify-between pt-4">
            <button
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
              onClick={() => {
                // Handle preview
              }}
            >
              Preview Ticket
            </button>
            <button
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              onClick={() => {
                // Handle export
              }}
            >
              Export Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
