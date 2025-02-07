'use client';
import { loadScheduleItems } from '@/store/slices/useDailyScheduleSlice';
import { useDispatch, useSelector } from 'react-redux';
import ServicesSidebar from '../ServicesSidebar/index';
import DaysContainer from './components/DaysContainer';
import ScheduleModal from './components/ScheduleModal';
import TimeSlotsSidebar from './components/TimeSlotsSidebar';
import { useDragDrop } from './states/useDragDrop';

export default function DailySchedule({ sheetServices }) {
  const { numberOfDays } = useSelector((state) => state.dailySchedule.settings);
  const { modalData, expandedSlots } = useSelector((state) => state.dailySchedule.ui);

  const dispatch = useDispatch();

  const handleAddService = (day, time, service) => {
    dispatch({
      type: 'dailySchedule/addService',
      payload: { day, time, service },
    });
  };

  const handleRemoveService = (day, time, service) => {
    dispatch({
      type: 'dailySchedule/removeService',
      payload: { day, time, service },
    });
  };

  const handleReorderServices = (day, time, newServices) => {
    dispatch({
      type: 'dailySchedule/reorderServices',
      payload: { day, time, newServices },
    });
  };

  const handleOpenModal = (day, time, services) => {
    dispatch({
      type: 'dailySchedule/openModal',
      payload: { day, time, services },
    });
  };

  const handleCloseModal = () => {
    dispatch({
      type: 'dailySchedule/closeModal',
    });
  };

  const handleToggleTimeSlot = (time) => {
    dispatch({
      type: 'dailySchedule/toggleTimeSlot',
      payload: time,
    });
  };

  const { handleDrop, handleDragOver, handleDragLeave } = useDragDrop();

  const handleLoadHistory = (historyData) => {
    if (!historyData?.scheduleItems) {
      console.warn('Invalid history data');
      return;
    }

    dispatch(loadScheduleItems(historyData.scheduleItems));
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Left Sidebar */}
      <div className="flex-none">
        <ServicesSidebar sheetServices={sheetServices} onLoadHistory={handleLoadHistory} />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex">
          {/* Time Slots Column */}
          <div className="flex-none">
            <TimeSlotsSidebar expandedSlots={expandedSlots} onToggleTime={handleToggleTimeSlot} />
          </div>

          {/* Days Container - Single scroll container */}
          <div className="relative" style={{ width: 'calc(160px * 7 + 8px * 6)' }}>
            <div className="overflow-x-auto">
              <div className={numberOfDays > 7 ? 'overflow-x-auto' : ''}>
                <div style={{ width: `${numberOfDays * 160}px` }}>
                  <DaysContainer
                    expandedSlots={expandedSlots}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(day, time, e) =>
                      handleDrop(
                        day,
                        time,
                        e,
                        handleAddService,
                        handleRemoveService,
                        handleReorderServices
                      )
                    }
                    onOpenModal={handleOpenModal}
                    onRemoveService={handleRemoveService}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalData?.isOpen && (
        <ScheduleModal
          {...modalData}
          onClose={handleCloseModal}
          onRemoveService={handleRemoveService}
          onReorderServices={handleReorderServices}
        />
      )}
    </div>
  );
}
