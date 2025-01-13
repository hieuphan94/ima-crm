'use client';
import { useEffect, useState } from 'react';
import ServicesSidebar from './ServicesSidebar';

// Thêm Modal component
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

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.target.closest('.service-item')?.classList.add('opacity-50');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.target.closest('.service-item')?.classList.add('bg-gray-100');
  };

  const handleDragLeave = (e) => {
    e.target.closest('.service-item')?.classList.remove('bg-gray-100');
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    e.target.closest('.service-item')?.classList.remove('bg-gray-100');

    if (dragIndex !== dropIndex) {
      const newServices = [...services];
      const [movedItem] = newServices.splice(dragIndex, 1);
      newServices.splice(dropIndex, 0, movedItem);
      onReorderServices(day, time, newServices);
    }
  };

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
              key={idx}
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
                  <div className="text-xs text-gray-500">{service.supplier}</div>
                  <div className="text-xs text-gray-400">
                    Ngày {service.scheduledDay} - {service.scheduledTime}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-700">{service.price}</span>
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

// Thêm hàm truncate text
const truncateText = (text, limit) => {
  if (text.length <= limit) return text;
  return text.slice(0, limit) + '...';
};

// Đưa hàm calculatePrice ra ngoài component để có thể tái sử dụng
const calculatePrice = (distance, pax) => {
  if (!pax || !distance) return 0;
  const distanceNum = parseFloat(distance) || 0;

  if (pax >= 20) return distanceNum * 300;
  if (pax >= 10) return distanceNum * 200;
  if (pax >= 5) return distanceNum * 100;
  if (pax >= 1) return distanceNum * 50;
  return 0;
};

