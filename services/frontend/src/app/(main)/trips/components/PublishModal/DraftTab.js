import {
  loadScheduleItems,
  setScheduleTitle,
  setSettingsSchedule,
} from '@/store/slices/useDailyScheduleSlice';
import { AlertCircle, CheckCircle, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
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

// Validation function cải tiến
const validateVersion = (version) => {
  if (!version) {
    console.log('Version is null or undefined');
    return false;
  }

  // Log chi tiết từng field để debug
  console.log('Validating version:', {
    hasScheduleData: !!version.scheduleData,
    scheduleDataEmpty: Object.keys(version.scheduleData || {}).length === 0,
    hasTripInfo: !!version.tripInfo,
    pax: version.tripInfo?.pax,
    numberOfDays: version.tripInfo?.numberOfDays,
    title: version.tripInfo?.title,
    starRating: version.tripInfo?.starRating,
  });

  // Kiểm tra scheduleData không rỗng
  if (!version.scheduleData || Object.keys(version.scheduleData).length === 0) {
    console.log('Schedule data is empty');
    return false;
  }

  // Kiểm tra các trường bắt buộc
  const requiredFields = [
    'scheduleData',
    'tripInfo',
    'tripInfo.pax',
    'tripInfo.numberOfDays',
    'tripInfo.title',
    'tripInfo.starRating',
  ];

  const validationResults = requiredFields.map((field) => {
    const fields = field.split('.');
    let value = version;
    for (const f of fields) {
      value = value?.[f];
    }
    const isValid = value !== undefined && value !== null;
    console.log(`Validating ${field}:`, { value, isValid });
    return isValid;
  });

  return validationResults.every((result) => result === true);
};

// Cleanup function
const cleanupOldVersions = (history) => {
  return history.slice(0, 20).sort((a, b) => new Date(b.date) - new Date(a.date));
};

const formatVersionInfo = (version) => {
  const tripInfo = version.tripInfo || {};
  const summary = `${tripInfo.title || 'Untitled'} (${tripInfo.numberOfDays || 0} days, ${tripInfo.pax || 0} pax, ${tripInfo.starRating || 0}★)`;

  // Giới hạn độ dài của summary
  const maxLength = 50;
  return summary.length > maxLength ? summary.substring(0, maxLength) + '...' : summary;
};

const styles = {
  versionItem: {
    padding: '12px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  versionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  versionDate: {
    color: '#666',
    fontSize: '0.9em',
  },
  versionContent: {
    fontSize: '1em',
    color: '#333',
  },
  versionActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  button: {
    padding: '6px 12px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: '500',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8em',
    fontWeight: 'bold',
  },
  badgePrimary: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
  },
  badgeSecondary: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  successMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: '4px',
    marginTop: '8px',
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    backgroundColor: '#ffebee',
    color: '#c62828',
    borderRadius: '4px',
    marginTop: '8px',
  },
};

