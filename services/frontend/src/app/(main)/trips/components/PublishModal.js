import { AlertCircle, FileCheck, FileText, X } from 'lucide-react';
import { useState } from 'react';
import DraftTab from './PublishModal/DraftTab';
import PreviewTab from './PublishModal/PreviewTab';
import PublishTab from './PublishModal/PublishTab';

const MOCK_HISTORY = [
  { id: 1, date: '2024-03-20 15:30', user: 'John Doe', action: 'Updated day 1 schedule' },
  { id: 2, date: '2024-03-19 14:20', user: 'Jane Smith', action: 'Modified pax count' },
];

const tabs = [
  {
    id: 'preview',
    label: 'Preview',
    icon: FileText,
    activeClass: 'bg-blue-50 text-blue-600',
    hoverClass: 'hover:bg-blue-50/50',
  },
  {
    id: 'draft',
    label: 'Draft',
    icon: FileCheck,
    activeClass: 'bg-green-50 text-green-600',
    hoverClass: 'hover:bg-green-50/50',
  },
  {
    id: 'publish',
    label: 'Publish',
    icon: AlertCircle,
    activeClass: 'bg-purple-50 text-purple-600',
    hoverClass: 'hover:bg-purple-50/50',
  },
];

export default function PublishModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('draft');
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'preview':
        return <PreviewTab />;
      case 'draft':
        return <DraftTab />;
      case 'publish':
        return <PublishTab />;
      default:
        return null;
    }
  };

  const handlePublish = async () => {
    if (activeTab === 'publish') {
      try {
        // Add your publish logic here
        console.log('Publishing...');
        // Close modal after successful publish
        onClose();
      } catch (error) {
        console.error('Publish failed:', error);
        alert('Failed to publish. Please try again.');
      }
    } else {
      setActiveTab('publish');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-4xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Publish Trip</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? `shadow-sm ${tab.activeClass}`
                    : `text-gray-600 hover:text-gray-900 ${tab.hoverClass}`
                }`}
              >
                <Icon className={`w-4 h-4 ${activeTab === tab.id ? tab.activeClass : ''}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="max-h-[60vh] overflow-y-auto">{renderTabContent()}</div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
          >
            {activeTab === 'publish' ? 'Publish' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
