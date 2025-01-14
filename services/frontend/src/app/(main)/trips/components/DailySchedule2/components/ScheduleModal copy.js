'use client';

import { memo, useCallback } from 'react';

function ScheduleModal({
  isOpen,
  onClose,
  services,
  day,
  time,
  onRemoveService,
  onReorderServices,
}) {
  if (!isOpen) return null;

  const handleDragStart = useCallback((e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.target.classList.add('opacity-50');
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    const dragTarget = e.target.closest('.service-item');
    if (dragTarget) {
      dragTarget.classList.add('bg-gray-100');
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    const dragTarget = e.target.closest('.service-item');
    if (dragTarget) {
      dragTarget.classList.remove('bg-gray-100');
    }
  }, []);

  const handleDrop = useCallback(
    (e, dropIndex) => {
      e.preventDefault();
      const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
      const dragTarget = e.target.closest('.service-item');
      if (dragTarget) {
        dragTarget.classList.remove('bg-gray-100');
      }

      if (dragIndex !== dropIndex) {
        const newServices = [...services];
        const [movedItem] = newServices.splice(dragIndex, 1);
        newServices.splice(dropIndex, 0, movedItem);
        onReorderServices(day, time, newServices);
      }
    },
    [services, day, time, onReorderServices]
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px] max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">
              Ngày {day} - {time}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
        </div>

        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {services.map((service, idx) => (
            <div
              key={`${service.id}-${idx}`}
              className="service-item flex items-start justify-between p-2 rounded border border-gray-100 hover:bg-gray-50 cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={(e) => e.target.classList.remove('opacity-50')}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm font-medium text-gray-500 w-6">#{idx + 1}</span>
                <span className="text-xl">{service.icon}</span>
                <div>
                  <div className="font-medium text-sm">{service.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onRemoveService(day, time, idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(ScheduleModal);
