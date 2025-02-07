import { loadScheduleItems } from '@/store/slices/useDailyScheduleSlice';
import { CheckCircle, Clock, RotateCcw, Save } from 'lucide-react';
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

export default function DraftTab({ onClose }) {
  const dispatch = useDispatch();
  const currentSchedule = useSelector((state) => state.dailySchedule.scheduleItems);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [loadSuccess, setLoadSuccess] = useState(false);

  // Load history from localStorage when component mounts
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('tripHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  // Auto save mỗi 1 giờ
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const newVersion = {
        id: Date.now(),
        date: new Date().toISOString().replace('T', ' ').substr(0, 19),
        type: 'auto',
        changes: 'Auto saved version',
        scheduleData: currentSchedule,
      };

      // Lấy history hiện tại
      const savedHistory = JSON.parse(localStorage.getItem('tripHistory') || '[]');

      // Thêm version mới vào đầu mảng
      let updatedHistory = [newVersion, ...savedHistory];

      // Giới hạn số lượng history là 20
      if (updatedHistory.length > 20) {
        updatedHistory = updatedHistory.slice(0, 20);
      }

      // Lưu lại vào localStorage
      localStorage.setItem('tripHistory', JSON.stringify(updatedHistory));

      // Cập nhật state
      setHistory(updatedHistory);
    }, 3600000); // 1 giờ = 3600000 ms

    // Cleanup function
    return () => clearInterval(autoSaveInterval);
  }, [currentSchedule]); // Dependency array includes currentSchedule

  // Tính toán số trang và danh sách items cho trang hiện tại
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const currentItems = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleLoadVersion = (version) => {
    setSelectedVersion(version);
    if (version && version.scheduleData) {
      dispatch(loadScheduleItems(version.scheduleData));
      // Hiển thị modal thành công
      setLoadSuccess(true);
      // Đóng sau 1.5s
      setTimeout(() => {
        setLoadSuccess(false);
        onClose?.();
      }, 1500);
    } else {
      console.warn('Invalid schedule data in version:', version);
    }
  };

  const handleManualSave = () => {
    // Tạo tên version mới nếu không có tên được nhập
    const versionName = saveName.trim() || `Trip-Code-${Math.random().toString(36).substr(2, 6)}`;

    // Tạo object chứa thông tin version mới
    const newVersion = {
      id: Date.now(),
      date: new Date().toISOString().replace('T', ' ').substr(0, 19),
      type: 'manual',
      changes: `Manually saved - ${versionName}`,
      scheduleData: currentSchedule,
    };

    // Lấy history hiện tại từ localStorage
    const savedHistory = JSON.parse(localStorage.getItem('tripHistory') || '[]');

    // Thêm version mới vào đầu mảng
    const updatedHistory = [newVersion, ...savedHistory];

    // Lưu lại vào localStorage
    localStorage.setItem('tripHistory', JSON.stringify(updatedHistory));

    // Update history state after saving
    setHistory(updatedHistory);

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setSaveModalOpen(false);
      setSaveName('');
    }, 1500);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
      <div className="space-y-2">
        {currentItems.map((item) => (
          <div
            key={item.id}
            className={`px-4 py-2 border rounded-lg hover:border-primary/30 transition-colors ${
              selectedVersion?.id === item.id ? 'border-primary bg-primary/5' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 min-w-[150px]">{item.date}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 min-w-[80px] text-center">
                  {item.type === 'auto' ? 'Auto saved' : 'Manual save'}
                </span>
                <span className="text-sm text-gray-600 truncate">{item.changes}</span>
              </div>
              <button
                onClick={() => handleLoadVersion(item)}
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 ml-4"
              >
                <RotateCcw className="w-3 h-3" />
                Load
              </button>
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
}
