'use client';

import { createPortal } from 'react-dom';

const DeleteDayModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay with blur effect */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal with animation */}
      <div
        className="
          relative bg-white rounded-lg p-6 w-[400px] shadow-2xl
          animate-modal-appear
          transform transition-all
          z-[10000]
        "
      >
        <h3 className="text-lg font-medium mb-4 text-gray-800">Bạn có muốn xóa ngày này không?</h3>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded
              bg-gray-100 hover:bg-gray-200 
              text-gray-700
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-gray-400
            "
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="
              px-4 py-2 rounded
              bg-red-600 hover:bg-red-700 
              text-white
              transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-red-500
            "
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteDayModal;
