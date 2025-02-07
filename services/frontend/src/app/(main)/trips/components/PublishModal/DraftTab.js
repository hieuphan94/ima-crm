import { CheckCircle, Clock, RotateCcw, Save } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const MOCK_AUTO_HISTORY = [
  {
    id: 1,
    date: '2024-03-20 15:30:22',
    type: 'auto',
    changes: 'Updated day 1 schedule - Added Lunch at Restaurant ABC',
    scheduleData: {}, // This would be the actual schedule state
  },
  {
    id: 2,
    date: '2024-03-20 14:20:15',
    type: 'manual',
    changes: 'Manually saved - Complete day 1 and 2 planning',
    scheduleData: {},
  },
  {
    id: 3,
    date: '2024-03-20 13:15:30',
    type: 'auto',
    changes: 'Modified pax count from 10 to 12',
    scheduleData: {},
  },
];

export default function DraftTab() {
  const dispatch = useDispatch();
  const currentSchedule = useSelector((state) => state.dailySchedule.scheduleItems);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleLoadVersion = (version) => {
    setSelectedVersion(version);
    // TODO: Implement actual loading logic
    // dispatch(loadScheduleVersion(version.scheduleData));
  };

  const handleManualSave = () => {
    if (!saveName.trim()) return;

    // TODO: Implement actual save logic
    // dispatch(saveScheduleVersion({ name: saveName, scheduleData: currentSchedule }));

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setSaveModalOpen(false);
      setSaveName('');
    }, 1500);
  };

  return (
    <div className="space-y-4">
      {/* Manual Save Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setSaveModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90"
        >
          <Save className="w-4 h-4" />
          Save Current Version
        </button>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {MOCK_AUTO_HISTORY.map((item) => (
          <div
            key={item.id}
            className={`p-4 border rounded-lg transition-colors ${
              selectedVersion?.id === item.id ? 'border-primary bg-primary/5' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">{item.date}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    item.type === 'auto' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  {item.type === 'auto' ? 'Auto saved' : 'Manual save'}
                </span>
              </div>
              <button
                onClick={() => handleLoadVersion(item)}
                className="px-3 py-1 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Load
              </button>
            </div>
            <div className="text-sm">{item.changes}</div>
          </div>
        ))}
      </div>

      {/* Save Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSaveModalOpen(false)} />
          <div className="relative bg-white rounded-lg w-full max-w-md p-6">
            {saveSuccess ? (
              <div className="flex flex-col items-center py-4">
                <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                <p className="text-lg font-medium">Saved Successfully!</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-4">Save Current Version</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Version Name
                    </label>
                    <input
                      type="text"
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      placeholder="Enter a name for this version"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setSaveModalOpen(false)}
                      className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleManualSave}
                      className="px-4 py-2 text-sm rounded-lg bg-primary text-white hover:bg-primary/90"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
