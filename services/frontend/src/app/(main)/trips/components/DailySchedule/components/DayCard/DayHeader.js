'use client';

import { addOneDay, removeDay } from '@/store/slices/useDailyScheduleSlice';
import { memo, useCallback, useState } from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { IoMdAdd } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { useDragDrop } from '../../states/useDragDrop';
import { formatTitleToShortName } from '../../utils/formatters';
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
  const titleFromlocations = formatTitleToShortName(daySchedule?.titleOfDay || '');

  const handleDeleteDay = useCallback(() => {
    dispatch(removeDay({ dayId }));
    setIsDeleteModalOpen(false);
  }, [dayId, dispatch]);

  const handleAddOneDay = useCallback(() => {
    try {
      dispatch(addOneDay({ dayId }));
    } catch (error) {
      console.error('Error adding new day:', error);
    }
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
        <div className="flex gap-0.5">
          <button onClick={() => setIsModalOpen(true)} className="text-black">
            <FiEye size={12} />
          </button>
          <button onClick={() => setIsDeleteModalOpen(true)} className="text-red-600 ml-1">
            <FiTrash2 size={12} />
          </button>
          <button onClick={handleAddOneDay} className="text-blue-600 ml-1 p-1 bg-blue-200 rounded">
            <IoMdAdd size={13} />
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
