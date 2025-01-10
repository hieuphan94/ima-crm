'use client';
import ServicesSidebar from './ServicesSidebar';

export default function DailySchedule({ numberOfDays }) {
  const timeGroups = [
    {
      label: 'morning',
      slots: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
      bgColor: 'bg-amber-100',
      borderColor: 'border-amber-200',
    },
    {
      label: 'afternoon',
      slots: ['12:00', '13:00', '14:00', '15:00', '16:00'],
      bgColor: 'bg-sky-100',
      borderColor: 'border-sky-200',
    },
    {
      label: 'evening',
      slots: ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'],
      bgColor: 'bg-indigo-100',
      borderColor: 'border-indigo-200',
    },
  ];

  return (
    <div className="mt-6">
      <div className="flex">
        {/* Left Section */}
        <div className="flex-none flex">
          {/* Services Sidebar */}
          <ServicesSidebar />

          {/* Time Sidebar */}
          <div className="w-12 pt-8 ml-2">
            {timeGroups.map((group, groupIndex) => (
              <div key={group.label} className={groupIndex !== 0 ? 'mt-2' : ''}>
                {group.slots.map((time) => (
                  <div
                    key={time}
                    className={`text-[10px] text-gray-600 h-[28px] flex items-center justify-end pr-2.5
                      ${group.bgColor} ${group.borderColor} border-r-2 font-medium`}
                  >
                    {time}
                  </div>
                ))}
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
                    {timeGroups.map((group, groupIndex) => (
                      <div key={group.label} className={groupIndex !== 0 ? 'mt-2' : ''}>
                        {group.slots.map((time) => (
                          <div key={time} className="h-[28px]">
                            <div
                              className="h-full rounded bg-gray-50 border border-gray-100 px-2"
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
