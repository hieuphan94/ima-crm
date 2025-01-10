'use client';

export default function DailySchedule({ numberOfDays }) {
  const timeGroups = [
    {
      label: 'Sáng',
      slots: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
    },
    {
      label: 'Trưa',
      slots: ['12:00', '13:00', '14:00', '15:00', '16:00'],
    },
    {
      label: 'Tối',
      slots: ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'],
    },
  ];

  const services = [
    { id: 1, name: 'Di chuyển', icon: '🚌' },
    { id: 2, name: 'Khách sạn', icon: '🏨' },
    { id: 3, name: 'Ăn sáng', icon: '🍳' },
    { id: 4, name: 'Ăn trưa', icon: '🍱' },
    { id: 5, name: 'Ăn tối', icon: '🍽️' },
    { id: 6, name: 'Tham quan', icon: '🏛️' },
    { id: 7, name: 'Chèo thuyền', icon: '🚣' },
    { id: 8, name: 'Massage', icon: '💆' },
    { id: 9, name: 'Mua sắm', icon: '🛍️' },
    { id: 10, name: 'Check-in', icon: '📸' },
  ];

  const handleDragStart = (e, service) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(service));
  };

  return (
    <div className="mt-6">
      <div className="flex">
        {/* Left Section */}
        <div className="flex-none flex">
          {/* Services Sidebar */}
          <div className="w-32 mr-2 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <h3 className="font-medium text-gray-900 mb-2 text-xs">Dịch vụ</h3>
            <div className="space-y-1">
              {services.map((service) => (
                <div
                  key={service.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, service)}
                  className="flex items-center gap-1 p-1.5 rounded hover:bg-gray-50 cursor-move"
                >
                  <span className="text-base">{service.icon}</span>
                  <span className="text-xs">{service.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time Sidebar */}
          <div className="w-10 pt-8">
            {timeGroups.map((group) => (
              <div key={group.label}>
                <div className="text-[10px] font-medium text-gray-700 h-[28px] flex items-center">
                  {group.label}
                </div>
                {group.slots.map((time) => (
                  <div key={time} className="text-[10px] text-gray-500 h-[28px] flex items-center">
                    {time}
                  </div>
                ))}
                <div className="text-[10px] text-gray-500 h-[28px] flex items-center">+ Thêm</div>
              </div>
            ))}
          </div>
        </div>

        {/* Days Container */}
        <div className="relative" style={{ width: 'calc(160px * 7 + 8px * 6)' }}>
          <div className="overflow-x-auto">
            <div className="inline-flex gap-2">
              {[...Array(numberOfDays)].map((_, index) => (
                <div
                  key={index}
                  className="w-[160px] flex-none bg-white rounded-lg shadow-sm border border-gray-200 p-2"
                >
                  <div className="mb-2">
                    <h3 className="font-medium text-gray-900 text-xs">Ngày {index + 1}</h3>
                  </div>

                  {/* Schedule Items */}
                  <div>
                    {timeGroups.map((group) => (
                      <div key={group.label}>
                        <div className="h-[28px]" />
                        {group.slots.map((time) => (
                          <div key={time} className="h-[28px] mb-[1px]">
                            <div
                              className="h-full rounded bg-gray-50 border border-gray-100 px-1.5"
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                const service = JSON.parse(e.dataTransfer.getData('text/plain'));
                              }}
                            >
                              <input
                                type="text"
                                className="w-full h-full bg-transparent focus:outline-none text-xs"
                                placeholder="Thêm..."
                              />
                            </div>
                          </div>
                        ))}
                        {/* Nút thêm cho mỗi khung giờ */}
                        <div className="h-[28px] mb-[1px]">
                          <button
                            type="button"
                            className="w-full h-full text-[10px] text-primary hover:text-primary/80 flex items-center px-1.5"
                          >
                            + Thêm
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
