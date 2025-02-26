'use client';

import { removeDay } from '@/store/slices/useDailyScheduleSlice';
import { memo, useCallback, useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useDragDrop } from '../../states/useDragDrop';
import DayViewModal from './DayViewModal';
import DeleteDayModal from './DeleteDayModal';

const DayHeader = memo(function DayHeader({ dayId, order, daySchedule }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const dispatch = useDispatch();

  // Add drag & drop handlers
  const {
    handleDayDragStart,
    handleDayDragEnd,
    handleDayHeaderDragOver,
    handleDayHeaderDragLeave,
    handleDayHeaderDrop,
  } = useDragDrop();

  // Lấy titleOfDay từ daySchedule nếu có
  const titleFromlocations = daySchedule?.titleOfDay || '';

  const handleDeleteDay = useCallback(() => {
    dispatch(removeDay({ dayId }));
    setIsDeleteModalOpen(false);
  }, [dayId, dispatch]);

  return (
    <>
      <div
        className="mb-1 flex items-center justify-between gap-1"
        draggable="true"
        onDragStart={(e) => handleDayDragStart(e, dayId, order)}
        onDragEnd={handleDayDragEnd}
        onDragOver={(e) => {
          e.preventDefault();
          handleDayHeaderDragOver(e);
        }}
        onDragLeave={handleDayHeaderDragLeave}
        onDrop={(e) => handleDayHeaderDrop(e, dayId, order)}
      >
        <h3
          className={`font-medium text-[12px] cursor-move max-w-[80px] truncate ${
            titleFromlocations ? 'text-green-600' : 'text-yellow-600'
          }`}
        >
          {order}
          {titleFromlocations ? (
            <span className="text-white text-[8px] rounded-full bg-black py-1 px-2 ml-1.5">
              {titleFromlocations}
            </span>
          ) : (
            ''
          )}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
          >
            <FiEye size={14} />
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <DayViewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={order}
          dayId={dayId}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteDayModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteDay}
      />
    </>
  );
}, arePropsEqual);

function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.dayId === nextProps.dayId &&
    JSON.stringify(prevProps.daySchedule) === JSON.stringify(nextProps.daySchedule)
  );
}

export default DayHeader;