// Thêm component DayNameModal
function DayNameModal({ isOpen, onClose, day, initialName, onSave }) {
  const [name, setName] = useState(initialName || '');
  const [images, setImages] = useState([]); // Lưu tối đa 3 hình
  const [searchTemplate, setSearchTemplate] = useState(''); // Search templates

  // Mock data cho templates
  const dayTemplates = [
    { id: 1, name: 'City Tour Hà Nội' },
    { id: 2, name: 'Vịnh Hạ Long' },
    { id: 3, name: 'Sapa Trekking' },
    { id: 4, name: 'Phố Cổ Hội An' },
    { id: 5, name: 'Đà Lạt Tour' },
  ];

  const filteredTemplates = dayTemplates.filter((template) =>
    template.name.toLowerCase().includes(searchTemplate.toLowerCase())
  );

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert('Chỉ được chọn tối đa 3 hình');
      return;
    }
    setImages((prev) => [...prev, ...files].slice(0, 3));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Đặt tên cho Ngày {day}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ×
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Tên ngày */}
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên ngày (vd: Hà Nội)"
              className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-blue-300"
            />
          </div>

          {/* Upload hình */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh (tối đa 3)
            </label>
            <div className="flex gap-2 mb-2">
              {images.map((file, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
              {images.length < 3 && (
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-400">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-3xl text-gray-400">+</span>
                </label>
              )}
            </div>
          </div>

          {/* Templates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mẫu ngày có sẵn</label>
            <div className="border border-gray-200 rounded">
              <div className="p-2 border-b border-gray-200">
                <input
                  type="text"
                  value={searchTemplate}
                  onChange={(e) => setSearchTemplate(e.target.value)}
                  placeholder="Tìm kiếm mẫu..."
                  className="w-full p-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-300"
                />
              </div>
              <div className="max-h-40 overflow-y-auto">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-2 hover:bg-gray-50 cursor-pointer text-sm"
                    onClick={() => setName(template.name)}
                  >
                    {template.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            Hủy
          </button>
          <button
            onClick={() => {
              onSave(day, name);
              onClose();
            }}
            className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

// Thêm ExportPreviewModal
function ExportPreviewModal({ isOpen, onClose, dayData }) {
  if (!isOpen || !dayData) return null;
  const { day, dayName, services = [], distance, price, guide } = dayData;

  // Tính tổng giá từ tất cả các dịch vụ
  const servicesTotal = services.reduce((total, service) => {
    // Xử lý giá có đuôi /ngày
    const servicePrice = service.price.replace(/đ\/ngày|đ/g, '').replace(/,/g, '');
    return total + parseInt(servicePrice);
  }, 0);

  // Tính tổng giá cuối cùng (services + distance price + guide)
  const totalPrice =
    servicesTotal +
    price +
    (guide ? parseInt(guide.price.replace(/đ\/ngày|đ/g, '').replace(/,/g, '')) : 0);

  const handleExportJSON = () => {
    const exportData = {
      day,
      dayName,
      services: services.map((service) => ({
        name: service.name,
        time: service.scheduledTime,
        supplier: service.supplier,
        price: service.price,
      })),
      distance,
      price,
      guide: guide
        ? {
            name: guide.name,
            phone: guide.phone,
            price: guide.price,
            time: '07:00',
          }
        : null,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schedule-day-${day}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Gom nhóm services theo giờ
  const groupedServices = services.reduce((acc, service) => {
    const time = service.scheduledTime;
    if (!acc[time]) {
      acc[time] = [];
    }
    acc[time].push(service);
    return acc;
  }, {});

  // Sắp xếp theo thời gian
  const sortedTimes = Object.keys(groupedServices).sort((a, b) => {
    const timeA = parseInt(a.split(':')[0]);
    const timeB = parseInt(b.split(':')[0]);
    return timeA - timeB;
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[500px] max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Lịch trình Ngày {day}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJSON}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Export JSON
              </button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ×
              </button>
            </div>
          </div>
        </div>

        {dayName && (
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <span className="text-sm text-gray-600">{dayName}</span>
          </div>
        )}

        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-2 text-sm font-medium text-gray-600 w-20">Giờ</th>
                <th className="pb-2 text-sm font-medium text-gray-600">Dịch vụ</th>
                <th className="pb-2 text-sm font-medium text-gray-600 text-right">Giá</th>
              </tr>
            </thead>
            <tbody>
              {sortedTimes.map((time) =>
                groupedServices[time].map((service, idx) => (
                  <tr key={`${time}-${idx}`} className="border-t border-gray-100">
                    {/* Chỉ hiển thị giờ cho dịch vụ đầu tiên trong nhóm */}
                    <td className="py-2 text-sm text-gray-600">{idx === 0 ? time : ''}</td>
                    <td className="py-2">
                      <div className="flex items-start gap-2">
                        <span className="text-base">{service.icon}</span>
                        <div>
                          <div className="text-sm font-medium">{service.name}</div>
                          <div className="text-xs text-gray-500">{service.supplier}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 text-sm text-right">{service.price}</td>
                  </tr>
                ))
              )}
              {guide && (
                <tr className="border-t border-gray-100">
                  <td className="py-2 text-sm text-gray-600">07:00</td>
                  <td className="py-2">
                    <div className="flex items-start gap-2">
                      <span className="text-base">👨‍👦</span>
                      <div>
                        <div className="text-sm font-medium">{guide.name}</div>
                        <div className="text-xs text-gray-500">{guide.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2 text-sm text-right">{guide.price}</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200">
                <td colSpan="2" className="py-2 text-sm font-medium">
                  Distance:
                </td>
                <td className="py-2 text-sm text-right">{distance} km</td>
              </tr>
              <tr>
                <td colSpan="2" className="py-2 text-sm font-medium">
                  Price:
                </td>
                <td className="py-2 text-sm text-right">{price.toLocaleString()} đ</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td colSpan="2" className="py-2 text-sm font-medium">
                  Tổng giá:
                </td>
                <td className="py-2 text-sm font-medium text-blue-600 text-right">
                  {totalPrice.toLocaleString()} đ
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DailySchedule({ numberOfDays, pax, guide, onPreview }) {
  // Các state hiện có
  const [scheduleItems, setScheduleItems] = useState({});
  const [distances, setDistances] = useState({});
  const [prices, setPrices] = useState({});
  const [modalData, setModalData] = useState(null);
  const [exportData, setExportData] = useState(null);

  // Thêm state cho tên ngày
  const [dayNames, setDayNames] = useState({}); // { 1: "Hà Nội", 2: "Hạ Long", ... }
  const [dayNameModal, setDayNameModal] = useState(null); // { day: 1, name: "" }

  // 1. Thay đổi state để quản lý nhiều slot
  const [expandedSlots, setExpandedSlots] = useState({}); // Format: { "1-06:00": true, "1-07:00": true }

  useEffect(() => {
    if (onPreview) {
      const getScheduleData = () => {
        // Đổi tên từ getData thành getScheduleData
        const data = {};
        let totalPrice = 0;
        let totalDistance = 0;

        for (let day = 1; day <= numberOfDays; day++) {
          const services = {};
          Object.keys(scheduleItems)
            .filter((key) => key.startsWith(`${day}-`))
            .forEach((key) => {
              services[key.split('-')[1]] = scheduleItems[key];
            });

          data[day] = {
            name: dayNames[day] || `Day ${day}`,
            services,
            distance: distances[day] || '0',
            price: prices[day] || 0,
          };

          totalPrice += prices[day] || 0;
          totalDistance += parseFloat(distances[day] || '0');
        }

        return {
          numberOfDays,
          pax,
          days: data,
          totalPrice,
          totalDistance,
        };
      };

      onPreview(getScheduleData); // Truyền function với tên đã sửa
    }
  }, [onPreview, scheduleItems, dayNames, distances, prices, numberOfDays, pax]);

  // 2. Cập nhật hàm toggle
  const toggleExpandSlot = (day, time) => {
    const baseTime = time.split(':')[0]; // Lấy giờ cơ bản (không có phút)

    setExpandedSlots((prev) => {
      const newExpandedSlots = { ...prev };

      // Toggle cho tất cả các ngày với cùng thời gian
      for (let currentDay = 1; currentDay <= numberOfDays; currentDay++) {
        const slotKey = `${currentDay}-${baseTime}:00`;
        newExpandedSlots[slotKey] = !prev[slotKey];
      }

      return newExpandedSlots;
    });
  };

  // Thêm helper function để kiểm tra slot có được expand không
  const isSlotExpanded = (day, time) => {
    const baseTime = time.split(':')[0];
    return expandedSlots[`${day}-${baseTime}:00`];
  };

  const handleDrop = (day, time, e) => {
    e.preventDefault();
    const service = JSON.parse(e.dataTransfer.getData('text/plain'));
    const slotKey = `${day}-${time}`;

    // Thêm thông tin thời gian vào service
    const serviceWithTime = {
      ...service,
      scheduledTime: time,
      scheduledDay: day,
    };

    setScheduleItems((prev) => {
      const currentServices = prev[slotKey] || [];

      // Kiểm tra trùng lặp
      const isDuplicate = currentServices.some(
        (existingService) => existingService.id === service.id
      );

      if (isDuplicate) return prev;

      return {
        ...prev,
        [slotKey]: [...currentServices, serviceWithTime],
      };
    });
  };

  // 1. Thêm helper function để xử lý thời gian một cách nhất quán
  const getSlotKey = (day, time) => `${day}-${time}`;

  // 2. Cập nhật hàm removeService
  const removeService = (day, time, index) => {
    const key = `${day}-${time}`;
    setScheduleItems((prev) => {
      const newItems = { ...prev };
      if (newItems[key]) {
        const newServices = [...newItems[key]];
        newServices.splice(index, 1);
        if (newServices.length === 0) {
          delete newItems[key];
          // Đóng modal nếu không còn service nào
          setModalData(null);
        } else {
          newItems[key] = newServices;
          // Cập nhật lại modalData với services mới
          if (modalData?.day === day && modalData?.time === time) {
            setModalData((prev) => ({ ...prev, services: newServices }));
          }
        }
      }
      return newItems;
    });
  };

  const reorderServices = (day, time, newServices) => {
    const key = `${day}-${time}`;
    setScheduleItems((prev) => ({
      ...prev,
      [key]: newServices,
    }));

    // Cập nhật lại modalData nếu đang mở modal của slot này
    if (modalData?.day === day && modalData?.time === time) {
      setModalData((prev) => ({ ...prev, services: newServices }));
    }
  };

  const days = numberOfDays && numberOfDays > 0 ? [...Array(numberOfDays)] : [];

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

  // Hàm mở modal
  const openModal = (day, time, services) => {
    setModalData({ day, time, services });
  };

  const handleExportDay = (day) => {
    const dayServices = Object.entries(scheduleItems)
      .filter(([key]) => key.startsWith(`${day}-`))
      .map(([key, services]) => ({
        time: key.split('-')[1],
        services,
      }))
      .sort((a, b) => {
        const timeA = parseInt(a.time.split(':')[0]);
        const timeB = parseInt(b.time.split(':')[0]);
        return timeA - timeB;
      });

    setExportData({
      day,
      dayName: dayNames[day],
      services: dayServices.flatMap((slot) => slot.services),
      distance: distances[day] || '0',
      price: prices[day] || 0,
      guide,
    });
  };

  // Thêm useEffect để tính lại giá khi pax thay đổi
  useEffect(() => {
    // Tính lại giá cho tất cả các ngày khi pax thay đổi
    const newPrices = {};
    Object.entries(distances).forEach(([day, distance]) => {
      newPrices[day] = calculatePrice(distance, pax);
    });
    setPrices(newPrices);
  }, [pax]); // Chạy lại khi pax thay đổi

  const handleDistanceChange = (day, value) => {
    // Chỉ cho phép nhập số và dấu chấm
    const sanitizedValue = value.replace(/[^\d.]/g, '');

    // Validate: chỉ cho phép 1 dấu chấm và tối đa 2 số sau dấu chấm
    if (sanitizedValue.split('.').length > 2) return;
    if (sanitizedValue.includes('.') && sanitizedValue.split('.')[1].length > 2) return;

    setDistances((prev) => ({
      ...prev,
      [day]: sanitizedValue,
    }));

    // Tính và cập nhật price
    const price = calculatePrice(sanitizedValue, pax);
    setPrices((prev) => ({
      ...prev,
      [day]: price,
    }));
  };

  // Thêm handlers cho drag & drop trong khung
  const handleDragStartInBox = (e, day, time, service) => {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        service,
        sourceDay: day,
        sourceTime: time,
      })
    );
    e.target.classList.add('opacity-50');
  };

  const handleDropInBox = (targetDay, targetTime, e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));

    // Nếu là service mới từ sidebar
    if (!data.sourceDay) {
      handleDrop(targetDay, targetTime, e);
      return;
    }

    // Nếu là di chuyển trong khung
    const { service, sourceDay, sourceTime } = data;
    const sourceKey = `${sourceDay}-${sourceTime}`;
    const targetKey = `${targetDay}-${targetTime}`;

    // Nếu kéo vào cùng vị trí thì không làm gì
    if (sourceKey === targetKey) return;

    setScheduleItems((prev) => {
      const newItems = { ...prev };

      // Xóa service từ vị trí cũ
      newItems[sourceKey] = prev[sourceKey].filter((s) => s.id !== service.id);
      if (newItems[sourceKey].length === 0) {
        delete newItems[sourceKey];
      }

      // Thêm vào vị trí mới
      const updatedService = {
        ...service,
        scheduledDay: targetDay,
        scheduledTime: targetTime,
      };

      newItems[targetKey] = [...(prev[targetKey] || []), updatedService];

      return newItems;
    });
  };

  return (
    <div className="mt-6">
      <DayNameModal
        isOpen={!!dayNameModal}
        onClose={() => setDayNameModal(null)}
        day={dayNameModal?.day}
        initialName={dayNameModal?.name}
        onSave={(day, name) => {
          setDayNames((prev) => ({
            ...prev,
            [day]: name,
          }));
        }}
      />
      {/* Các modal khác */}
      <ExportPreviewModal
        isOpen={!!exportData}
        onClose={() => setExportData(null)}
        dayData={exportData}
      />

      {/* Modal */}
      <ScheduleModal
        isOpen={!!modalData}
        onClose={() => setModalData(null)}
        services={modalData?.services || []}
        day={modalData?.day}
        time={modalData?.time}
        onRemoveService={removeService}
        onReorderServices={reorderServices}
      />

      <div className="flex">
        {/* Left Section */}
        <div className="flex-none flex">
          {/* Services Sidebar */}
          <ServicesSidebar />

          {/* Time Sidebar */}
          <div className="w-12 pt-8 ml-2">
            {timeGroups.map((group, groupIndex) => (
              <div key={group.label} className={groupIndex !== 0 ? 'mt-2' : ''}>
                {group.slots.map((time) => {
                  const slotKey = `1-${time}`;
                  const isExpanded = isSlotExpanded(1, time);

                  return (
                    <div key={time}>
                      {/* Regular time slot */}
                      <div className="h-[28px]">
                        <div
                          className={`text-[10px] text-gray-600 h-[28px] flex items-center justify-between px-2.5
                            ${group.bgColor} ${group.borderColor} border-r-2 font-medium
                            relative group`}
                        >
                          <span>{time}</span>

                          <button
                            onClick={() => toggleExpandSlot(1, time)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity
                              w-5 h-5 rounded-full 
                              bg-white hover:bg-gray-100
                              border border-gray-300 hover:border-gray-400
                              text-gray-500 hover:text-gray-700
                              flex items-center justify-center
                              shadow-sm hover:shadow
                              text-xs font-medium"
                          >
                            {isExpanded ? '−' : '+'}
                          </button>
                        </div>
                      </div>

                      {/* Expanded 30-min slot */}
                      {isExpanded && (
                        <div className="h-[28px]">
                          <div
                            className={`h-full rounded border border-gray-100 border-dashed px-2 relative
                              ${group.bgColor} bg-opacity-50`}
                          >
                            <span className="text-[10px] text-gray-600">
                              {time.split(':')[0]}:30
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Days Container */}
        <div className="relative" style={{ width: 'calc(160px * 7 + 8px * 6)' }}>
          <div className="overflow-x-auto">
            <div className="inline-flex gap-2">
              {days.map((_, dayIndex) => (
                <div
                  key={dayIndex}
                  className="w-[160px] flex-none bg-white rounded-lg shadow-sm border border-gray-200 p-2"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3
                      className="font-medium text-gray-900 text-xs cursor-pointer hover:text-blue-600 flex items-center gap-1"
                      onClick={() =>
                        setDayNameModal({
                          day: dayIndex + 1,
                          name: dayNames[dayIndex + 1] || '',
                        })
                      }
                    >
                      Day {dayIndex + 1}
                      {!dayNames[dayIndex + 1] && (
                        <span className="text-[8px] text-amber-400/70">miss</span>
                      )}
                    </h3>
                    <button
                      onClick={() => handleExportDay(dayIndex + 1)}
                      className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200"
                    >
                      Export
                    </button>
                  </div>

                  {/* Schedule Items */}
                  <div>
                    {timeGroups.map((group, groupIndex) => (
                      <div key={group.label} className={groupIndex !== 0 ? 'mt-2' : ''}>
                        {group.slots.map((time) => {
                          const currentSlotKey = `${dayIndex + 1}-${time}`;
                          const isExpanded = isSlotExpanded(dayIndex + 1, time);
                          const halfHourTime = `${time.split(':')[0]}:30`;
                          const halfHourKey = `${dayIndex + 1}-${halfHourTime}`;

                          return (
                            <div key={time}>
                              {/* Regular time slot */}
                              <div className="h-[28px]">
                                <div
                                  className="h-full rounded bg-gray-50 border border-gray-100 px-2 relative"
                                  onDragOver={(e) => e.preventDefault()}
                                  onDrop={(e) => handleDropInBox(dayIndex + 1, time, e)}
                                >
                                  {scheduleItems[`${dayIndex + 1}-${time}`]?.length > 0 && (
                                    <div className="absolute inset-0 flex flex-col justify-center gap-0.5 py-0.5 px-1 bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                                      {scheduleItems[`${dayIndex + 1}-${time}`].length === 1 ? (
                                        <div
                                          className="flex items-center justify-between w-full"
                                          draggable
                                          onDragStart={(e) =>
                                            handleDragStartInBox(
                                              e,
                                              dayIndex + 1,
                                              time,
                                              scheduleItems[`${dayIndex + 1}-${time}`][0]
                                            )
                                          }
                                        >
                                          <div className="flex items-center min-w-0 flex-1 mr-1">
                                            <span className="text-[11px] flex-shrink-0 mr-1">
                                              {scheduleItems[`${dayIndex + 1}-${time}`][0].icon}
                                            </span>
                                            <span className="text-[9px] truncate">
                                              {truncateText(
                                                scheduleItems[`${dayIndex + 1}-${time}`][0].name,
                                                20
                                              )}
                                            </span>
                                          </div>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              removeService(dayIndex + 1, time, 0);
                                            }}
                                            className="text-[9px] text-red-500 hover:text-red-700 flex-shrink-0"
                                          >
                                            ×
                                          </button>
                                        </div>
                                      ) : (
                                        <div
                                          className="cursor-pointer hover:bg-gray-50 w-full"
                                          onClick={() =>
                                            openModal(
                                              dayIndex + 1,
                                              time,
                                              scheduleItems[`${dayIndex + 1}-${time}`]
                                            )
                                          }
                                        >
                                          <div className="flex items-center min-w-0">
                                            <span className="text-[11px] flex-shrink-0 mr-1">
                                              {scheduleItems[`${dayIndex + 1}-${time}`][0].icon}
                                            </span>
                                            <span className="text-[9px] truncate">
                                              {truncateText(
                                                scheduleItems[`${dayIndex + 1}-${time}`][0].name,
                                                20
                                              )}
                                            </span>
                                          </div>
                                          <div className="text-[8px] text-gray-500">
                                            +{scheduleItems[`${dayIndex + 1}-${time}`].length - 1}{' '}
                                            dịch vụ khác
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Expanded 30-min slot */}
                              {isExpanded && (
                                <div className="h-[28px]">
                                  <div
                                    className={`h-full rounded border border-gray-100 border-dashed px-2 relative
                                      ${group.bgColor} bg-opacity-50`}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => handleDropInBox(dayIndex + 1, halfHourTime, e)}
                                  >
                                    {scheduleItems[halfHourKey]?.length > 0 && (
                                      <div className="absolute inset-0 flex flex-col justify-center gap-0.5 py-0.5 px-1 bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
                                        {scheduleItems[halfHourKey].length === 1 ? (
                                          <div
                                            className="flex items-center justify-between w-full"
                                            draggable
                                            onDragStart={(e) =>
                                              handleDragStartInBox(
                                                e,
                                                dayIndex + 1,
                                                halfHourTime,
                                                scheduleItems[halfHourKey][0]
                                              )
                                            }
                                          >
                                            <div className="flex items-center min-w-0 flex-1 mr-1">
                                              <span className="text-[11px] flex-shrink-0 mr-1">
                                                {scheduleItems[halfHourKey][0].icon}
                                              </span>
                                              <span className="text-[9px] truncate">
                                                {truncateText(
                                                  scheduleItems[halfHourKey][0].name,
                                                  20
                                                )}
                                              </span>
                                            </div>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                console.log(
                                                  'Removing service:',
                                                  dayIndex + 1,
                                                  halfHourTime
                                                ); // Debug
                                                removeService(dayIndex + 1, halfHourTime, 0);
                                              }}
                                              className="text-[9px] text-red-500 hover:text-red-700 flex-shrink-0"
                                            >
                                              ×
                                            </button>
                                          </div>
                                        ) : (
                                          <div
                                            className="cursor-pointer hover:bg-gray-50 w-full"
                                            onClick={() =>
                                              openModal(
                                                dayIndex + 1,
                                                halfHourTime,
                                                scheduleItems[halfHourKey]
                                              )
                                            }
                                          >
                                            <div className="flex items-center min-w-0">
                                              <span className="text-[11px] flex-shrink-0 mr-1">
                                                {scheduleItems[halfHourKey][0].icon}
                                              </span>
                                              <span className="text-[9px] truncate">
                                                {truncateText(
                                                  scheduleItems[halfHourKey][0].name,
                                                  20
                                                )}
                                              </span>
                                            </div>
                                            <div className="text-[8px] text-gray-500">
                                              +{scheduleItems[halfHourKey].length - 1} dịch vụ khác
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Distance và Price Section */}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">Distance:</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={distances[dayIndex + 1] || ''}
                          onChange={(e) => handleDistanceChange(dayIndex + 1, e.target.value)}
                          className="w-16 text-right text-xs p-1 border border-gray-200 rounded focus:outline-none focus:border-blue-300"
                          placeholder="0.00"
                        />
                        <span className="text-xs text-gray-500">km</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-600">Price:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-blue-600">
                          {(prices[dayIndex + 1] || 0).toLocaleString()}
                        </span>
                        <span className="text-xs text-blue-600">đ</span>
                      </div>
                    </div>
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
