import { AlertCircle, CheckCircle, FileCheck, FileText, X } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import DraftTab from './PublishModal/DraftTab';
import PreviewTab, { isScheduleValid } from './PublishModal/PreviewTab';
import PublishTab from './PublishModal/PublishTab';

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

// Helper function to generate trip code
const generateTripCode = () => {
  const prefix = 'TRIP';
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  const timestamp = new Date().getTime().toString().slice(-4);
  return `${prefix}-${randomNum}-${timestamp}`;
};

// Validation function (copied from DraftTab)
const validateVersion = (version) => {
  if (!version) return false;

  if (!version.scheduleData || Object.keys(version.scheduleData).length === 0) {
    return false;
  }

  const requiredFields = [
    'scheduleData',
    'tripInfo',
    'tripInfo.pax',
    'tripInfo.numberOfDays',
    'tripInfo.title',
    'tripInfo.starRating',
  ];

  return requiredFields.every((field) => {
    const fields = field.split('.');
    let value = version;
    for (const f of fields) {
      value = value?.[f];
    }
    return value !== undefined && value !== null;
  });
};

export default function PublishModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('preview');
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Get current schedule state from Redux
  const currentSchedule = useSelector((state) => state.dailySchedule.scheduleItems);
  const globalPax = useSelector((state) => state.dailySchedule.settings.globalPax);
  const numberOfDays = useSelector((state) => state.dailySchedule.settings.numberOfDays);
  const tripTitle = useSelector((state) => state.dailySchedule.scheduleInfo.title);
  const starRating = useSelector((state) => state.dailySchedule.settings.starRating || 4);

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'preview':
        return <PreviewTab />;
      case 'draft':
        return <DraftTab onClose={onClose} />;
      case 'publish':
        return <PublishTab />;
      default:
        return null;
    }
  };

  const handlePublish = async () => {
    if (activeTab === 'publish') {
      try {
        // Check validation first
        const currentState = {
          scheduleInfo: { title: tripTitle },
          scheduleItems: currentSchedule,
        };

        const validationResult = isScheduleValid(currentState);

        if (!validationResult.isValid) {
          throw new Error(validationResult.error);
        }

        const tripCode = generateTripCode();

        const newVersion = {
          id: Date.now(),
          date: new Date().toISOString().replace('T', ' ').substr(0, 19),
          type: 'published',
          tripCode: tripCode,
          changes: `Published version - ${tripCode}`,
          scheduleData: currentSchedule,
          tripInfo: {
            pax: globalPax,
            numberOfDays: numberOfDays,
            title: tripTitle,
            starRating: starRating,
            status: 'published',
            publishedAt: new Date().toISOString(),
          },
        };

        if (!validateVersion(newVersion)) {
          throw new Error('Invalid trip data structure');
        }

        // Save to localStorage
        const savedHistory = JSON.parse(localStorage.getItem('tripData') || '[]');
        const updatedHistory = [newVersion, ...savedHistory].slice(0, 20);
        localStorage.setItem('tripData', JSON.stringify(updatedHistory));

        setPublishSuccess(true);
        setTimeout(() => {
          setPublishSuccess(false);
          onClose();
        }, 1500);
      } catch (error) {
        console.error('Publish failed:', error);
        setPublishError(error.message || 'Failed to publish. Please check all required fields.');
        setTimeout(() => setPublishError(null), 3000);
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

        <div className="max-h-[60vh] overflow-y-auto">
          {renderTabContent()}
          {publishError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-red-700 text-sm">{publishError}</span>
            </div>
          )}
        </div>

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

        {/* Add Success Modal */}
        {publishSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" />
            <div className="relative bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex flex-col items-center py-4">
                <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                <p className="text-lg font-medium">Published Successfully!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
