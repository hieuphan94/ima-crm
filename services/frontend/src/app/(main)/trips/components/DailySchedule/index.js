'use client';
import { useDispatch, useSelector } from 'react-redux';
import ServicesSidebar from '../ServicesSidebar';
import DaysContainer from './components/DaysContainer';
import ScheduleModal from './components/ScheduleModal';
import TimeSlotsSidebar from './components/TimeSlotsSidebar';
import { useDragDrop } from './states/useDragDrop';
import { useScheduleState } from './states/useScheduleState';

export default function DailySchedule() {
  const { numberOfDays } = useSelector((state) => state.dailySchedule.settings);
  const { modalData } = useSelector((state) => state.dailySchedule.ui);

  const {
    // modalData,
    expandedSlots,
    toggleTimeSlot,
    // addService,
    // removeService,
    // closeModal,
    // openModal,
    // reorderServices,
    updateDayTitle,
  } = useScheduleState();

  const dispatch = useDispatch();

  const handleAddService = (day, time, service) => {
    console.log('handleAddService', day, time, service);
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

  console.log('modalData', modalData);

  const { handleDrop, handleDragOver, handleDragLeave } = useDragDrop();

  return (
    <div className="flex gap-4 h-full">
      {/* Left Sidebar */}
      <div className="flex-none">
        <ServicesSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex">
          {/* Time Slots Column */}
          <div className="flex-none">
            <TimeSlotsSidebar expandedSlots={expandedSlots} onToggleTime={toggleTimeSlot} />
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
                    updateDayTitle={updateDayTitle}
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