export default function DraftTab({ onClose }) {
  const dispatch = useDispatch();

  // Di chuyển tất cả useSelector vào trong component
  const currentSchedule = useSelector((state) => state.dailySchedule.scheduleItems);
  const globalPax = useSelector((state) => state.dailySchedule.settings.globalPax);
  const numberOfDays = useSelector((state) => state.dailySchedule.settings.numberOfDays);
  const tripTitle = useSelector((state) => state.dailySchedule.scheduleInfo.title);
  const starRating = useSelector((state) => {
    const rating = state.dailySchedule.settings.starRating;
    return rating !== undefined && rating !== null ? rating : 4;
  });

  const [selectedVersion, setSelectedVersion] = useState(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loadSuccess, setLoadSuccess] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Load history from localStorage when component mounts
  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem('tripHistory') || '[]');
      setHistory(cleanupOldVersions(savedHistory));
    } catch (error) {
      console.error('Error loading history:', error);
      setHistory([]);
    }
  }, []);

  const handleManualSave = () => {
    try {
      if (!currentSchedule || Object.keys(currentSchedule).length === 0) {
        throw new Error('Schedule data is empty');
      }

      const versionName = saveName.trim() || `Trip-Code-${Math.random().toString(36).substr(2, 6)}`;

      const newVersion = {
        id: Date.now(),
        date: new Date().toISOString().replace('T', ' ').substr(0, 19),
        type: 'manual',
        changes: `Manually saved - ${versionName}`,
        scheduleData: currentSchedule,
        tripInfo: {
          pax: globalPax,
          numberOfDays: numberOfDays,
          title: tripTitle,
          starRating: starRating,
        },
      };

      const isValid = validateVersion(newVersion);
      if (!isValid) {
        throw new Error('Invalid version data structure');
      }

      const savedHistory = JSON.parse(localStorage.getItem('tripHistory') || '[]');
      const updatedHistory = cleanupOldVersions([newVersion, ...savedHistory]);

      localStorage.setItem('tripHistory', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setSaveModalOpen(false);
        setSaveName('');
      }, 1500);
    } catch (error) {
      console.error('Save error:', {
        message: error.message,
        currentState: {
          hasSchedule: !!currentSchedule,
          scheduleKeys: Object.keys(currentSchedule || {}),
          pax: globalPax,
          days: numberOfDays,
          title: tripTitle,
          rating: starRating,
        },
      });

      setLoadError(`Failed to save version: ${error.message}`);
      setTimeout(() => setLoadError(null), 3000);
    }
  };

  // Auto save
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      try {
        const newVersion = {
          id: Date.now(),
          date: new Date().toISOString().replace('T', ' ').substr(0, 19),
          type: 'auto',
          changes: 'Auto saved version',
          scheduleData: currentSchedule,
          tripInfo: {
            pax: globalPax,
            numberOfDays: numberOfDays,
            title: tripTitle,
            starRating: starRating,
          },
        };

        if (!validateVersion(newVersion)) {
          throw new Error('Invalid auto-save data');
        }

        const savedHistory = JSON.parse(localStorage.getItem('tripHistory') || '[]');
        const updatedHistory = cleanupOldVersions([newVersion, ...savedHistory]);

        localStorage.setItem('tripHistory', JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
      } catch (error) {
        console.error('Auto-save error:', error);
      }
    }, 3600000);

    return () => clearInterval(autoSaveInterval);
  }, [currentSchedule, globalPax, numberOfDays, tripTitle, starRating]);

  // Tính toán số trang và danh sách items cho trang hiện tại
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const currentItems = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleLoadVersion = (version) => {
    try {
      console.log('Loading version:', version);

      if (!validateVersion(version)) {
        throw new Error('Invalid version data structure');
      }

      // Load schedule items
      dispatch(loadScheduleItems(version.scheduleData));

      // Load title
      dispatch(setScheduleTitle(version.tripInfo.title));

      // Load all settings together (numberOfDays, globalPax, starRating)
      dispatch(
        setSettingsSchedule({
          numberOfDays: version.tripInfo.numberOfDays,
          globalPax: version.tripInfo.pax,
          starRating: version.tripInfo.starRating || 4, // fallback to 4 if not set
        })
      );

      setLoadSuccess(true);
      setTimeout(() => {
        setLoadSuccess(false);
        onClose?.();
      }, 1500);
    } catch (error) {
      console.error('Load error:', error);
      setLoadError(`Failed to load version: ${error.message}`);
      setTimeout(() => setLoadError(null), 3000);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Di chuyển renderVersionItem vào trong component
  const renderVersionItem = (version) => {
    const date = new Date(version.date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return (
      <div key={version.id} style={styles.versionItem}>
        <div style={styles.versionHeader}>
          <span style={styles.versionDate}>{date}</span>
          <span
            style={{
              ...styles.badge,
              ...(version.type === 'manual' ? styles.badgePrimary : styles.badgeSecondary),
            }}
          >
            {version.type === 'manual' ? 'Manual save' : 'Auto save'}
          </span>
        </div>
        <div style={styles.versionContent}>{formatVersionInfo(version)}</div>
        <div style={styles.versionActions}>
          <button onClick={() => handleLoadVersion(version)} style={styles.button}>
            Load
          </button>
        </div>
      </div>
    );
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

      {/* Error Message */}
      {loadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-700 text-sm">{loadError}</span>
        </div>
      )}

      {/* History List */}
      <div className="space-y-2">{currentItems.map((item) => renderVersionItem(item))}</div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1 mt-4">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`min-w-[32px] h-8 rounded ${
                currentPage === pageNumber
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      )}

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

      {/* Load Success Modal */}
      {loadSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" />
          <div className="relative bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex flex-col items-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
              <p className="text-lg font-medium">Loaded Successfully!</p>
            </div>
          </div>
        </div>
      )}

      {/* Thêm thông báo success/error */}
      {loadSuccess && (
        <div style={styles.successMessage}>
          <CheckCircle size={16} />
          Version loaded successfully
        </div>
      )}

      {loadError && (
        <div style={styles.errorMessage}>
          <AlertCircle size={16} />
          {loadError}
        </div>
      )}
    </div>
  );
}
