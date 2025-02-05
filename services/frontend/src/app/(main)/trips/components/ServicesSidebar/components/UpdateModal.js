import { buttonStates } from '../constants/styles';

export default function UpdateModal({
  showModal,
  setShowModal,
  mockChanges,
  handleRefreshServices,
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4 shadow-xl">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Thay đổi từ server</h3>

        {mockChanges.added.length > 0 && (
          <div className="mb-2">
            <p className="text-[10px] font-medium text-green-600 mb-1">Thêm mới:</p>
            <ul className="text-[10px] text-gray-600 pl-4 space-y-0.5">
              {mockChanges.added.map((item, index) => (
                <li key={index} className="list-disc">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {mockChanges.updated.length > 0 && (
          <div className="mb-2">
            <p className="text-[10px] font-medium text-blue-600 mb-1">Cập nhật:</p>
            <ul className="text-[10px] text-gray-600 pl-4 space-y-0.5">
              {mockChanges.updated.map((item, index) => (
                <li key={index} className="list-disc">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {mockChanges.removed.length > 0 && (
          <div className="mb-2">
            <p className="text-[10px] font-medium text-red-600 mb-1">Đã xóa:</p>
            <ul className="text-[10px] text-gray-600 pl-4 space-y-0.5">
              {mockChanges.removed.map((item, index) => (
                <li key={index} className="list-disc">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setShowModal(false)}
            className={`text-[10px] px-3 py-1 rounded ${buttonStates.default.base}`}
          >
            Đóng
          </button>
          <button
            onClick={() => {
              handleRefreshServices();
              setShowModal(false);
            }}
            className="text-[10px] px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
          >
            Cập nhật ngay
          </button>
        </div>
      </div>
    </div>
  );
}
