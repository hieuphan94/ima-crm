'use client';
import { BookOpen, CheckSquare, CreditCard, FileText, PenTool, Ticket } from 'lucide-react';
import { useState } from 'react';
import BookingLayout from './section/Booking';
import CheckingLayout from './section/Checking';
import DocumentLayout from './section/Document';
import ExportTicketLayout from './section/ExportTicket';
import PaymentLayout from './section/Payment';
import UpdateTripLayout from './section/UpdateTrip';
import TaskTimeline from './SideBar/TaskTimeline';

const OperatorView = () => {
  const [activeTab, setActiveTab] = useState('booking');
  const [activeSubTab, setActiveSubTab] = useState('hotel');

  const operatorTabs = [
    {
      id: 'booking',
      label: 'Booking',
      icon: BookOpen,
      component: BookingLayout,
    },
    {
      id: 'export-ticket',
      label: 'Export Ticket',
      icon: Ticket,
      component: ExportTicketLayout,
    },
    {
      id: 'update-trip',
      label: 'Update Trip',
      icon: PenTool,
      component: UpdateTripLayout,
    },
    {
      id: 'payment',
      label: 'Payment',
      icon: CreditCard,
      component: PaymentLayout,
    },
    {
      id: 'checking',
      label: 'Checking',
      icon: CheckSquare,
      component: CheckingLayout,
    },
    {
      id: 'document',
      label: 'Document',
      icon: FileText,
      component: DocumentLayout,
    },
  ];

  const handleTaskClick = (section, tab) => {
    setActiveTab(section);
    setActiveSubTab(tab);
  };

  const CurrentComponent = operatorTabs.find((tab) => tab.id === activeTab)?.component;

  return (
    <div className="flex">
      {/* Sidebar */}
      <TaskTimeline onTaskClick={handleTaskClick} />
      {/* Main content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto p-1">
          <div className="mb-6 bg-white rounded-lg shadow">
            <nav className="flex overflow-x-auto border-b">
              {operatorTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-6 py-4 border-b-2 whitespace-nowrap
                      ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {CurrentComponent && <CurrentComponent activeTab={activeSubTab} />}
        </div>
      </div>
    </div>
  );
};

export default OperatorView;
