import { AlertCircle, FileCheck, FileText, X } from 'lucide-react';
import { useState } from 'react';

const MOCK_HISTORY = [
  { id: 1, date: '2024-03-20 15:30', user: 'John Doe', action: 'Updated day 1 schedule' },
  { id: 2, date: '2024-03-19 14:20', user: 'Jane Smith', action: 'Modified pax count' },
];

const tabs = [
  { id: 'preview', label: 'Preview', icon: FileText },
  { id: 'draft', label: 'Draft', icon: FileCheck },
  { id: 'publish', label: 'Publish', icon: AlertCircle },
];

export default function PublishModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  if (!isOpen) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'preview':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold mb-2">Validation Status</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Day 1: Complete
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Day 2: Missing activities
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Trip Details</h3>
              {/* Add your trip preview content here */}
            </div>
          </div>
        );

      case 'draft':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Edit History</h3>
            <div className="space-y-3">
              {MOCK_HISTORY.map((item) => (
                <div key={item.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{item.user}</span>
                    <span>{item.date}</span>
                  </div>
                  <div className="mt-1">{item.action}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'publish':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Export Format</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedFormat('pdf')}
                  className={`p-4 border rounded-lg flex-1 ${
                    selectedFormat === 'pdf' ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  PDF Format
                </button>
                <button
                  onClick={() => setSelectedFormat('doc')}
                  className={`p-4 border rounded-lg flex-1 ${
                    selectedFormat === 'doc' ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  DOC Format
                </button>
              </div>
            </div>

            {selectedFormat === 'pdf' && (
              <div>
                <h3 className="font-semibold mb-3">Brand Options</h3>
                <div className="grid grid-cols-3 gap-4">
                  {['Brand A', 'Brand B', 'Brand C'].map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`p-4 border rounded-lg ${
                        selectedBrand === brand ? 'border-primary bg-primary/5' : ''
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-3">Web Publishing</h3>
              <div className="p-4 border rounded-lg">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  Publish to website
                </label>
              </div>
            </div>
          </div>
        );
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
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md ${
                  activeTab === tab.id ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4" />
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
          <button className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90">
            {activeTab === 'publish' ? 'Publish' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
